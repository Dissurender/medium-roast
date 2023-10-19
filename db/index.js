const { createClient } = require('redis');

const client = createClient();

client.on('error', (err) => console.error('Redis Client bork bork...'));

await client.connect();
