const base = 'https://hacker-news.firebaseio.com/';
import { createQuery, checkDB } from '../db/index.js';
import { logger } from '../utils/winston.js';
import WorkQueue from '../utils/workQueue.js';
// instantiate a new work queue
const work = new WorkQueue();

/**
 * Retrieves the most recent story from the Hacker News API and traverses the IDs
 * 100 most revcent stories. It then passes the retrieved stories to the {@link ingestData}
 * @async
 * @returns {Promise<Story>} - Story object
 *
 */
export async function getMostRecentStory() {
  const story = await fetch(base + `v0/maxitem.json`).then(
    processChunkedResponse
  );

  logger.info('the story: ' + story.id);

  // create an array of the 100 most recent stories from the most recent story id
  const ids = Array.from({ length: 100 }, (_, i) => story - i);
  const result = await ingestData(ids, 'story');

  logger.info(`${result.length} items ingested`);
}

/**
 * retrieves the top stories from the Hacker News API.
 * It then passes the retrieved stories to the {@link ingestData}
 * function to process and store them in a database.
 * @async
 */
export async function getTopStories() {
  logger.info('starting Top Stories..');
  const topStories = await fetch(base + 'v0/topstories.json').then(
    processChunkedResponse
  );

  // With the Interger[] we pass to the ingestor to fulfull the data
  const result = await ingestData(topStories.slice(0, 100), 'story');

  logger.info(`${result.length} items ingested`);
}

/**
 * This helper function receives a ByteStream and mutates
 * into a String using 9th Level Magic then parses to Json.
 * @param {Promise<Response>} response - Response
 * @returns Object of accumulated http chunks received
 */
function processChunkedResponse(response) {
  let text = '';
  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  return readChunk().catch((error) => {
    logger.error('Error reading chunk: ' + error);
    throw new Error(error);
  });

  function readChunk() {
    return reader.read().then(appendChunks);
  }

  function appendChunks(result) {
    const chunk = decoder.decode(result.value || new Uint8Array(), {
      stream: !result.done,
    });

    text += chunk;

    if (result.done) {
      try {
        return JSON.parse(text);
      } catch (error) {
        logger.error('Error parsing JSON:' + error);
        throw new Error(error);
      }
    } else {
      return readChunk();
    }
  }
}

/**
 * Fetches a story from the Hacker News API
 * @param {Number} id - ID of the story
 * @returns {Promise<Story>} - Story object
 */
export async function fetchFromHN(id) {
  return await fetch(base + `v0/item/${id}.json`).then(processChunkedResponse);
}

/**
 * This is where the magic is, implementing a simple
 * work queue to hold a local copy of data and draining
 * it to mutate and store into the result array
 * @param {Array<Number>} data - Array of IDs
 * @param {String} type
 * @returns {Array<Object>}
 */
export async function ingestData(data, type) {
  // return if data is bad and log the error
  if (data === null) {
    logger.error('IngestData parameter `data` is null.');
    return;
  }

  work.enqueue(data);

  let result = [];

  while (!work.done()) {
    const item = work.dequeue();
    let selectItem = await checkDB(item.item, type);

    if (selectItem === null) {
      logger.info(`${type} not found.`);

      selectItem = await fetchFromHN(item.item);
      createQuery(selectItem, type);
    } else {
      logger.info('story found.');
    }

    result.push(selectItem);
  }

  return result;
}

/**
 * getComments is a helper function for {@link ingestData}
 * to recurse the kids(Comments) field and build out comment trees
 * @param {Story} item
 * @param type
 */
export async function getComments(item, type) {
  // validate input item for escape clause
  if (!item.kids || typeof item !== 'object') {
    logger.warn(`${item} is not valid.`);
    return item;
  }
  logger.info('Getting comments for ' + item.id);

  const kids = await ingestData(item.kids, type);

  let newKids = [];
  for (let i = 0; i < kids.length; i++) {
    const temp = await getComments(kids[i], 'comment');
    newKids.push(temp);
  }

  const newItem = { ...item, kids: newKids };

  return newItem;
}
