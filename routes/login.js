var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var authenticate = require('./../authenticate.js');
// var users = require('./../users.js').data;
var cookies = require('./../cookies.js');
var sessions = require('./../sessions.js');
var Client = require('mongodb').MongoClient;
var url = 'mongodb://m-rstewart:craft@ds153705.mlab.com:53705/m-rstewart-beer-tracker';
var login = express.Router();

login.use(cookieParser());
login.use(bodyParser.json());

// login.post('/', function(req, res) {
//   if (authenticate.check(users, req.body.username, req.body.password)) {
//     var id = cookies.id();
//     var session = {};
//     session.username = req.body.username;
//     session.id = id;
//     sessions.sessions.push(session);
//     res.cookie('cookie', id);
//   }
//   res.send();
// });

// login.post('/check', function(req, res) {
//   var id = req.cookies.cookie;
//   var user = sessions.check(id);
//
//   if(user.length > 0) {
//     res.send(user[0].username);
//   } else {
//     res.send();
//   }
// });

login.post('/new', function(req, res) {
  var account = {};

  account.name = req.body.username;
  account.password = req.body.password;
  account.email = req.body.email;

  Client.connect(url, function(error, db) {
    if(error) {
      console.log(error);
    } else {
      var collection = db.collection('users');
      var results = [];

      collection.find({ "email": req.body.email })
      .toArray(function(error, documents) {
        results.push(JSON.stringify(documents));
        console.log(results.length);
        console.log(results);

        if(results[0] !== '[]') {
          db.close();
          res.send('Unsuccessful');
        } else {
          collection.insert(account);
          db.close();
          res.send('Successful');
        }
      });
    }
  });
});

module.exports = login;
