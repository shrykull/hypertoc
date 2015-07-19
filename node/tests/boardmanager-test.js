var test = require('unit.js');
var assert = require('assert');
var bm = require('../boardmanager');
 
 
describe('boardmanager', function() {
it ('should create valid game objects', function(done) {
  var game = bm.createNewGame();

  //test if keys are matching our expectations
  var keys = Object.keys(game).sort();
  var expectedKeys = ['gameId', 'playerIds', 'currentMoveId', 'field'].sort();
  if (JSON.stringify(keys) != JSON.stringify(expectedKeys))  
    test.fail("game object attributes do not match our expectation:\n found  : " + keys + "\nexpected: " + expectedKeys);
  
  //check for unset values
  for (i in game) {
    if (!game[i])
      test.fail("Game attribute " + i + "was falsy");
  }

  done();
});
});
      