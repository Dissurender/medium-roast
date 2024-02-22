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

// TODO: refactor into middleware with cron job
router.get('/secretingest', (req, res) => {
  console.info('/secretingest');
  getTopStories();
  res.redirect('/api/top');
});

router.get('/secretingestfull', (req, res) => {
  getMostRecentStory();
  res.redirect('/api/top');
});

// handle 404
router.use((req, res) => {
  res.status(404).send('404: Page not Found');
});

export default router;
