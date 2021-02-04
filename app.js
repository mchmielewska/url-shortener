const express = require('express');
const app = express();
const routes = require('./routers/urls');

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/', routes);

app.listen(process.env.PORT || 4000);

module.exports = app;
