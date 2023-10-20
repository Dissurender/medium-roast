import express from 'express';
const app = express();
import routes from './routes/index.js';

import { requestLogger } from './middleware/logger.js';
const port = process.env.PORT || 8000;

app.use(express.static('/public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(morgan('dev'));

app.use(requestLogger);

app.use(routes);

app.listen(port, () => {
  `Server is running on port: http://localhost:${port}/`;
});
