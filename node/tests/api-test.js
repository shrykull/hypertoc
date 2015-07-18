var http = require('http');
var api = require("../hypertoc-api");

var request = http.request({
    host:"localhost",
    port:8989,
    method: 'POST'
  }, function(response) {  
  var data = '';
    response.on('data', function(d) {
      data += d;
    });
    response.on('error', function (d) {
      console.log("error " + d);
      api.server.close();
    });
    response.on('end', function() {
      console.log("test response: " + data.toString());
      api.server.close();
    })
  });
  
//TODO: make this a test that can fail
//TODO: add comments what is tested here and what the result should be
request.write(JSON.stringify({gameId:5}));
request.end();