const { createClient } = require('redis');

const client = createClient({
  // url: `redis://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@${process.env.DATABASE_HOST}:${process.env.DATABASE_PORT}`
  url: 'redis://127.0.0.1:6379',
});

client.on('error', (err) => console.error('Redis Client bork bork...', err));

await client.connect();

if (client.isReady) {
  console.log("Redis ready...")
}
