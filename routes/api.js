const express = require('express');
const router = express.Router();
const storiesController = require('../controllers/storiesController.js');

router.use('/top', storiesController.getTopStories);
router.use('/:story', storiesController.getStory);

module.exports = router;
