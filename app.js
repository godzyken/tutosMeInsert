var express = require('express');
var app = express();

// var BronzeController = require('./bronze/BronzeController');
// app.use('/bronze', BronzeController);

var GoldController = require('./gold/GoldController');
app.use('/gold', GoldController);

module.exports = app;