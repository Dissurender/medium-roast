const { Client } = require('pg');
require('dotenv').config('../config/.env');

console.log('DB init...ingest');
const client = new Client({
  host: 'localhost',
  port: 55001,
  database: 'hndb',
  username: 'postgres',
  password: 'linuxmint',
  
});
client.connect();

/**
 * Standardize DB queries with logging
 * @param {String} text -- Query string
 * @param {Array} params -- Array of data
 * @returns {Promise}
 */
async function query(text, values) {
  const start = Date.now();
  const res = await client.query(text, values);

  const duration = Date.now() - start;
  console.log('executed query', { text, duration, rows: res.rowCount });
  return res;
}

module.exports = {
  query,
};
