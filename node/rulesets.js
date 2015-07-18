module.exports = [
{
  name:"default ruleset",
  
  /*
   * returns false if move was illegal, else true.
   */
  isValidMove:function(oldGameState, newGameState) { 
    //TODO: stub
    return true;
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