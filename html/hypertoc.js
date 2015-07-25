var hypertoc = angular.module('hypertoc', []);

hypertoc.controller('mainContentCtrl', function($scope, BoardUIService) {
  $scope.board = BoardUIService;
  
  angular.element(document).ready(function() {
    BoardUIService.draw();
  });

});

hypertoc.factory('BoardUIService', function(GameDataService, InputEventService, DrawService) {   
  var drawFunction = function() {
    DrawService.drawBoardDecorations();
    DrawService.drawBoardSymbols(GameDataService.board);
    DrawService.drawBoardShape();
  };
  return {
    draw:drawFunction, 
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

hypertoc.factory('InputEventService', function() {
  return {
    
  };
});

hypertoc.factory('DrawService', function() {
  /*
   * Style Parameters (edit as needed)
   */
  var width = 500;
  var height = 500;
  
  var marginPercentage = 0.01;
  
  /*
   * calculated simplifiers for use later (add more as needed)
   */
  var margin = {
                top:height * marginPercentage, 
                bottom:height * marginPercentage, 
                left: width * marginPercentage, 
                right: width * marginPercentage};

  var subfieldwidth  = (width  - (margin.left + margin.right  + marginPercentage * width  * 2)) / 3,
      subfieldheight = (height - (margin.top  + margin.bottom + marginPercentage * height * 2)) / 3;

  var gameView = d3.select('#gameContainer')
    .append('svg')
    .attr("width", width)
    .attr("height", height);
  gameView.attr("id", "gameView");
  var secondaryDisplay = d3.select('#secondaryDisplay')
    .append('svg')
    .attr("width", 2/3 * width)
    .attr("height", 1/3 * height);
  
  var drawGenericBoardshape = function(boardShape, classname, left, top, right, bottom) {
    var verticalSeparation = (right - left) / 3;
    var horizontalSeparation = (bottom - top) / 3;

    for (var i = 1; i < 3; ++i) {
      boardShape.append("line")
        .attr("class", classname)
        .attr("x1", left)
        .attr("y1", top + horizontalSeparation*i)
        .attr("x2", right)
        .attr("y2", top + horizontalSeparation*i); 
    }
    for (var i = 1; i < 3; ++i) {
      boardShape.append("line")
        .attr("class", classname)
        .attr("x1", left + verticalSeparation*i)
        .attr("y1", top)
        .attr("x2", left + verticalSeparation*i)
        .attr("y2", bottom);
    }
  };
  
  var generateActiveSubfieldMarkers = function() {
    var xpos, ypos, absoluteXpos, absoluteYpos;
    
    for (var i = 0; i < 10; ++i) {
        xpos = i % 3;
        ypos = Math.floor(i / 3);
        absoluteXpos = margin.left + marginPercentage * width * xpos + xpos * subfieldwidth;
        absoluteYpos = margin.top + marginPercentage * height * ypos + ypos * subfieldheight;
        gameView
        .append("g") //generate a group with id to find it again once we get data
            .attr("id", "subfield" + i)
            .attr("transform", "translate("+ absoluteXpos + "," + absoluteYpos + ")")
        .append("rect")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", subfieldwidth)
            .attr("height", subfieldheight)
            .attr("class", "gameViewMarkedSubfield")
            .attr("visibility", "hidden"); //default visibility is hidden, we'll activate it once needed
    }
  }
  return {
    drawBoardShape: function() {
      //generate groups with unique IDs to draw our stuff on later on.
      generateActiveSubfieldMarkers();
     
      var boardShape = gameView.append("g")
        .attr("id", "gameViewBoardShapes");
      //draw "big" boardShape
      drawGenericBoardshape(boardShape, "boardShapeMain", margin.left, margin.top, width - margin.left, height - margin.bottom);

      var smallBoardWidth = (width - marginPercentage * 6 * width) / 3;
      var smallBoardHeight = (height - marginPercentage * 6 * height) / 3;
      for (var i = 0; i < 3; ++i) {
        for (var o = 0; o < 3; ++o) {
          drawGenericBoardshape(boardShape, "boardShapeSmall", 
            margin.left * (i + 3) + smallBoardWidth  * i, 
            margin.top  * (o + 3) + smallBoardHeight * o, 
            (smallBoardWidth  * (i+1)) + (marginPercentage * width * (i+1)),
            (smallBoardHeight * (o+1)) + (marginPercentage * height * (o+1))
          );
        }
      }
    },
    drawBoardDecorations: function() {
      var boardDecoration = gameView.append("g");
      boardDecoration.attr("id", "gameViewBoarddecoration");
      var line = boardDecoration.append("line")
      .attr("class", "boardDecorationOuter")
        .attr("x1", margin.left)
        .attr("y1", margin.top)
        .attr("x2", margin.left)
        .attr("y2", height - margin.bottom);
      line = boardDecoration.append("line")
        .attr("class", "boardDecorationOuter")
        .attr("x1", margin.left)
        .attr("y1", margin.top)
        .attr("x2", width - margin.right)
        .attr("y2", margin.top);
      line = boardDecoration.append("line")
        .attr("class", "boardDecorationOuter")
        .attr("x1", width - margin.right)
        .attr("y1", margin.top)
        .attr("x2", width - margin.right)
        .attr("y2", height - margin.bottom);
      line = boardDecoration.append("line")
        .attr("class", "boardDecorationOuter")
        .attr("x1", margin.left)
        .attr("y1", height - margin.bottom)
        .attr("x2", width - margin.right)
        .attr("y2", height - margin.bottom);
    },
    drawBoardSymbols: function(board) {
        //draw symbols into those groups
    }
   };
});