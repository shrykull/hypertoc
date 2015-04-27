var centerX,endY;

$(document).ready(function(){
  centerX = $(window).scrollLeft() + $(window).width() / 2 - ($("#pleaseWaitBox").width()/2);
  endY = $(window).scrollTop() + $(window).height() / 5;
  $("#pleaseWaitBox").offset({top: $(window).scrollTop() + $(window).height(),left: centerX});
});

function login(){
  pollDataFromServer()
  $("#pleaseWaitBox").css('visibility','visible').hide().fadeIn(500);
  slideWaitingBoxUp( $(window).scrollTop() + $(window).height());
  $("#loginAnonymousButton").fadeOut(100);
}
function createGame(){
	$("#pleaseWaitBox").css('visibility','visible').hide().fadeIn(500);
	slideWaitingBoxUp( $(window).scrollTop() + $(window).height());
	$("#loginAnonymousButton").fadeOut(100);
	$("#createGameButton").fadeOut(100);
	
	
	$.ajax({
		type: "POST",
		url: "http://localhost/hypertoc/server/restProxy/post.php",
		dataType: "json"
	})
	.done(function( serverResponse ) {
		
		console.log(serverResponse);
		
		//TODO: insert richtige domain
		$("#linkField").val("http://localhost/play?id=" + serverResponse.id);
		$("#pleaseWaitBox").append('<br/> <a href="/play?id=' + serverResponse.id +'">Enter game</a>');

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