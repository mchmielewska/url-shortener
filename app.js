const { render } = require('ejs');
const express = require('express');
const app = express();
const routes = require('./routers/urls');

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');

app.use('/', routes);

app.listen(process.env.PORT || 4000);
