var hypertoc = angular.module('hypertoc', []);

hypertoc.controller('mainContentCtrl', ['$scope', 'BoardUIService', function($scope, BoardUIService) {
  $scope.board = BoardUIService;

  angular.element(document).ready(function() {
    BoardUIService.updateBoard();
  });

}]);


hypertoc.factory('BoardUIService', ['GameDataService', 'InputEventService', 'DrawService', 'UIStateService', function(GameDataService, InputEventService, DrawService, UIStateService) {
  var drawFunction = function() {
    DrawService.drawBoardSymbols(GameDataService.getBoard()); //applies visibility rules for all x and o according to board
  };

  angular.element(document).ready(function() {
    DrawService.initializeBoard();
    InputEventService.addMouseEventHooks();
    InputEventService.events.click = function(sf, sym) {
      if (UIStateService.getGameState().stateName === "waitingForPlayerTurn") {
        //TODO: elaborate this to actually do something
        console.log("sf/sym " + sf+"/"+sym);
      }
    }
    //TODO: add InputEventService.events.mouseIn and mouseOut

    //draw stuff on secondary display
    DrawService.initializeSecondaryDisplay();
    //registers secondary display behaviour on statechange
    UIStateService.registerStateChangeHandler(function(from, to) {
      var setButtonText = d3.select('[data-id=secondaryButton]').select("text");
      switch(from) {
        case ("waitingForStart"):
          setButtonText.text("-run-");
          break;
      }
      switch(to) {
        case("waitingForPlayerTurn"):
          setButtonText.text("-your turn-");
          break;
        case("waitingForEnemyTurn"):
          setButtonText.text("-waiting-");
          break;
        case("waitingForStart"):
          setButtonText.text("-Start-");
          break;
        case("showResults"):
          setButtonText.text("-game ended-");
          break;
      }
    });

    //registers board behaviour on statechange
    UIStateService.registerStateChangeHandler(function(from, to) {
      switch(from) {
        case("waitingForStart"):
          //TODO: get new game from GameDataService
          GameDataService.startNewGame();
      }
    });

    //TODO: auslagern in InputEventService oder so?
    var group = d3.select('[data-id=secondaryButton]');
    group.on("click", function() {
      console.log("startbutton clicked, Gamestate: " + UIStateService.getGameState().stateName);
      switch (UIStateService.getGameState().stateName) {
        case("waitingForStart"):
          UIStateService.setGameState("waitingForPlayerTurn");
          break;
        case("waitingForPlayerTurn"):
          UIStateService.setGameState("waitingForEnemyTurn");
          break;
        case("waitingForEnemyTurn"):
          UIStateService.setGameState("waitingForPlayerTurn");
          break;
      }
     })
  });

  GameDataService.addBoardRefreshHook(drawFunction);

  return {
    updateBoard:drawFunction,
  };
}]);

hypertoc.factory('GameDataService',  ['$http', 'ConfigService', function($http, ConfigService) {
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

  var refreshHooks = [];


  return {
    getBoard: function() {
      return gameData.board;
    },
    startNewGame: function() {
      $http.post(ConfigService.getEndpoint()).then(function(response) {
        gameData = response.data;
        refreshHooks.forEach(function(f) { f(); }); //tell everybody we got a new board
      });
    },
    addBoardRefreshHook: function(callback) {
      refreshHooks.push(callback);
    }
  };
}]);

hypertoc.factory('ConfigService', ['$http', function($http) {
  var config = {
    host:"/api",
    getEndpoint: function() { return this.host + "/"; }
  };
  return config;
}]);
