var hypertoc = angular.module('hypertoc');
hypertoc.factory('DrawService', function() {
  /*
   * Style Parameters (edit as needed)
   */
  var width = 500;
  var height = 500;

  var marginPercentage = 0.01;

  var strokemargin = marginPercentage * width;

  /*
   * calculated simplifiers for use later (add more as needed)
   */
  var margin = {
    top:height * marginPercentage,
    bottom:height * marginPercentage,
    left: width * marginPercentage,
    right: width * marginPercentage
  };

  var subfieldwidth  = (width  - (margin.left*4 + margin.right*4)) / 3,
      subfieldheight = (height - (margin.top*4  + margin.bottom*4)) / 3;

  var symbolWidth   = (subfieldwidth  - (margin.left*4 + margin.right*4))  / 3;
  var symbolHeight  = (subfieldheight - (margin.left*4 + margin.right*4))  / 3;

  var gameView = d3.select('[data-id=gameContainer]')
    .append('svg')
    .attr("width", width)
    .attr("height", height);
  gameView.attr("class", "gameView");
  var secondaryDisplay = d3.select('[data-id=secondaryDisplay]')
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

  var initializeDynamicBoardElements = function() {
    var xpos, ypos, absoluteXpos, absoluteYpos;
    var subfield;

    var currentMarkerGroup;
    var linearSymbolIndex; //needed for translation from coordinates to array index

    for (var linearSubfieldIndex = 0; linearSubfieldIndex < 9; ++linearSubfieldIndex) {
      xpos = linearSubfieldIndex % 3;
      ypos = Math.floor(linearSubfieldIndex / 3);
      absoluteXpos = margin.left  + (margin.left *2   + margin.right  + subfieldwidth)  * xpos;
      absoluteYpos = margin.top   + (margin.bottom *2 + margin.top    + subfieldheight) * ypos ;
      subfield = gameView.append("g") //generate a group with id to find it again once we get data
        .attr("id", "subfield-" + linearSubfieldIndex)
        .attr("transform", "translate("+ absoluteXpos + ", " + absoluteYpos + ")");
      subfield.append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", subfieldwidth)
        .attr("height", subfieldheight)
        .attr("class", "gameViewMarkedSubfield")
        .attr("visibility", "hidden"); //default visibility is hidden, we'll activate it once needed

      var x;
      for (var subfieldIndexX = 0; subfieldIndexX < 3; ++subfieldIndexX) {
        for (var subfieldIndexY = 0; subfieldIndexY < 3; ++subfieldIndexY) {
          absoluteXpos = margin.left  + (margin.left*2  + margin.right  + symbolWidth)  * subfieldIndexX;
          absoluteYpos = margin.top   + (margin.top *2  + margin.bottom + symbolHeight) * subfieldIndexY;
          linearSymbolIndex = subfieldIndexX + subfieldIndexY * 3;

          currentMarkerGroup = subfield.append("g").attr("id", "symbol-" + linearSymbolIndex);
          currentMarkerGroup.attr("transform", "translate(" + absoluteXpos + ", " + absoluteYpos + ")");
          currentMarkerGroup.append("g")
            .attr("id", "symbol-space-" + linearSymbolIndex)
            .attr("visibility", "visible")
            .attr("class", "marker symbol-background")
            .append("rect")
              .attr("x", 0).attr("y", 0)
              .attr("width", symbolWidth).attr("height", symbolHeight);
          x = currentMarkerGroup.append("g");
          x.attr("class", "marker marker-x")
            .attr("visibility", "hidden")
            .append("line")
              .attr("x1", 0).attr("y1", 0)
              .attr("x2", symbolWidth)
              .attr("y2", symbolHeight);
          x.append("line")
              .attr("x1", symbolWidth).attr("y1", 0)
              .attr("x2", 0)
              .attr("y2", symbolHeight);
          currentMarkerGroup.append("g")
            .attr("class", "marker marker-o")
            .attr("visibility", "hidden")
            .append("circle")
              .attr("cx", symbolWidth / 2)
              .attr("cy", symbolHeight / 2)
              .attr("r", Math.min(symbolWidth, symbolHeight) / 2);
         }
      }
    }
  };

  var drawX = function(subfieldIndex, symbolIndex) {
    d3.select('#subfield-' + subfieldIndex)
      .select('#symbol-' + symbolIndex)
      .select('.marker-x').attr("visibility", "visible");

    d3.select('#subfield-' + subfieldIndex)
      .select('#symbol-' + symbolIndex)
      .select('.marker-o').attr("visibility", "hidden");
  };
  var drawO = function(subfieldIndex, symbolIndex) {
    d3.select('#subfield-' + subfieldIndex)
      .select('#symbol-' + symbolIndex)
      .select('.marker-x').attr("visibility", "hidden");

    d3.select('#subfield-' + subfieldIndex)
      .select('#symbol-' + symbolIndex)
      .select('.marker-o').attr("visibility", "visible");
  };
  var drawEmptySpace = function(subfieldIndex, symbolIndex) {
    d3.select('#subfield-' + subfieldIndex)
      .select('#symbol-' + symbolIndex)
      .select('.marker-x').attr("visibility", "hidden");

    d3.select('#subfield-' + subfieldIndex)
      .select('#symbol-' + symbolIndex)
      .select('.marker-o').attr("visibility", "hidden");
  };

  var drawBoardDecorations = function() {
      var boardDecoration = gameView.append("g");
      boardDecoration.attr("class", "gameViewBoarddecoration");
      var line = boardDecoration.append("line")
      .attr("class", "boardDecorationOuter") //left margin
        .attr("x1", margin.left / 2)
        .attr("y1", margin.top / 2)
        .attr("x2", margin.left / 2)
        .attr("y2", height - margin.bottom / 2);
      line = boardDecoration.append("line") //top margin
        .attr("class", "boardDecorationOuter")
        .attr("x1", margin.left / 2)
        .attr("y1", margin.top / 2)
        .attr("x2", width - margin.right / 2)
        .attr("y2", margin.top / 2);
      line = boardDecoration.append("line") //right margin
        .attr("class", "boardDecorationOuter")
        .attr("x1", width - margin.right / 2)
        .attr("y1", margin.top / 2)
        .attr("x2", width - margin.right / 2)
        .attr("y2", height - margin.bottom / 2);
      line = boardDecoration.append("line") //bottom margin
        .attr("class", "boardDecorationOuter")
        .attr("x1", margin.left / 2)
        .attr("y1", height - margin.bottom / 2)
        .attr("x2", width - margin.right / 2)
        .attr("y2", height - margin.bottom / 2);
    };
  var drawBoardShapes = function() {
    var boardShape = gameView.append("g")
      .attr("class", "gameViewBoardShapes");
    //draw "big" boardShape
    drawGenericBoardshape(boardShape, "boardShapeMain", margin.left, margin.top, width - margin.right, height - margin.bottom);

    var smallBoardWidth = (width - marginPercentage * 6 * width) / 3;
    var smallBoardHeight = (height - marginPercentage * 6 * height) / 3;
    for (var i = 0; i < 3; ++i) {
      for (var o = 0; o < 3; ++o) {
        drawGenericBoardshape(boardShape, "boardShapeSmall",
          margin.left + (margin.left + margin.right  + smallBoardWidth ) * i,
          margin.top  + (margin.top  + margin.bottom + smallBoardHeight) * o,
          margin.left + (margin.left + margin.right  + smallBoardWidth ) * i + smallBoardWidth,
          margin.top  + (margin.top  + margin.bottom + smallBoardHeight) * o + smallBoardHeight
        );
      }
    }
  };
  return {
    initializeBoard: function() {
      drawBoardDecorations(); //draws outer border
      initializeDynamicBoardElements(); //draws ALL X and O for later visibility
      drawBoardShapes(); //draws ten hashtags
    },
    initializeSecondaryDisplay: function() {
      var group = secondaryDisplay.append("g");
      group
        .append("rect")
          .attr("width", function() { return document.querySelector('[data-id=secondaryDisplay]').firstChild.getAttribute("height"); })
          .attr("height", function() { return document.querySelector('[data-id=secondaryDisplay]').firstChild.getAttribute("height"); })
          .attr("fill", "green");

      var margin = 3; //TODO: auslagern
      group
        .append("rect")
          .attr("x", margin)
          .attr("y", margin)
          .attr("width", function() {
            return document.querySelector('[data-id=secondaryDisplay]').firstChild.getAttribute("height") - margin*2;
          })
          .attr("height", function() {
            return document.querySelector('[data-id=secondaryDisplay]').firstChild.getAttribute("height") - margin*2;
          })
          .attr("stroke-width", 2)
          .attr("stroke", "black")
          .attr("fill", "none");
      group
        .append("text")
          .attr("text-anchor", "middle")
          .attr("alignment-baseline", "middle")
          .attr("x", function() { return document.querySelector('[data-id=secondaryDisplay]').firstChild.getAttribute("height") / 2; })
          .attr("y", function() { return document.querySelector('[data-id=secondaryDisplay]').firstChild.getAttribute("height") / 2; })
          .text("-Start-");
      group.on("click", function() {console.log("click on secondary display button")})
    },
    drawBoardSymbols: function(board) {
        //draw symbols into subfields 0-8
        var subfieldIndex, symbolIndex;
        for (subfieldIndex = 0; subfieldIndex < 9; ++subfieldIndex) {
            for (symbolIndex = 0; symbolIndex < 9; ++symbolIndex) {
                switch (board.field[subfieldIndex][symbolIndex]) {
                    case "X":
                        drawX(subfieldIndex, symbolIndex);
                        break;
                    case "O":
                        drawO(subfieldIndex, symbolIndex);
                        break;
                    default: //make sure nothing is drawn in the selected group
                        drawEmptySpace(subfieldIndex, symbolIndex);
                }
            }
        }

    }
   };
});
