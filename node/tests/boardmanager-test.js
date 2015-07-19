var test = require('unit.js');
var assert = require('assert');
var bm = require('../boardmanager');
 
 
describe('boardmanager tests', function() {
//every test probably a game
var game;
beforeEach(function() {
  game = bm.createNewGame();
});
afterEach(function() {
  //lol dunno
});
  
it ('should create valid game objects', function(done) {
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
it ('should fail with 404 if you try to make a move on a nonexistant game', function(done) {
  game.gameId = "trollolol";
  
  bm.processMove(game, function(error, newGameState) {
    if ((error) && (error != 404)) {
      test.fail("error was set, but instead of 404 it was " + error);
    }
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
  //copy to check for changes later
  var oldGame = JSON.parse(JSON.stringify(game));
  
  game.move = { subfield:3, field:5, symbol:'X' }; //put an X in the center of the top right subfield
  var newGame = null;
  bm.processMove(game, function(error, newGameState) {
    newGame = newGameState;
    assert.equal(error, null);
    assert.notEqual(newGame.field[3][5], oldGame.field[3][5], "boardmanager did not accept the move"); 
    assert.notEqual(newGame.currentMoveId, oldGame.currentMoveId, "boardmanager should have generated a new move ID"); 
    assert.equal(game.gameId, newGameState.gameId, "gameIDs do not match");
    
    //check if it's still the same players
    for (i in game.playerIds.sort()) {
      if (newGameState.playerIds.sort()[i] != game.playerIds.sort()[i])
        test.fail("gameIDs do not match");
    }

    done();
  });
});

it ('is supposed to reject an illegal move', function(done) {
  game.move = { subfield:3, field:5, symbol:'X' }; //put an X in the center of the top right subfield
  bm.processMove(game, function(error, newGameState) {
    newGameState.move = { subfield:3, field:5, symbol:'O' }; //put an O in the same position
    bm.processMove(newGameState, function(errorer, newerGameState) {
      assert.equal(errorer, 403);
      assert.deepEqual(newerGameState.field, newGameState.field, "the field was not kept in its original state");
      done();
    });
  });
});
});
      