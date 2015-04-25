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

function enquePlayer(){
  $.ajax({
    type: "POST",
    url: "server/enquePlayer.php",
    data: {
      username : "anonym"
    }
  }).done(function( serverResponse ) {
  });

}

//Examle for rest
function pollDataFromServer(){

  $.ajax({
    url: "http://rest-service.guides.spring.io/greeting",
  }).done(function( serverResponse ) {

    ajaxDone(serverResponse);

    setTimeout(function(){
      pollDataFromServer();
    },1000);

  });
  //TODO: hier pollen bis entweder fehler oder eben spieler gefunden

}
function ajaxDone(response){
  console.log(response);
  $("#pleaseWaitBox").append("<br/>" + response.id + "</br>");
  $("#pleaseWaitBox").append(response.content);
  $('#pleaseWaitBox').append("<p>irgendwie status?</p>");
  //TODO: wenn kein Fehler zurück dann hald son polling aktivieren!
}
