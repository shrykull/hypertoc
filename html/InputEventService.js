var hypertoc = angular.module('hypertoc');

var eventHandlers = {
  //methods are to be overwritten by services who want to use it
  click:function() {},
  mouseIn:function() {},
  mouseOut:function() {}
};

var click = function(subfieldIndex, symbolIndex) {
  eventHandlers.click(subfieldIndex, symbolIndex);
};

var hoverIn = function(subfieldIndex, symbolIndex) {
  eventHandlers.mouseIn(subfieldIndex, symbolIndex);
};

var hoverOut = function(subfieldIndex, symbolIndex) {
  eventHandlers.mouseOut(subfieldIndex, symbolIndex);
};


hypertoc.factory('InputEventService', function() {
  var init = function() {
    //add onclick function to all symbol-* ids
    for (var subfieldIndex = 0; subfieldIndex < 9; ++subfieldIndex) {
      for (var symbolIndex = 0; symbolIndex < 9; ++symbolIndex) {
        d3.select('#subfield-' + subfieldIndex).select('#symbol-' + symbolIndex)
          .attr("onclick", "click(" + subfieldIndex +  "," + symbolIndex + ")")
          .attr("onmouseover", "hoverIn(" + subfieldIndex +  "," + symbolIndex + ")")
          .attr("onmouseout", "hoverOut(" + subfieldIndex +  "," + symbolIndex + ")");
      }
    }
  }
  return {
    //TODO: define click events
    addMouseEventHooks:init,
    events:eventHandlers
  };
});