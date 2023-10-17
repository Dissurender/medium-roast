const base = 'https://hacker-news.firebaseio.com/';

module.exports = {
  getTopStories: async (req, res) => {
    console.log('starting');
    await fetch(base + 'v0/topstories.json')
      .then(processChunkedResponse)
      .then((stories) => {
        return ingestData(stories.slice(0, 20));
      })
      .then((data) => {
        // console.log(data);
        console.log(data.length);
        res.json(data);
      });
  },
  getStory: async (req, res) => {
    let story = await fetch(base + `v0/item/${req.params.story}.json`).then(
      processChunkedResponse
    );

    /*
     * TODO: Unwrap child Promise objects
     */

    const children = await Promise.allSettled(
      story['kids'].map((kid) => {
        return ingestData([kid]);
      })
    );
    console.log(children.length);

    Object.keys(story).map((key) => {
      if (key === 'kids') {
        delete story[key];

        story[key] = children.map((kid) => kid);
      }
    });

    console.log('AFTER -- ' + story);

    res.json(story);
  },
};

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
      console.log('returning');
      return JSON.parse(text);
    } else {
      console.log('recursing');
      return readChunk();
    }
  }
}

// DOES THIS EVEN WORK?
async function ingestData(data) {
  let queue = [...data];
  let result = [];

  while (queue.length > 0) {
    const cursor = queue.pop();

    await fetch(base + `v0/item/${cursor}.json`)
      .then(processChunkedResponse)
      .then((data) => {
        result.push(data);
      });
  }

  return result;
}
