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

  /*
  * HTTP GET
  */
  if (request.method == "GET") {
    console.log("GET on " + request.url)
    var requestedId = null;
    request.pipe(concatStream(function(data) { //collect incoming datastream
      if (data != "") {
        data = JSON.parse(data);
        if (data.gameId)
        requestedId = data.gameId;
      } else {
        var urlsplit = request.url.split('/');
        if (urlsplit.length > 1) {
          requestedId = urlsplit[1];
        }
      }
      if (requestedId) { //get a specific game if requestedId was set.
        boardmanager.getGame(requestedId, sendProcessedBoardToClient);
      } else { //return the oldest game with only 1 player
        //TODO: don't get random, get oldest!
        boardmanager.getRandomGame(sendProcessedBoardToClient);
      }
    }));
  }

  /*
  * HTTP PUT
  */
  if (request.method == "PUT") {
    console.log("PUT on " + request.url)
    request.pipe(concatStream(function (data) { //collect incoming datastream
      console.log("Got board: " + data)
      var game = JSON.parse(data);
      if (
          (game) &&
          (game.board.move) &&
          (game.gameId) &&
          (game.currentMoveId) &&
          (game.playerIds)
        ) //TODO: elaborate input sanitization
        boardmanager.processMove(game, sendProcessedBoardToClient);
      else { //the PUT data failed our sanity check, HTTP 422: Unprocessable Entity
          console.log(game);
          sendObject(null, 422);
      }
    }));
  }

  /*
  * HTTP POST
  */
  if (request.method == "POST") {
    console.log("POST on " + request.url)
    var game = boardmanager.createNewGame();
    sendObject(game);
  }

});


/*
* export for automated testing because i don't know any better
*/
module.exports = {
  server:server,
  port:port
};

console.log("starting hypertoc-api on port " + port);
server.listen(port);
