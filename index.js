const express = require('express');
const app = express();
const cors = require('cors');
const routes = require('./src/routes/index');

const morgan = require('morgan');
const { pool } = require('./db/index.js');
const port = process.env.PORT || 8000;

app.use(express.static(__dirname + '/public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(cors);
app.use(morgan('dev'));

app.use('/', routes);

app.listen(port, () => {
  `Server is running on port: http://localhost:${port}/`;
});
