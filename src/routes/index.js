const express = require('express');
const router = express.Router();
const storiesController = require('../controllers/storiesController.js');

router.get('/', function (req, res) {
  res.send('index.html');
});
router.get('/top', storiesController.getTopStories);
router.get('/:story', storiesController.getStory);

module.exports = router;
