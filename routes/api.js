import express from 'express';
const router = express.Router();
import {
  getComment,
  getStory,
  getTopStories,
} from '../controllers/storiesController.js';

router.use('/top', getTopStories);
router.use('/stories/:id', getStory);
router.use('/comments/:id', getComment);

export default router;
