var hypertoc = angular.module('hypertoc', []);
hypertoc.controller('mainContentCtrl', function($scope, BoardUIService) {
  $scope.board = BoardUIService;

});

hypertoc.factory('BoardUIService', function(GameDataService) {
  var gameView = d3.select('#gameView')
    .append('svg')
    .attr("width", 500)
    .attr("height", 500);
  var secondaryDisplay = d3.select('#secondaryDisplay')
    .append('svg')
    .attr("width", 333)
    .attr("height", 167);
  
  return {
    gameView:gameView,
    secondaryDisplay:secondaryDisplay
  };
});

hypertoc.factory('GameDataService', function() {
  //TODO: stub: make this data come via Network
  var gameData = {
    //TODO: stub: IDs don't work (see networking todo above)
    gameId: "gIDstring",
    currentMoveId:"mIDstring",
    playerIds:["p1string", "p2string"], 
    
    board:{
      field:[
        //top row
        [" "," "," "," ","O"," "," "," "," "],
        [" "," "," "," "," "," "," "," "," "],
        [" "," "," "," "," "," "," "," "," "],

        //mid row
        [" "," "," "," "," "," "," "," "," "],
        [" "," "," "," "," "," "," "," "," "],
        [" "," "," "," "," ","X"," "," "," "],

        //bottom row
        [" "," "," "," "," "," "," "," "," "],
        [" "," "," "," "," "," "," "," "," "],
        [" "," "," "," "," "," "," "," "," "],
      ],
      lastMove:{subfield: 5, field: 5, symbol:"X"}, //stub: O started, X moved to dead center, O's turn now.
    }
  };
  
  return {
    getBoard: function() {
      return gameData.board
    }
  }
});