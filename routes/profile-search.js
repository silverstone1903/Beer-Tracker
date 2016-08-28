var express = require('express');
var Client = require('mongodb').MongoClient;
var url = 'mongodb://m-rstewart:craft@ds153705.mlab.com:53705/m-rstewart-beer-tracker';
var profile = express.Router();

profile.get('/beer/:beer', function(req, res) {
  res.send('beer');
});

profile.get('/brewery/:brewery', function(req, res) {
  res.send('brewery');
});

module.exports = profile;
