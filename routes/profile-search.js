var express = require('express');
var profile = express.Router();

profile.get('/', function(req, res) {
  res.sendStatus(200);
})

module.exports = profile;
