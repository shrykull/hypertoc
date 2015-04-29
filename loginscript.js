var centerX,endY;
var gameId;
$(document).ready(function(){
  centerX = $(window).scrollLeft() + $(window).width() / 2 - ($("#pleaseWaitBox").width()/2);
  endY = $(window).scrollTop() + $(window).height() / 5;
  $("#pleaseWaitBox").offset({top: $(window).scrollTop() + $(window).height(),left: centerX});
});

function login(){
  pollDataFromServer()
  showPleaseWaitBox();
  $("#loginAnonymousButton").fadeOut(100);
}



function createGame(){
  showPleaseWaitBox();
	$("#loginAnonymousButton").fadeOut(100);
	$("#createGameButton").fadeOut(100);
  $("#abortButton").css('visibility','visible').hide().fadeIn(100)

	$.ajax({
		type: "POST",
		url: "http://shrye.net/api/",
		dataType: "json"
	})
	.done(function( serverResponse ) {

		console.log(serverResponse);

		
    gameId = serverResponse.id;
		$("#linkField").val("http://localhost/play?id=" + serverResponse.id);
    $("#enterGameLink").attr('href',"/play?id=" + serverResponse.id);

	})
	.fail(function (serverResponse){

    $("#pleaseWaitBox").append("<br/> Fuck");
    console.log(serverResponse);
  });
}
function showPleaseWaitBox(){
  $("#pleaseWaitBox").css('visibility','visible').hide().fadeIn(500);
	slideWaitingBoxUp( $(window).scrollTop() + $(window).height());
}

function abortCreation(){
  $("#loginAnonymousButton").fadeIn(100);
  $("#createGameButton").fadeIn(100);
  $("#abortButton").css('visibility','visible').hide().fadeOut(100);
  $("#pleaseWaitBox").fadeOut(100);
  //TODO: use way without proxy
  $.ajax({
    url: "http://localhost/hypertoc/server/restProxy/delete.php?" + $.param({"Id": gameId}),
		type: "DELETE"
	})
	.done(function( serverResponse ) {

		console.log(serverResponse);

	})
	.fail(function (){

    $("#pleaseWaitBox").append("<br/> Fuck");

  });
}

function slideWaitingBoxUp(actY){
  actY -= (actY-endY)*0.2;

  $("#pleaseWaitBox").offset({ top: actY, left: centerX});
  if(actY > endY +20){
    setTimeout(function(){
      slideWaitingBoxUp(actY)
    }
    ,33);
  }else{
    return;
  }
}
