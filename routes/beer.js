require('dotenv').config();

const express = require('express');
const BreweryDb = require('brewerydb-node');
const brewdb = new BreweryDb(process.env.BREW_DB);
const bodyParser = require('body-parser');
const Client = require('mongodb').MongoClient;
const url = process.env.MLAB_KEY;
const beer = express.Router();

beer.use(bodyParser.json());

//Takes the input from the user's search and runs it through the brewdb database
beer.get('/search/:name', function(req, res) {
  brewdb.search.beers({ q: req.params.name, withBreweries: 'Y' }, function(err, data) {
    res.json(data);
  });
});

//Provides check-in info to be displayed when switching to profile
beer.get('/profile/:user', function(req, res) {
  Client.connect(url, function(error, db) {
    if(error) {
      console.log(error);
    } else {
      let collection = db.collection('checkIns');
      collection
      .find({ "user" : req.params.user})
      .toArray(function(error, documents) {
        res.json(documents);
        db.close();
      });
    }
  });
});

//Takes in check-in info from the user and uses beer ID to get beer and brewrey name from brewdb
beer.post('/checkin/:id', function(req, res) {
  Client.connect(url, function(error, db) {
    if(error) {
      console.log(error);
    } else {
      let collection = db.collection('checkIns');

      brewdb.beer.getById(req.params.id, { withBreweries: 'Y' }, function(err, data) {
        let checkIn = {};

        checkIn.user = req.body.user;
        checkIn.style = data.style.name;
        checkIn.name = data.name;
        checkIn.brewery = data.breweries[0].name;
        checkIn.style = data.style.name;
        checkIn.styleId = data.styleId;
        checkIn.id = req.body.id;
        checkIn.notes = req.body.notes;
        checkIn.location = req.body.location;
        checkIn.date = req.body.date;
        checkIn.rating = req.body.rating;

        collection.insert(checkIn);
        db.close();
        res.send();
      });
    }
  });
});

//Route for adding a beer
beer.post('/add', function(req, res) {
  Client.connect(url, function(error, db) {
    if(error) {
      console.log(error);
    } else {
      let collection = db.collection('checkIns');
      let checkIn = {};

      checkIn.user = req.body.user;
      checkIn.name = req.body.name;
      checkIn.brewery = req.body.brewery;
      checkIn.style = req.body.style;
      checkIn.id = req.body.id;
      checkIn.notes = req.body.notes;
      checkIn.location = req.body.location;
      checkIn.date = req.body.date;
      checkIn.rating = req.body.rating;

      collection.insert(checkIn);
      db.close();
      res.send();
    }
  });
});

module.exports = beer;
