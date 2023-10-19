import express from 'express';
const router = express.Router();
import { ingestTask } from '../controllers/ingestController.js';
import apiRouter from './api.js';

// router.use((req, res, next) => {
//   console.log(`${req.method} -- ${Date.now()}`);
//   next();
// });

router.get('/', function (req, res) {
  res.send('index');
});
router.use('/api', apiRouter);

// TODO: refactor into middleware
router.use('/secretingest', ingestTask);

export default router;
