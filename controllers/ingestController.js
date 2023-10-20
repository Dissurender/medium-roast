const base = 'https://hacker-news.firebaseio.com/';
import { insertQuery, checkExists } from '../db/index.cjs';

/**
 * Starting point for the consume function, fetches
 * the most recent ID and passes the data to consumeData
 */
export async function getMostRecentStory() {
  const story = await fetch(base + `v0/item/maxitem.json`).then(
    processChunkedResponse
  );

  console.log(story)

  consumeData(story);
}

/**
 * Retrieves top stories from HN API
 * @async
 */
export async function getTopStories() {
  console.log('starting');
  await fetch(base + 'v0/topstories.json')
    .then(processChunkedResponse)
    .then((stories) => {
      // With the Interger[] we pass to the ingestor to fulfull the data
      ingestData(stories.slice(0, 10));
    });
}
/**
 * Get story is a helper function for {@link ingestData}
 * to recurse the kids field and build out comment trees
 * @param {Integer} item
 */
async function getStory(item) {
  let story = await fetch(base + `v0/item/${item}.json`).then(
    processChunkedResponse
  );

  const children = await Promise.allSettled(
    story['kids'].map((kid) => {
      return ingestData([kid]);
    })
  );

  // Using the found child objects to replace the held kids[int]
  delete story['kids'];
  story['kids'] = children;

  console.log(story);
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

// DOES THIS EVEN WORK?
/**
 * This is where the magic is, implementing a simple
 * work queue to hold a local copy of data and draining
 * it to mutate and store into the result array
 * @param {Integer[]} data - Array of IDs
 */
async function ingestData(data) {
  let queue = [...data];
  let result = [];

  while (queue.length > 0) {
    const cursor = queue.pop();

    const story = await fetch(base + `v0/item/${cursor}.json`).then(
      processChunkedResponse
    );
    if (checkExists(story['id'])) {
      console.log('Story exists...');
      // const found = selectQuery(story['id']);
      // result.push(found);
      continue;
    } else {
      insertQuery(data);
      result.push(data);
    }
  }
}

/**
 * ConsumeData is the beginnings of a tree crawler
 * that will traverse stories and thier comments
 * recursively.
 *
 * @param {Integer} data Starting point ID
 */
async function consumeData(data) {
  const start = data;
  const end = start - 10;
  let result = [];

  console.log("consuming...")

  for (let i = start; i > end; i--) {
    const story = await fetch(base + `v0/item/${i}.json`).then(
      processChunkedResponse
    );
    if (checkExists(story['id'])) {
      console.log('Story exists...');
      result.push(data);
      continue;
    } else {
      insertQuery(data);
      result.push(data);
    }
  }
}
