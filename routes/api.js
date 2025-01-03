import express from 'express';
const router = express.Router();
import {
  getComment,
  getRecentStories,
  getStory,
  getTopStories,
} from '../controllers/storiesController.js';

router.get('/stories/top', getTopStories);

router.get('/stories/fresh', getRecentStories);
router.use('/stories/:id', getStory);
router.use('/comments/:id', getComment);

export default router;
