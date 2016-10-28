var express = require('express');
var Client = require('mongodb').MongoClient;
var url = 'mongodb://m-rstewart:craft@ds153705.mlab.com:53705/m-rstewart-beer-tracker';
var profile = express.Router();

profile.get('/beer/:beer/:user', function(req, res) {
  Client.connect(url, function(error, db) {
    if(error) {
      console.log(error);
    } else {
      var collection = db.collection('checkIns');
      collection
      .find({ name: req.params.beer })
      .toArray(function(error, documents) {
        res.json(documents);
        db.close();
      });
    }
  });
});

profile.get('/brewery/:brewery/:user', function(req, res) {
  Client.connect(url, function(error, db) {
    if(error) {
      console.log(error);
    } else {
      var collection = db.collection('checkIns');
      collection
      .find({ brewery: req.params.brewery })
      .toArray(function(error, documents) {
        res.json(documents);
        db.close();
      });
    }
  });
});

module.exports = profile;
