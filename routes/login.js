var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var login = express.Router();



login.use(cookieParser());
login.use(bodyParser.json());

login.post('/', function(req, res) {
  console.log(req.body);
});


module.exports = login;
