module.exports = [
{
  name:"default ruleset",
  /*
   * returns an array of valid subfields (eg the ones that are to be marked green)
   */
  validSubfields:function(board) {
    if (this.findWinner(board.field[board.lastMove.field]) === null)
      return [board.lastMove.field];
    else
      return []; //TODO: return every field that is not done yet.
  },

  /*
   * returns false if move was illegal, else true.
   */
  isValidMove:function(oldBoard, move) {
    //TODO: add more rules
    //you may only move to a subfield that was marked last ... except that subfield was already was won.
    if (
      (oldBoard) && (move) && //ensure we actually want to perform something
      (
        (!oldBoard.lastMove) || //accept if everything is allowed anyways
        (
          //(oldBoard.lastMove.field == move.subfield) &&
          (this.validSubfields(oldBoard).indexOf(move.subfield) >= 0) && //ensure the move is valid
          (this.findWinner(oldBoard, move.subfield) == null) //ensure the move does not go into a field thats done
        )
      ) &&
      (oldBoard.field[move.subfield][move.field] == ' ')) //and you may only move to an empty field
    {
      return true;
    } else
      console.log("Invalid Move: " + JSON.stringify(oldBoard) + "\n" + JSON.stringify(move) + "\n" + this.validSubfields(oldBoard) + "\n" + (this.validSubfields(oldBoard).indexOf(move.subfield)) + " >= 0");
      return false;
  },

  doMove: function (board, move, callback) {
    if (this.isValidMove(board, move)) {
      board.field[move.subfield][move.field] = move.symbol;
      board.lastMove = move;
      board.validSubfields = this.validSubfields(board);
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

  /*
   * returns playerId of winner or null for a given subfieldId
   */
  findWinnerInSubfield:function(field, subfieldId) {
    //returns a, if a === b === c, else null.
    function isTriplet(a, b, c) {
      if ((a === b) && (b === c))
        return a;
      return null;
    }
    var currentTriplet;

    //horizontal
    for (var i = 0; ((i < 3) && (!currentTriplet)); i += 3) {
      currentTriplet = isTriplet(field.board[subfieldId][i], field.board[subfieldId][i+1], field.board[subfieldId][i+2]);
    }
    //vertical
    for (var i = 0; ((i < 3) && (!currentTriplet)); i += 1) {
      currentTriplet = isTriplet(field.board[subfieldId][i], field.board[subfieldId][i+3], field.board[subfieldId][i+6]);
    }
    //diagonal
    currentTriplet = isTriplet(field.board[subfieldId][0], field.board[subfieldId][4], field.board[subfieldId][8]);
    if (!currentTriplet)
      currentTriplet = isTriplet(field.board[subfieldId][2], field.board[subfieldId][4], field.board[subfieldId][6]);

    if (currentTriplet) //if some winner was found, return playerId
      return this.getPlayerIdFromSymbol(field, currentTriplet);
    return null; //no triplet was found, therefore no winner was found.
  },

  /*
   * returns a Symbol, based on the Order of playerIds or null.
   */
  getSymbolFromPlayer:function(field, playerId) {
    if (playerId === field.playerIds[0])
      return "X";
    if (playerId === field.playerIds[1])
      return "O"
    return null;
  },
  getPlayerIdFromSymbol:function(field, symbol) {
    if (symbol == "X")
      return field.playerIds[0]
    if (symbol === "O")
      return field.playerIds[1]
    return null;
  }
},
//this array can accept more rulesets, just add another object like the one above.
]
