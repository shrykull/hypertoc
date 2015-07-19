var test = require('unit.js');

var api = require("../hypertoc-api");

describe('hypertoc api', function() {
  /* Commentet out, becaue there are no games created when running the test, so there wont be a random game to send
  it('should return a status 200 and a random game as data on GET without data', function(done) {
    test.httpAgent(api.server)
    .get('/')
    .set('Accept', 'application/json')
    .expect(200)
    .expect(function(response) {
      var responseGame;
      if (responseGame !== null)
      responseGame = JSON.parse(response.text);
      if (typeof(responseGame) !== "object") return "Did not get object data";
    })
    .end(function(error, response) {
      if (error)
        done(error)
      else
        done();
    });
  });*/

  it ('should return 404 on GET data with incorrect gameId', function(done) {
    test.httpAgent(api.server)
    .get('/')
    .set('Accept', 'application/json')
    .set('Content-Type', 'application/json')
    .send({gameId:5}) //unit.js automatically parses this as JSON
    .expect(404)
    .end(function(error, response) {
      if (error)
      done(error)
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
  })
});

//TODO: add comments what is tested here and what the result should be
