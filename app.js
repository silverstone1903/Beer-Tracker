var express = require('express');
var beer = require('./routes/beer.js');
var login  = require('./routes/login.js');
var search = require('./routes/profile-search.js');
var app = express();

var port = process.env.PORT || 3000;

app.use(express.static('./public'));
app.use('/login', login);
app.use('/beer', beer);
app.use('/search', search);

app.listen(port);
