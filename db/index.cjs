const { Client } = require('pg');

const temp = `postgresql://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@${process.env.DATABASE_HOST}:${process.env.DATABASE_PORT}/hndb`;

// TODO: fix .env values
console.log('DB init...ingest');
const client = new Client({
  temp,
});
client.connect();

/**
 * Standardize DB queries with logging
 * used in {@link checkExists}, {@link selectQuery},
 * {@link selectAllQuery}, {@link insertQuery}
 * @param {String} text Query string
 * @param {Array} values Array of data (optional)
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
  console.log('executed query', { text, values, duration, rows: res.rowCount });
  return res;
}

/**
 * Query the database to check if we have the story.
 * @param {Integer} id
 * @returns {boolean}
 */
async function checkExists(id) {
  const template = 'SELECT * from stories WHERE id=$1';
  const value = [id];

  try {
    console.log('checkExist');
    const res = await query(template, value);
    if (res['rowCount'] > 0) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error(error);
  }
}

/**
 *
 *
 * @param {*} id
 * @return {*}
 */
async function selectQuery(id) {
  const template = 'SELECT * from stories WHERE id=$1';
  const value = [id];

  try {
    console.log('selectQuery');
    const res = await query(template, value);
    const result = res['rows'][0];
    return result;
  } catch (error) {
    console.error(error);
  }
}

/**
 *
 *
 * @return {*}
 */
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

/**
 *
 *
 * @param {*} item
 */
async function insertQuery(item) {
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
