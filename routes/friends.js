const express = require('express');
const bodyParser = require('body-parser');
const Client = require('mongodb').MongoClient;
const url = 'mongodb://m-rstewart:craft@ds153705.mlab.com:53705/m-rstewart-beer-tracker';
const friends = express.Router();

friends.use(bodyParser.json());

friends.get('/', function(req, res) {
  //friends
});

module.exports = friends;
