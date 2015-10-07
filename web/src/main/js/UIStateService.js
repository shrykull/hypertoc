/*
 * This service represents a finite automaton that describes the state of the User interface.
 * eg the secondary display has states like:
 * startbutton -> searching for opponent -> round timer -> waiting for opponent -> restart game
 * and probably many more. this behaviour is modeled here.
 */
var hypertoc = angular.module('hypertoc');

hypertoc.factory('UIStateService', [function() {
  function newGameState(stateName, followers) {
    return {
      stateName:stateName,
      followers:followers
    }
  };
  var handlers = [];
  var gameStates = [
    newGameState("waitingForStart", ["waitingForPlayerTurn", "waitingForEnemyTurn"]),
    newGameState("waitingForPlayerTurn",["showResults", "waitingForEnemyTurn"]),
    newGameState("waitingForEnemyTurn", ["showResults", "waitingForPlayerTurn"]),
    newGameState("showResults", ["waitingForStart"]),
  ];
  function gameStateIndexOf(n) {
    return gameStates.indexOf(gameStates.filter(function(s) { return (s.stateName === n); })[0]);
  }
  var currentGameState = 0; //first stateName: waiting for start

  function getGameState() {
    return gameStates[currentGameState];
  }

  function setNextState(newStateString) {
    function isValid(stateName) {
      return gameStates[currentGameState].followers.indexOf(stateName) >= 0;
    }
    if (isValid(newStateString)) {
      handlers.forEach(function(handler) { handler(getGameState().stateName, newStateString) })
      currentGameState = gameStateIndexOf(newStateString);
      console.log("cgs: " + currentGameState);
    } else {
      //TODO: this should not happen. at all.
      alert("invalid gamestate\n" + getGameState().stateName + "->" + newStateString + "\n\nPlease file a bug report.");
    }
  };

  return {
    getGameState: getGameState,
    setGameState: setNextState,
    registerStateChangeHandler: function(callbackHandler) { //callback head: function(oldState, newState)
      handlers.push(callbackHandler);
    },
  }
}]);
