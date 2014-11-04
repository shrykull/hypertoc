var centerX,endY;
$(document).ready(function(){
 centerX = $(window).scrollLeft() + $(window).width() / 2 - ($("#pleaseWaitBox").width()/2);
 endY = $(window).scrollTop() + $(window).height() / 4;
});


function login(){

    $("#pleaseWaitBox").css('visibility','visible').hide().fadeIn(700);
    slideWaitingBoxUp( $(window).scrollTop() + $(window).height());


/*    function jsonToServerTest(){
      $.ajax({
       type: "POST",
       url: "server/enquePlayer.php",
       data: {
            username : "anonym"
       }
       }).done(function( serverResponse ) {
       });

    } */
}

function slideWaitingBoxUp(actY){
  actY -= (actY-endY)*0.15;

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
