require('dotenv').config({ path: './.env' });

const { DEV_DATABASE_HOST,
        DEV_DATABASE_PASSWORD, 
        DEV_DATABASE_USERNAME } =
  process.env;

module.exports = {
  development: {
    user: DEV_DATABASE_USERNAME,
    password: DEV_DATABASE_PASSWORD,
    host: DEV_DATABASE_HOST,
    port: '5432',
    database: 'hndb',
    max: 15,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 3000,
  },
};
