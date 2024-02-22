/**
 * WorkQueue class is to hold a queue of Story IDs and provide a few methods to
 * interact with the queue.
 * @class WorkQueue
 * used in {@link ingestData}
 */

class WorkQueue {
  constructor() {
    this.queue = [];
    console.log('WorkQueue instantiated');
  }

  get size() {
    return this.queue.length;
  }

  // add the data items to the queue
  enqueue(data) {
    data.forEach((item) => {
      this.queue.push({
        item,
        addedAt: Date.now(),
      });
    });
  }

  // check if the queue is empty
  done() {
    return !(this.queue.length > 0) || this.queue.length === 0;
  }

  // remove the next item from the queue
  dequeue() {
    return this.queue.shift();
  }
}

export default WorkQueue;

