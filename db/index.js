const { Pool } = require('pg');
const config = require('./database.config.js')

console.log('Init DB..');

const pool = new Pool(config.development);

module.exports = {
  query: async (text, params) => {
    const initTime = Date.now();
    const response = await pool.query(text, params);
    const dur = Date.now() - initTime;
    console.log('PG Query fired:', { text, dur, rows: response.rowCount });
    return response;
  },
  pool,
};
