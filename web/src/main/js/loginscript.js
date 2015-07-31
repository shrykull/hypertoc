var centerX,endY;
var gameId;
var apiUrl = "http://localhost/hypertoc/api/"
$(document).ready(function(){
  centerX = $(window).scrollLeft() + $(window).width() / 2 - ($("[data-id=pleaseWaitBox]").width()/2);
  endY = $(window).scrollTop() + $(window).height() / 5;
  $("[data-id=pleaseWaitBox]").offset({top: $(window).scrollTop() + $(window).height(),left: centerX});
});


function createGame(){
  showPleaseWaitBox();
	$("#loginAnonymousButton").fadeOut(100);
	$("#createGameButton").fadeOut(100);
  $("#abortButton").fadeIn(100)

	$.ajax({
		type: "POST",
		url: apiUrl,
		dataType: "json"
	})
	.done(function( serverResponse ) {

		console.log(serverResponse);


    gameId = serverResponse.id;
		$("#linkField").val("http://localhost/hypertoc/index.html?id=" + serverResponse.id);
    $("#enterGameLink").attr('href',"index.html?id=" + serverResponse.id);

	})
	.fail(function (serverResponse){

    console.log(serverResponse);
  });
}
function showPleaseWaitBox(){
  $("[data-id=pleaseWaitBox]").css('visibility','visible').hide().fadeIn(500);
	slideWaitingBoxUp( $(window).scrollTop() + $(window).height());
}

function abortCreation(){
  $("#loginAnonymousButton").fadeIn(100);
  $("#createGameButton").fadeIn(100);
  $("#abortButton").css('visibility','visible').hide().fadeOut(100);
  $("[data-id=pleaseWaitBox]").fadeOut(100);

  $.ajax({
    url: apiUrl + gameId,
		type: "DELETE",
    statusCode: {
      200: function(){
        console.log("deleted");
      },
      404: function(){
        console.log("error while deleting");
      }
    }
	});
}

function slideWaitingBoxUp(actY){
  actY -= (actY-endY)*0.2;

  $("[data-id=pleaseWaitBox]").offset({ top: actY, left: centerX});
  if(actY > endY +20){
    setTimeout(function(){
      slideWaitingBoxUp(actY)
    }
    ,33);
  }else{
    return;
  }
}
