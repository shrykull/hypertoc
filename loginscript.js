var centerX,endY;
var requestCounter = 0
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
function pollDataFromServer(){
  id =  0,
  $.ajax({

    url: "game/" + id,

  })
  .done(function( serverResponse ) {

    ajaxDone(serverResponse);

    if(requestCounter >= 3){
      //TODO: insert real REST stuff here
      window.location.href = "index.html";
    }else{
      setTimeout(function(){
        pollDataFromServer();
      },1000);

      requestCounter++;
    }
  })
  .fail(function (){

    $("#pleaseWaitBox").append("<br/> Fuck");

  });

}
function ajaxDone(response){
  console.log(response);
}
