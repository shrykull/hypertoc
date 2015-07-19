var http = require('http');
var assert = require('assert');
var concatStream = require('concat-stream');

var test = require('unit.js');

var api = require("../hypertoc-api");

describe('hypertoc api', function() {
  it('should return a status 404 as no random game can be found on GET without data', function(done) {
    test.httpAgent(api.server)
    .get('/')
    .set('Accept', 'application/json')
    .expect(404)
    .end(function(error, response) {
    if (error)
    done(error);
    else
    done();
    });
  });

  it ('should return 404 on GET data with incorrect gameId', function(done) {
    test.httpAgent(api.server)
    .get('/')
    .set('Accept', 'application/json')
    .set('Content-Type', 'application/json')
    .send({gameId:5}) //unit.js automatically parses this as JSON
    .expect(404)
    .end(function(error, response) {
      if (error)
        done(error);
      else
        done();
    });
  });

  it('should create a new game and return it',function(done){
    test.httpAgent(api.server)
    .post('/')
    .set('Accept', 'application/json')
    .send()
    .expect(200)
    .expect(function(response){
      var responseGame = JSON.parse(response.text);
      if(typeof(responseGame) !== "object") return "Did not get object data";
    })
    .end(function(error,response){
      if(error) done(error);
      else done();
    });
  });
  it('is supposed to get the same game multiple times with given IDs', function(done) {
    var myGameId = null;
    var myGame = null;
    test.httpAgent(api.server).post('/').set('Accept', 'application/json')
    .expect(function(response) {
      myGame = JSON.parse(response.text);
      myGameId = myGame.gameId;
      assert.notEqual(myGameId, null);
      test.httpAgent(api.server).get('/' + myGameId).set('Accept', 'application/json')
      .expect(200)
      .end(function(error, secondResponse) {
        if (error) done(error);
        else {
          assert.equal(JSON.stringify(myGame), response.text);
          done();
        }
      });
    })
    .end(function(error, response) {
      if(error)
      done(error);
    });
  });
});

//TODO: add comments what is tested here and what the result should be
