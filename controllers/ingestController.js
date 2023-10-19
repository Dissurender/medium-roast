import child_process from 'child_process';
const child = child_process.fork('./utils/ingest.js');

var taskId = 0;
var tasks = {};

child.on('message', (message) => {
  tasks[message.id](message.data);
});

export const ingestTask = (data, callback) => {
  const id = taskId++;

  child.send({ id: id, data: data });

  tasks[id] = callback;
};
