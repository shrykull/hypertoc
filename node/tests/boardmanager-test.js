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
  /*
it ('should fail with 404 if you try to make a move on a nonexistant game', function(done) {
  var game = bm.createNewGame();
  game.gameId = "trollolol";
  
  bm.processMove(game, function(error, newGameState) {
    console.log(error + "\n...\n" + newGameState);
    if ((error) && (error != 404))
      test.fail("error was set, but instead of 404 it was " + error);
    else {
      if (error == 404) {
        if (newGameState) {
          test.fail("newGameState was sent back anyways: " + newGameState);
        } else {
          done();
        }
      } else {
        test.fail("no error value set");
      }
    }
  });
});

it ('should accept a move and change game attributes accordingly', function(done) {
  var game = bm.createNewGame();
  var oldGame = game; //copy to check for changes later
  
  game.field[3][5] == 'X'; //put an X in the center of the top right subfield
  
  var newGame = null;
  bm.processMove(game, function(error, newGameState) {
    newGame = newGameState;
    //assert.notEqual(newGame,oldGame);
    assert.notEqual(newGame.field[3][5], oldGame.field[3][5]); //boardmanager should have accepted the move
    done();
  });
});
  */
});
      