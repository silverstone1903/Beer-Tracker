var express = require('express');
var beer = require('./routes/beer.js');
var login  = require('./routes/login.js');
var app = express();

var port = process.env.PORT || 3000;

app.use(express.static('./public'));
app.use('/login', login);
app.use('/beer', beer);

app.listen(port);
