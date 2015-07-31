// Game Object
function Game() {
  /**
   * Symbol of player X
   */
  Game.prototype.SYM_X = "X";

  /**
   * Symbol of player O
   */
  Game.prototype.SYM_O = "O";

  var field = generateNewField();
  var activePlayer = (Math.floor((Math.random() * 10) + 1) > 5) ? this.SYM_X : this.SYM_O;
  var activeField = Math.floor((Math.random() * 8) + 0);

  /**
   * Generates a new game field filled with spaces
   * @return {Array[Array()]()} The new field
   */
  function generateNewField () {
    // rows
    var result = [];
    for (var i=0; i<9; i++) {
      result.push([]);
      // subfields
      for (var j=0; j<9; j++) {
        result[i][j] = " ";
      }
    }

    return result;
  }

  /**
   * Toggles the active player
   * @return {String} The symbol of the new active player
   */
  function togglePlayer () {
    activePlayer = (activePlayer === this.SYM_X) ? this.SYM_O : this.SYM_X;
    return activePlayer;
  }

  /**
   * Checks if three objects are equal
   * @param  {Object} a value1
   * @param  {Object} b value2
   * @param  {Object} c value3
   * @return {Boolean}  true if all three parameters have the same value and type
   */
  function threequal(a, b, c) {
    return(a === b && b === c);
  }

  function isFull(subfield) {
    for (var i = 0; i<9; i++)
      if (subfield[i] === " ")
        return false;
    return true;
  }

  /**
   * Checks, if a subfied is won
   * @param  {Integer}  ID of the field that will be checked
   * @return {String} The player symbol. "XO" on a draw and null if none won
   */
  function isSubfieldDone(subfield) {
    // did someone win?
    var win = checkSubfieldRows(subfield) || checkSubfieldCols(subfield) || checkSubfiedDiags(subfield);
    if (win !== null)
      return win;

    // is it a draw?
    else if (isFull(subfield))
      return this.SYM_X+this.SYM_O;

    // nope, no win
    return null;
  }

  /**
   * Checks the rows of a subfield for win
   * @param  {Arary} subfield The field that will be checked
   * @return {String}         Symbol of the winner or null if there is no winner
   */
  function checkSubfieldRows(subfield) {
    for (var i = 0; i<3; i++) {
      if(threequal(subfield[i*3], subfield[i*3+1], subfield[i*3+2]))
        return subfield[i*3];
    }
    return null;
  }

  /**
   * Checks the columns of a subfield for a win
   * @param  {Array} subfield The field that will be checked
   * @return {String}         Symbol of the winner or null if there is no winner
   */
  function checkSubfieldCols(subfield) {
    for (var i=0; i<3; i++) {
      if (threequal(subfield[i], subfield[i+3], subfield[i+6]))
        return subfield[i];
      else
        return null;
    }
  }

  /**
   * Checks the diagonales of a subfield for a win
   * @param  {Array} subfield The field that will be checked
   * @return {String}         Symbol of the winner or null if there is no winner
   */
  function checkSubfiedDiags(subfield) {
    if (threequal(subfield[0],subfield[4],subfield[8]) || threequal(subfield[2],subfield[4],subfield[6]))
      return subfield[0];
    else
      return null;
  }

  function checkWin() {
    var winCount = {X:0, O:0};
    // are all subfields won or a draw?
    for (var i = 0; i<9; i++) {
      subWin = isSubfieldDone(i)
      if (subWin === null)
        // nobody won this field now
        return null;

      if (subWin === this.SYM_X)
        ++winCount.X;
      else if (subWin === this.SYM_O)
        ++winCount.O;
    }

    if (winCount.X > winCount.O)
      return this.SYM_X;
    else if (winCount.O > winCount.X)
      return this.SYM_O;
    else if (winCount.O == winCount.X)
      return this.SYM_X + this.SYM_O;

    // you should never land here
    console.log("DAFUQ!?");
    return null;
  }

  Game.prototype.getActivePlayer = function() {
    return activePlayer;
  };
}
