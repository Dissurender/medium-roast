const base = 'https://hacker-news.firebaseio.com/';
import {
  createQuery,
  selectCommentQuery,
  selectStoryQuery,
} from '../db/index.js';

export async function getMostRecentStory() {
  const story = await fetch(base + `v0/maxitem.json`).then(
    processChunkedResponse
  );

  console.log('the story: ', story);

  // consumeData(story);
}

/**
 * Retrieves top stories from HN API
 * @async
 */
export async function getTopStories() {
  console.log('starting');
  const topStories = await fetch(base + 'v0/topstories.json').then(
    processChunkedResponse
  );

  // With the Interger[] we pass to the ingestor to fulfull the data
  const result = await ingestData(topStories.slice(0, 100), 'story');

  // const result = await ingestData(testData.slice(0, 100), 'story');
  console.log(result.length, ' items ingested');
}

/**
 * This helper function receives a ByteStream and mutates
 * into a String using 9th Level Magic then parses to Json.
 * @param {Promise<Response>} response - Response
 * @returns json of accumulated http chunks received
 */
function processChunkedResponse(response) {
  let text = '';
  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  return readChunk();

  function readChunk() {
    return reader.read().then(appendChunks);
  }

  function appendChunks(result) {
    const chunk = decoder.decode(result.value || new Uint8Array(), {
      stream: !result.done,
    });

    text += chunk;

    if (result.done) {
      return JSON.parse(text);
    } else {
      return readChunk();
    }
  }
}

/**
 *
 *
 * @param {*} id
 * @param {*} type
 * @return {*} 
 */
export async function checkDB(id, type) {
  console.log('lookup: ', id, type);

  if (type === 'story') {
    const story = await selectStoryQuery(id);
    console.log('story check: ', story);
    return story;
  } else if (type === 'comment') {
    const comment = await selectCommentQuery(id);
    console.log('comment check: ', comment);
    return comment;
  }
}

export async function fetchFromHN(id) {
  return await fetch(base + `v0/item/${id}.json`).then(processChunkedResponse);
}

/**
 * This is where the magic is, implementing a simple
 * work queue to hold a local copy of data and draining
 * it to mutate and store into the result array
 * @param {Integer[]} data - Array of IDs
 * @param type
 */
export async function ingestData(data, type) {
  let queue = [...data];
  let result = [];

  for (let i = 0; i < queue.length; i++) {
    let selectItem = await checkDB(queue[i], type);

    if (selectItem === null) {
      console.log(type, 'not found.');

      selectItem = await fetchFromHN(queue[i]);
      createQuery(selectItem, type);
    } else {
      console.log('story found.');
    }

    result.push(selectItem);
  }

  return result;
}

/**
 * Get story is a helper function for {@link ingestData}
 * to recurse the kids field and build out comment trees
 * @param {Story} item
 * @param type
 */
export async function getComments(item, type) {
  console.log('getting comments...', item.id, type);

  if (!item.kids) return item;
  const kids = await ingestData(item.kids, type);

  let newKids = [];

  for (let i = 0; i < kids.length; i++) {
    console.log('going deeper....');
    const temp = await getComments(kids[i], 'comment');
    console.log(temp);
    newKids.push(temp);
  }

  delete item['kids'];
  item['kids'] = newKids;

  return item;
}
