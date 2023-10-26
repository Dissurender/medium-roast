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
  res.redirect('http://localhost:52330/docs/index.html');
});

router.use('/api', apiRouter);

// TODO: refactor into middleware
router.use('/secretingest', (req, res) => {
  console.info('/secretingest');
  getTopStories();
  res.redirect('/api/top');
});

router.use('/secretingestfull', () => {
  getMostRecentStory();
  // res.redirect('/api/top')
});

export default router;
