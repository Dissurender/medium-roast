const base = 'https://hacker-news.firebaseio.com/';

module.exports = {
  getTopStories: async (req, res) => {
    console.log('starting');
    const response = await fetch(base + 'v0/topstories.json')
      .then(processChunkedResponse)
      .then((data) => {
        ingestData(data).then((results) => {
          res.json(results);
        });
      });
  },
  getStory: async (req, res) => {
    fetch(base + `v0/item/${req.params.story}.json`)
      .then(processChunkedResponse)
      .then((data) => {
        res.json(data);
      });
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
  let workQueue = new Queue();
  let result = [];

  while (queue.length > 0 && !workQueue.done) {
    while (workQueue.ready && queue.length > 0) {
      workQueue.enqueue(data.pop());
    }

    const cursor = workQueue.dequeue;

    const response = await fetch(base + `v0/item/${cursor}.json`);

    result.push(response);
  }

  return Promise.allSettled(result);
}

class Queue {
  constructor() {
    this.items = {};
    this.frontIndex = 0;
    this.backIndex = 0;
  }
  enqueue(item) {
    this.items[this.backIndex] = item;
    this.backIndex++;
    console.log(item + ' added to queue');
    return;
  }
  dequeue() {
    const item = this.items[this.frontIndex];
    delete this.items[this.frontIndex];
    this.frontIndex++;
    console.log(item + ' removed to queue');
    return item;
  }
  peek() {
    return this.items[this.frontIndex];
  }

  ready() {
    return Object.keys(this.items) < 10 && Object.keys(this.items) >= 0;
  }

  done() {
    return Object.keys(this.items).length === 0;
  }

  get printQueue() {
    return this.items;
  }
}
