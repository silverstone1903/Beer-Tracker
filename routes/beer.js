var express = require('express');
var BreweryDb = require('brewerydb-node');
var brewdb = new BreweryDb('e49034113c1766216d75b6cb58535cf7');
var bodyParser = require('body-parser');
var beer = express.Router();

beer.use(bodyParser.json());

//Stores user check-in info
var checkIns = [];

//Takes the input from the user's search and runs it through the brewdb database
beer.get('/search/:name', function(req, res) {
  brewdb.search.beers({ q: req.params.name, withBreweries: 'Y' }, function(err, data) {
    res.json(data);
  });
});

//Provides check-in info to be displayed when switching to profile
beer.get('/profile', function(req, res) {
  res.json(checkIns);
});

//Takes in check-in info from the user and uses beer ID to get beer and brewrey name from brewdb
beer.post('/checkin/:id', function(req, res) {
  brewdb.beer.getById(req.params.id, { withBreweries: 'Y' }, function(err, data) {
    var checkIn = {};
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

    checkIns.push(checkIn);
  });
  res.send();
});

//Route for adding a beer
beer.post('/add', function(req, res) {
  var checkIn = {};
  checkIn.name = req.body.name;
  checkIn.brewery = req.body.brewery;
  checkIn.style = req.body.style;
  checkIn.id = req.body.id;
  checkIn.notes = req.body.notes;
  checkIn.location = req.body.location;
  checkIn.date = req.body.date;
  checkIn.rating = req.body.rating;

  checkIns.push(checkIn);

  res.send();
});

module.exports = beer;
