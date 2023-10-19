const { Pool } = require('pg');

require('dotenv').config('../config/.env');

console.log('DB init...');
const pool = new Pool({
  user: 'code',
  password: 'limuxmint',
  database: 'hndb',
  port: 5432,
  host: 'localhost',
});

/**
 * 
 * @param {String} text -- Query string
 * @param {Array} params 
 * @returns 
 */
async function query(text, params) {
  const start = Date.now();
  const res = await pool.query(text, params);
  const duration = Date.now() - start;
  console.log('executed query', { text, duration, rows: res.rowCount });
  return res;
}

module.exports = {
  query,
  pool,
};
