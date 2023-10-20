
process.on('message', (message) => {
  process.send({ id: command.id, data: 'finished.' });
});
