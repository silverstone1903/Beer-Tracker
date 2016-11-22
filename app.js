const express = require('express');
const beer = require('./routes/beer.js');
const login  = require('./routes/login.js');
const search = require('./routes/profile-search.js');
const friends = require('./routes/friends.js');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('./public'));
app.use('/login', login);
app.use('/beer', beer);
app.use('/search', search);
app.use('/friends', friends);

app.listen(port);
