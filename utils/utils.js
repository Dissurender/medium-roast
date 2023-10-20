/* eslint-disable no-unused-vars */
function roughSizeOfObject(object) {
  var objectList = [];
  var stack = [object];
  var bytes = 0;

  while (stack.length) {
    var value = stack.pop();

    if (typeof value === 'boolean') {
      bytes += 4;
    } else if (typeof value === 'string') {
      bytes += value.length * 2;
    } else if (typeof value === 'number') {
      bytes += 8;
    } else if (typeof value === 'object' && objectList.indexOf(value) === -1) {
      objectList.push(value);

      for (var i in value) {
        stack.push(value[i]);
      }
    }
  }
  return bytes;
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
