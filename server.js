import express from 'express';
const app = express();
import routes from './routes/index.js';
import morgan from 'morgan';
// import {startCron} from './utils/cron.js';
import { errMiddleware } from './utils/errorHandler.js';
import { logger } from './utils/winston.js';
import { initPrisma } from './db/index.js';
import url from 'url';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerui from 'swagger-ui-express';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

import { requestLogger } from './middleware/logger.js';
const port = process.env.PORT || 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/docs'));
app.use(morgan('dev'));

const options = {
  definition: {
    openapi: '3.1.0',
    info: {
      title: 'Medium Roast API',
      version: '1.0.0',
      description: 'A proxy API for Hacker News',
      license: {
        name: 'GPL-3.0',
        url: 'https://www.gnu.org/licenses/gpl-3.0.html',
      },
      contact: {
        name: 'Diss',
        url: 'https://www.github.com/Dissurender',
        email: 'devrhyn@gmail.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:8080/',
        description: 'Demo server',
      },
    ],
  },
  apis: ['./routes/*.js'],
};

// initPrisma allows the server to retry N times before throwing and exiting
// Initialize a http server if database successfully connects
// TODO: Add exponiential backoff for retries
initPrisma(3, 1000)
  .then(() => {
    app.use(errMiddleware);

    // use CORS middleware
    app.use((req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept'
      );
      next();
    });

    const spec = swaggerJSDoc(options);
    app.use('/swagger-ui/', swaggerui.serve, swaggerui.setup(spec, { explorer: true }));

    // app.use(startCron);

    app.use(routes);

    app.listen(port, () => {
      console.log(`Server is running on port: http://localhost:${port}/`);
    });
  })
  .catch((error) => {
    logger.error('Prisma initialization failed:', error);
    logger.info(`

      Please refer to the README to initialize Prisma
      `);
    // restart process?
    process.exit(1);
  });
