import express from 'express';
const router = express.Router();
import {
  getTopStories,
  getMostRecentStory,
} from '../controllers/ingestController.js';
import apiRouter from './api.js';

router.get('/', function (req, res) {
  res.send('index');
});

router.get('/docs', (req, res) => {
  res.render('index');
});

router.use('/api', apiRouter);

// TODO: refactor into middleware with cron
router.get('/secretingest', (req, res) => {
  console.info('/secretingest');
  getTopStories();
  res.redirect('/api/top');
});

router.get('/secretingestfull', (req, res) => {
  getMostRecentStory();
  res.redirect('/api/top');
});

// router.get('/:error', (req, res, next) => {
//   next(new Error('Test error handler..'));
// });

export default router;
