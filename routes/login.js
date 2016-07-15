var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var authenticate = require('./../authenticate.js');
var users = require('./../users.js').data;
var login = express.Router();



login.use(cookieParser());
login.use(bodyParser.json());

login.post('/', function(req, res) {
  console.log(req.body);
  if (authenticate.check(users, req.body.username, req.body.password)) {
    console.log('Success');
  } else {
    console.log('Fail');
  }
});


module.exports = login;
