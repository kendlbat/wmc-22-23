const express = require('express');
const path = require('path');

const app = express();
const port = 3000;
const API_PREFIX = '/api';

const apiRouter = require('./api');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'wwwPublic')));

app.use(API_PREFIX, apiRouter);

app.listen(port, () => {
  console.log(`working title app listening on port http://localhost:${port}`);
});

module.exports = app;