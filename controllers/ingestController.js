const child_process = require('child_process');
const child = child_process.fork(__dirname + './utils/ingest.js');

var taskId = 0;
var tasks = {};

child.on('message', (message) => {
  tasks[message.id](message.data);
});

module.exports = {
  ingestTask: async (data, callback) => {
    const id = taskId++;
  
    child.send({ id: id, data: data });
  
    tasks[id] = callback;
  }
};
