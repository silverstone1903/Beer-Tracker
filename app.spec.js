var assert = require('chai').assert;
var request = require('request');

describe('Test the REST API', function() {
  var Client = require('mongodb').MongoClient;
  var url = 'mongodb://m-rstewart:craft@ds153705.mlab.com:53705/m-rstewart-beer-tracker';

  describe('CREATE', function() {
    it('expects an ID', function(done) {
      request({
        url: 'http://localhost:3000/beer/checkin',
        method: 'POST'
      }, function(error, response) {
        assert.equal(response.statusCode, 404);
        done();
      });
    });
  });
});
