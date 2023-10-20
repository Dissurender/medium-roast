import express from 'express';
const router = express.Router();
import {
  getTopStories,
  getAllStories,
} from '../controllers/ingestController.js';
import apiRouter from './api.js';

// router.use((req, res, next) => {
//   console.log(`${req.method} -- ${Date.now()}`);
//   next();
// });

router.get('/', function (req, res) {
  res.send('index');
});

router.get('/docs', (req, res) => {
  res.redirect('http://localhost:52330/docs/index.html')
})

router.use('/api', apiRouter);

// TODO: refactor into middleware
router.use('/secretingest', (req, res) => {
  getTopStories;
  res.redirect('/api/top');
});

router.use('/secretingestfull', () => {
  getAllStories;
  // res.redirect('/api/top')
});

export default router;
