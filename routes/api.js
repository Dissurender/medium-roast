import express from 'express';
const router = express.Router();
import { getStory, getTopStories } from '../controllers/storiesController.js';

router.use('/top', getTopStories);
router.use('/:story', getStory);

export default router;
