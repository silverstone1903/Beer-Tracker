var express = require('express');
var beer = require('./routes/beer.js')
var app = express();

var port = process.env.PORT || 3000;

app.use(express.static('./public'));
app.use('/beer', beer);

app.listen(port);
