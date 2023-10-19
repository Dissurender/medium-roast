const { Pool } = require('pg');

const { DEV_DATABASE_HOST, DEV_DATABASE_PASSWORD, DEV_DATABASE_USERNAME } =
  require('dotenv').config('../config/.env');

console.log('DB init...');
const pool = new Pool({
  host: DEV_DATABASE_HOST,
  user: DEV_DATABASE_USERNAME,
  password: DEV_DATABASE_PASSWORD,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

module.exports = {
  query: async (text, params) => {
    const start = Date.now();
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('executed query', { text, duration, rows: res.rowCount });
    return res;
  },
};
