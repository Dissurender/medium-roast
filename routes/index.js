const express = require('express');
const router = express.Router();

// router.use((req, res, next) => {
//   console.log(`${req.method} -- ${Date.now()}`);
//   next();
// });

router.get('/', function (req, res) {
  res.send('index');
});
router.use('/api', require('./api.js'));
router.use(
  '/secretingest',
  require('../controllers/ingestController.js').ingestTask
);

module.exports = router;
