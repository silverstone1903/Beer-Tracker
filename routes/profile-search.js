require('dotenv').config();
const express = require('express');
const Client = require('mongodb').MongoClient;
const url = process.env.MLAB_KEY;
const profile = express.Router();

profile.get('/beer/:beer/:user', function(req, res) {
  Client.connect(url, function(error, db) {
    if(error) {
      console.log(error);
    } else {
      let collection = db.collection('checkIns');
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
      let collection = db.collection('checkIns');
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
