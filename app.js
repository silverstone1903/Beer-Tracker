var express = require('express');
var BreweryDb = require('brewerydb-node');
var brewdb = new BreweryDb('e49034113c1766216d75b6cb58535cf7');
var bodyParser = require('body-parser');
var app = express();

var checkIns = [];

app.use(express.static('public'));
app.use(bodyParser.json());

app.get('/search/:name', function(req, res) {
  brewdb.search.beers({ q: req.params.name, withBreweries: 'Y' }, function(err, data) {
    res.json(data)
  })
})

app.post('/checkin/', function(req, res) {
  var checkIn = {};
  checkIn.id = req.body.id;
  checkIn.notes = req.body.notes;
  checkIn.location = req.body.location;
  checkIn.date = req.body.date;
  checkIn.rating = req.body.rating;

  checkIns.push(checkIn);
  console.log(checkIns);
  res.send();
})

app.post('/clearCheckIn', function(req, res) {
  checkIns = [];
  res.send();
})

app.post('/showcheckin', function(req,res) {
  console.log(checkIns);
  res.send();
})

app.listen(8080);
