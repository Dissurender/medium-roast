const express = require('express');
const router = express.Router();
const topController = require('../controllers/storiesController.js');

router.get('/', function (req, res) {
  res.send('index.html');
});
router.get('/top', topController.getTopStories);
router.get('/:story', topController.getStory);

module.exports = router;
