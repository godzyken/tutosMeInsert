var express = require('express');
var app = express();

var BronzeController = require('./bronze/BronzeController');
app.use('/bronze', BronzeController);

module.exports = app;