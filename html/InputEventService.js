var hypertoc = angular.module('hypertoc');

var click = function(subfieldIndex, symbolIndex) {
  console.log("click " + subfieldIndex + "/" + symbolIndex);
};

var hoverIn = function(subfieldIndex, symbolIndex) {
  console.log("In " + subfieldIndex + "/" + symbolIndex);
}
var hoverOut = function(subfieldIndex, symbolIndex) {
  console.log("Out " + subfieldIndex + "/" + symbolIndex);
}

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
    registerOnClickEvents:init,
  };
});