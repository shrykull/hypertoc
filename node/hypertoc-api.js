var http = require('http');
var bl = require('bl');
var concatStream = require('concat-stream');

var boardmanager = require('./boardmanager');

var port = 8989;

var server = http.createServer(function(request, response) {
    /*
   * HELPER FUNCTIONS
   */
  //sends an Object with Status to client. statuscode is optional, default statuscode is 200.
  var sendObject = function(obj, statuscode) {
    if (!statuscode) statuscode = 200; //default to success
    
    //response.setEncoding('utf8');
    response.writeHead(statuscode, {
      'Content-Type': 'text/json',
    });
    response.end(JSON.stringify(obj));
  }
  
  //checks for error, sends that error as statuscode to the client with the given gamestate.
  var sendProcessedBoardToClient = function(error, gamestate) { //let the boardmanager react and sendProcessedBoardToClient with a new gamestate
    if (error) {
      sendObject(gamestate, error);
    }
    else {
      sendObject(gamestate);
    }
  }

  console.log(request.method + ":::");
  
  /*
   * HTTP GET
   */
  if (request.method == "GET") {
    var requestedId = null;
    request.pipe(concatStream(function(data) { //collect incoming datastream
      //TODO: find out requestes Id, if it was requested
    }));
    
    //send new Game if requestedId was not set
    if (!requestedId) {
      var game = boardmanager.createNewGame();
      sendObject(game);
      return;
    } else {
      boardmanager.getGame(requestedId, sendProcessedBoardToClient);
    }
  }
  
   /*
   * HTTP POST
   */
  if (request.method == "POST") {
    request.pipe(concatStream(function (data) { //collect incoming datastream
    console.log("data: " + data);
      boardmanager.processMove(JSON.parse(data), sendProcessedBoardToClient);
    }));
  }  
});


/*
 * export for automated testing because i don't know any better
 */
module.exports = {
  server:server, 
  port:port
};

server.listen(port);