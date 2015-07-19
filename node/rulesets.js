module.exports = [
{
  name:"default ruleset",
  
  /*
   * returns false if move was illegal, else true.
   */
  isValidMove:function(oldGameState, move) { 
    return true;
  },
  doMove: function (field, move, callback) {
    //TODO: add more rules
    
    //check if field is empty where we want to move
    if (field[move.subfield][move.field] == ' ') {
      field[move.subfield][move.field] = move.symbol;
      callback(null, field);
    } else {
      callback(403, field); //move forbidden, return given field
    }
  },
  /*
   *returns playerId of winner or null
   */
  findWinner:function(gameState) {
    //TODO: stub.
    return null;
  },
  
},
//this array can accept more rulesets, just add another object like the one above.
]