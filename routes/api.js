import express from 'express';
const router = express.Router();
import {
  getComment,
  getStory,
  getTopStories,
} from '../controllers/storiesController.js';
import { getMostRecentStory } from '../controllers/ingestController.js';

router.get('/stories/top', getTopStories);

router.get('/stories/fresh', getMostRecentStory);
router.use('/stories/:id', getStory);
router.use('/comments/:id', getComment);

export default router;
