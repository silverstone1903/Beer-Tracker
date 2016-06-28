var express = require('express');
var BreweryDb = require('brewerydb-node');
var brewdb = new BreweryDb('e49034113c1766216d75b6cb58535cf7');
var bodyParser = require('body-parser');
var app = express();

app.use(express.static('public'));
app.use(bodyParser.json());

app.get('/search/:name', function(req, res) {
  brewdb.search.beers({ q: req.params.name, withBreweries: 'Y' }, function(err, data) {
    res.json(data)
  })
})



app.listen(8080);
