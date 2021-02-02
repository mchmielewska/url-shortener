const { render } = require('ejs');
const express = require('express');
const db = require('./database.js');
const app = express();
const routes = require('./routers/');

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');

app.use('/', routes);

app.listen(process.env.PORT || 4000);
