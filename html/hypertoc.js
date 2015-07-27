var hypertoc = angular.module('hypertoc', []);

hypertoc.controller('mainContentCtrl', function($scope, BoardUIService) {
  $scope.board = BoardUIService;
   
  angular.element(document).ready(function() {
    BoardUIService.updateBoard();
  });

});

hypertoc.factory('BoardUIService', function(GameDataService, InputEventService, DrawService) {  
  
 
  var drawFunction = function() {
    DrawService.drawBoardSymbols(GameDataService.getBoard()); //applies visibility rules for all x and o according to board
  };
  
  angular.element(document).ready(function() {
    DrawService.initializeBoard();  
    InputEventService.registerOnClickEvents();
  });
  
  return {
    updateBoard:drawFunction, 
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
        [" ","FOO"," "," "," "," ","X"," "," "],
        [" "," "," "," "," ","X"," "," "," "],

        //bottom row
        [" "," "," "," "," "," "," "," "," "],
        [" ","O"," "," "," "," "," "," "," "],
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
