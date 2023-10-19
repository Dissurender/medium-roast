const base = 'https://hacker-news.firebaseio.com/';
import { query } from '../db/index.cjs';

/**
 * Retrieves top stories from HN API
 * @async
 * @returns { Object[]} Object Array
 */
export async function getTopStories() {
  console.log('starting');
  await fetch(base + 'v0/topstories.json')
    .then(processChunkedResponse)
    .then((stories) => {
      // With the Interger[] we pass to the ingestor to fulfull the data
      return ingestData(stories.slice(0, 2));
    })
    .then((data) => {
      console.log(data.length);
    });

  // TODO: implement the Caching function
  // const results = defaultCache.getAll();
  // console.log(typeof results);
  // res.json(results);
}
/**
 *
 * @param {Integer} item
 */
export async function getStory(item) {
  let story = await fetch(base + `v0/item/${item}.json`).then(
    processChunkedResponse
  );

  /*
   * TODO: Unwrap child Promise objects
   * Using the ingest helper function, create a Promise[]
   * and replace the child `ID`s with the fetched data
   */
  const children = await Promise.allSettled(
    story['kids'].map((kid) => {
      return ingestData([kid]);
    })
  );

  // Using the found child objects replace the held kids[int]
  delete story['kids'];
  story['kids'] = children;

  // Object.keys(story).map((key) => {
  //   if (key === 'kids') {
  //     delete story[key];
  //     story[key] = children.map((kid) => kid);
  //   }
  // });

  console.log(story);
}

/**
 * This helper function receives a ByteStream and mutates
 * into a String using 9th Level Magic then parses to Json.
 * @param {Promise<Response>} response - Response
 * @returns json of accumulated http chunks received
 */
function processChunkedResponse(response) {
  var text = '';
  var reader = response.body.getReader();
  var decoder = new TextDecoder();

  return readChunk();

  function readChunk() {
    return reader.read().then(appendChunks);
  }

  function appendChunks(result) {
    var chunk = decoder.decode(result.value || new Uint8Array(), {
      stream: !result.done,
    });
    console.log('got chunk of', chunk.length, 'bytes');
    text += chunk;
    console.log('text so far is', text.length, 'bytes\n');
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
 * @param {Integer[]} data - Array of ids
 * @returns {Object[]} result - Array of fetch objects
 */
async function ingestData(data) {
  let queue = [...data];
  let result = [];

  while (queue.length > 0) {
    const cursor = queue.pop();

    await fetch(base + `v0/item/${cursor}.json`)
      .then(processChunkedResponse)
      .then((data) => {
        const type = data.type;
        console.log(type);
        insertQuery(data);
        result.push(data);
      });
  }

  return result;
}

async function insertQuery(item) {
  const template = `INSERT INTO stories (id, by, time, descendants, score, title, url, text) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`;
  const values = [
    item['id'],
    item['by'],
    item['time'],
    item['descendants'],
    item['score'],
    item['title'],
    item['url'],
    item['text'],
  ];

  try {
    const res = await query(template, values);
    console.log(`Inserted item: ${values[0]}`);
  } catch (error) {
    console.error(error);
  }
}

process.on('message', (message) => {
  process.send({ id: command.id, data: 'finished.' });
});
