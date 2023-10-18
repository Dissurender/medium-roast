const express = require('express');
const router = express.Router();

// router.use((req, res, next) => {
//   console.log(`${req.method} -- ${Date.now()}`);
//   next();
// });

router.get('/', function (req, res) {
  res.send('index.html');
});
router.use('/api', require('./api.js'))

module.exports = router;
