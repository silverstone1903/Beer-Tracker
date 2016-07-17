var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var authenticate = require('./../authenticate.js');
var users = require('./../users.js').data;
var cookies = require('./../cookies.js');
var sessions = require('./../sessions.js');
var login = express.Router();

login.use(cookieParser());
login.use(bodyParser.json());

login.post('/', function(req, res) {
  if (authenticate.check(users, req.body.username, req.body.password)) {
    var id = cookies.id();
    var session = {};
    session.username = req.body.username;
    session.id = id;
    sessions.sessions.push(session);
    console.log(sessions.sessions);
    res.cookie('cookie', id);
  }
  res.send();
});

module.exports = login;
