module.exports = [
{
  name:"default ruleset",
  
  /*
   * returns false if move was illegal, else true.
   */
  isValidMove:function(oldBoard, move) { 
    //TODO: add more rules
    //you may only move to a subfield that was marked last ... except that subfield was already was won.
  if ((!oldBoard.lastMove) || (((oldBoard.lastMove.field == move.subfield) || (this.findWinner(oldBoard.field[oldBoard.lastMove.field]) != null)))
    && (oldBoard.field[move.subfield][move.field] == ' ')) //and you may only move to an empty field
    return true;
  },
  doMove: function (board, move, callback) {
    if (this.isValidMove(board, move)) {
      board.field[move.subfield][move.field] = move.symbol;
      board.lastMove = move;
      callback(null, board);
      return;
    } 
    callback(403, board); //move forbidden, return given field
  },
  /*
   *returns playerId of winner or null
   */
  findWinner:function(field) {
    //TODO: stub.
    return null;
  },
  
},
//this array can accept more rulesets, just add another object like the one above.
]