const express = require('express');
const bodyParser = require('body-parser');
const Client = require('mongodb').MongoClient;
const url = 'mongodb://m-rstewart:craft@ds153705.mlab.com:53705/m-rstewart-beer-tracker';
const login = express.Router();

login.use(bodyParser.json());

login.post('/', function(req,res) {
  Client.connect(url, function(error, db) {
    if(error) {
      console.log(error);
    } else {
      let collection = db.collection('users');
      let username = req.body.username;
      let password = req.body.password;

      collection.find({ "name": username })
      .toArray(function(error, documents) {
        if(error) {
          console.log(error);
        } else {
          let results = documents;

          if(results[0]) {
            if(results[0].password === password) {
              res.send(username);
              db.close();
            } else {
              res.send();
              db.close();
            }
          } else {
            db.close()
            res.send();
          }
        }
      });
    }
  });
});

login.post('/new', function(req, res) {
  let account = {};

  account.name = req.body.username;
  account.password = req.body.password;
  account.email = req.body.email;
  account.friends = [];

  Client.connect(url, function(error, db) {
    if(error) {
      console.log(error);
    } else {
      let collection = db.collection('users');
      let results = [];

      collection.find({ $or: [ { "name": req.body.username }, { "email": req.body.email}]})
      .toArray(function(error, documents) {
        results.push(JSON.stringify(documents));
        //if it finds something, Unsuccessful.  If it finds nothing, Successful
        if(results[0] !== '[]') {
          db.close();
          console.log('Unsuccessful');
          res.send('Unsuccessful');
        } else {
          collection.insert(account);
          db.close();
          console.log('Successful');
          res.send('Successful');
        }
      });
    }
  });
});

module.exports = login;
