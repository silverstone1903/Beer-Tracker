var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var authenticate = require('./../authenticate.js');
var users = require('./../users.js').data;
var login = express.Router();

login.use(cookieParser());
login.use(bodyParser.json());

login.post('/', function(req, res) {
  if (authenticate.check(users, req.body.username, req.body.password)) {
    res.send(req.body.username);
  } else {
    res.send();
  }
});

module.exports = login;
