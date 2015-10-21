var uuid = require('node-uuid'); //a simple tool to generate unique IDs
var ruleset = require('./rulesets');

var games = {}; //storage for all running games

var rules = ruleset[0]; //TODO: enable to choose a different ruleset than the default one

module.exports = {
  createNewGame: function() {
    var game = {
      gameId: generateId(),
      currentMoveId:generateId(),
      playerIds:[generateId(), generateId()], //second player is missing on create, but will get a link with his ID and the game ID to start playing
      board:{
        field:[
          //top row
          [" "," "," "," "," "," "," "," "," "],
          [" "," "," "," "," "," "," "," "," "],
          [" "," "," "," "," "," "," "," "," "],

          //mid row
          [" "," "," "," "," "," "," "," "," "],
          [" "," "," "," "," "," "," "," "," "],
          [" "," "," "," "," "," "," "," "," "],

          //bottom row
          [" "," "," "," "," "," "," "," "," "],
          [" "," "," "," "," "," "," "," "," "],
          [" "," "," "," "," "," "," "," "," "],
        ],
        lastMove:null, //move looks like this, if set: {field:1, subfield: 3, symbol:"X"}
        validSubfields:[]
      }
    };
    games[game.gameId] = JSON.parse(JSON.stringify(game)); //copy game to our game storage
    return game;
  },

  processMove: function(newGamestate, callback) { //callback signature: function(error, acceptedGamestate)
   //TODO: sanitize input: newGamestate is dirty!
    var oldGamestate = null;
    this.getGame(newGamestate.gameId, function(error, foundGame) {
      if (error) {
        callback(error);
        return;
      }
      oldGamestate = foundGame;
      if (oldGamestate) {
        rules.doMove(oldGamestate.board, newGamestate.board.move, function(error, appliedBoard) {
          if (error) {
            callback(error, oldGamestate);
            return;
          }
          newGamestate.board = appliedBoard;
          newGamestate.currentMoveId = generateId(); //moveID has to change on a successful move
          games[newGamestate.gameId] = newGamestate;
          callback(null, newGamestate);
        });
      } else
        callback(404); //game was not found, 404.
    })
  },
  getGame: function(gameId, callback) { //callback signature: function(error, acceptedGamestate)
    //look for the game ID, find the old gamestate
    var oldGamestate = games[gameId];
    if (!oldGamestate) //old gamestate wasnt found, return no accepted gamestate and a 404
      callback(404);
    else
      callback(null, oldGamestate);
  },
  getRandomGame: function(callback){
    if (Object.keys(games).length > 0) {
      var keys = Object.keys(games);
      var randomIndex = keys[Math.floor(Math.random() * keys.length)];
      var randomGame = JSON.parse(JSON.stringify(games[randomIndex])); //copy a game from our game collection
      randomGame.currentMoveId = null; //remove move ID so random watchers can't interfere
      callback(null, randomGame);
    } else {
      callback(404);
    }
  }
}

var generateId = function() {
  return uuid.v4(); //generate time-based UUID
}
