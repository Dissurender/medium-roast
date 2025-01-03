import express from 'express';
const router = express.Router();
import apiRouter from './api.js';

router.get('/', function (req, res) {
  res.render('index');
});

router.use('/api/v0', apiRouter);

// catch wildcard route and return 404
router.use('*',(req, res) => {
  res.status(404).send('404: Page not Found');
});

export default router;
