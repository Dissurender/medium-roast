import express from 'express';
const app = express();
import routes from './routes/index.js';
import morgan from 'morgan';
// import {startCron} from './utils/cron.js';
import { errMiddleware } from './utils/errorHandler.js';
import { logger } from './utils/winston.js';
import { initPrisma } from './db/index.js';
import url from 'url';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

// import { requestLogger } from './middleware/logger.js';
const port = process.env.PORT || 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs'); // TODO: ejs config
app.use(express.static(__dirname + '/docs'));
app.use(morgan('dev'));

initPrisma(3, 1000)
  .then(() => {
    
    app.use(errMiddleware);

    // use CORS middleware
    app.use((req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
      next();
    });

    // app.use(startCron);
    
    app.use(routes);

    app.listen(port, () => {
      console.log(`Server is running on port: http://localhost:${port}/`);
    });
  })
  .catch((error) => {
    logger.error('Prisma initialization failed:', error);
    // restart process?
    process.exit(1);
  });
