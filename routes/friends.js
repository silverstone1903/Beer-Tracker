const express = require('express');
const bodyParser = require('body-parser');
const Client = require('mongodb').MongoClient;
const url = 'mongodb://m-rstewart:craft@ds153705.mlab.com:53705/m-rstewart-beer-tracker';
const friends = express.Router();

friends.use(bodyParser.json());

friends.get('/:user', function(req, res) {
  Client.connect(url, function(error, db) {
    if(error) {
      console.log(error);
    } else {
      let collection = db.collection('users');
      collection.find({ "name": req.params.user})
      .toArray(function(error, documents) {
        if(documents[0].friends.length > 0) {
          res.json(documents[0].friends);
          db.close();
        } else {
          res.send();
          db.close();
        }
      });
    }
  });
});

friends.post('/:user', function(req, res) {
  Client.connect(url, function(error, db) {
    if(error) {
      console.log(error);
    } else {
      let collection = db.collection('users');
      //Add friend
    }
  });
});

friends.delete('/:user/:friend', function(req, res) {
  Client.connect(url, function(error, db) {
    if(error) {
      console.log(error);
    } else {
      let collection = db.collection('users');
      collection.updateOne(
        { "name": req.params.user },
        { $pull: { "friends": req.params.friend } },
        function(error, results) {
          if(error) {
            console.log(error);
          } else {
            db.close();
            console.log("Removed " + req.params.friend + " from " + req.params.user);
            res.send('Deleted');
          }
        }
      );
    }
  });
});

module.exports = friends;
