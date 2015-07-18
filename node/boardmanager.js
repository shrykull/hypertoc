var uuid = require('node-uuid'); //a simple tool to generate unique IDs
var ruleset = require('./rulesets');

var games = []; //storage for all running games


module.exports = {
  createNewGame: function() {
    var game = {
      gameId: generateId(), 
      currentMoveId:generateId(),
      playerIds:[generateId(), generateId()], //second player is missing on create, but will get a link with his ID and the game ID to start playing
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
    };
    games[game.gameId] = game; //add game to our game storage
    return game;
  },
    
  processMove: function(newGamestate, callback) { //callback signature: function(error, acceptedGamestate)
    //TODO: sanitize input: newGamestate is dirty!
  
    //look for the game ID, find the old gamestate
    console.log("got gamestate " + newGamestate.gameId + "!");
    var oldGamestate = games[newGamestate.gameId];
    if (!oldGamestate) { //old gamestate wasnt found, return no accepted gamestate and a 404
      callback(404, null);
    } 
    //TODO: do a validity check
    //TODO: generate a new MoveToken
    callback(null, newGamestate); //TODO: just accept all moves for now
  }
}

var generateId = function() {
  return uuid.v4(); //generate time-based UUID
}