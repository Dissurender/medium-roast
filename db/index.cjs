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
  let res;

  if (values) {
    res = await client.query(text, values);
  } else {
    res = await client.query(text);
  }

  const duration = Date.now() - start;
  console.log('executed query', { text, duration, rows: res.rowCount });
  return res;
}

async function checkExists(id) {
  const template = 'SELECT * from stories WHERE id=$1';
  const value = [id];

  try {
    console.log('checkExist');
    const res = await query(template, value);
    console.log(res['rows'][0]);
  } catch (error) {
    console.error(error);
  }
}

async function selectQuery(id) {
  const template = 'SELECT * from stories WHERE id=$1';
  const value = [id];

  try {
    console.log('selectQuery');
    const res = await query(template, value);
    return res['rows'][0];
  } catch (error) {
    console.error(error);
  }
}

async function selectAllQuery() {
  const template = 'SELECT * from stories';

  try {
    console.log('selectAllQuery');
    const res = await query(template);
    return res['rows'];
  } catch (error) {
    console.error(error);
  }
}

async function insertQuery(item) {
  // const itemType = item['type'] === 'story' ? 'stories' : 'comments';
  const template =
    'INSERT INTO stories (id, deleted, type, by, time, dead, descendants, score, title, url, text, parent, kids) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)';

  const value = [
    item['id'],
    item['deleted'] || null,
    item['type'],
    item['by'] || null,
    item['time'] || null,
    item['dead'] || null,
    item['descendants'] || null,
    item['score'] || null,
    item['title'] || null,
    item['url'] || null,
    item['text'] || null,
    item['parent'] || null,
    item['kids'] || null,
  ];
  console.log('insertQuery');
  const res = await query(template, value);
  console.log('inserted: ', res);
}

module.exports = {
  insertQuery,
  selectQuery,
  selectAllQuery,
  checkExists,
};
