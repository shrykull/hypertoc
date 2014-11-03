var canvas = document.getElementById("canvas");
var  canvasContext = canvas.getContext("2d");
var mainColor= "#000000";
var subColor = "#B6B6B4";
var subFieldSize = 50;
drawFields(subFieldSize*9,0,0);
canvas.addEventListener("click", handleFieldClick);
var player = 1;
var nextField = null;	//should be = {x=0,y=5};
var fields = [[],[]];
function initGame(){

}

function drawFields(size, startXPos,startYPos){
	//main field
	drawField(size,startXPos,startXPos,mainColor);
	//sub fields
	for(x=startXPos;x<size+startXPos;x+=(size/3)){
		for(y=startYPos;y<size+startYPos;y+=(size/3)){
			drawField(size/3,x,y,subColor);
		}
	}
}
function drawField(size, startXPos,startYPos,color){
	//horizontal
	canvasContext.beginPath();
	canvasContext.moveTo(startXPos,startYPos+size*(1/3));
	canvasContext.lineTo(startXPos+size,startYPos+size*(1/3));

	canvasContext.moveTo(startXPos,startYPos+size*(2/3));
	canvasContext.lineTo(startXPos+size,startYPos+size*(2/3));
	//vertical
	canvasContext.moveTo(startXPos+size*(1/3),startYPos);
	canvasContext.lineTo(startXPos+size*(1/3),startYPos+size);
	canvasContext.moveTo(startXPos+size*(2/3),startYPos);
	canvasContext.lineTo(startXPos+size*(2/3),startYPos+size);
	canvasContext.strokeStyle = color;
	canvasContext.stroke();
	canvasContext.closePath();
}
function handleFieldClick(e){
/*var xClick = e.clientX - canvas.offsetLeft;
	var yClick = e.clientY - canvas.offsetTop;
	var clickedFieldX = parseInt(xClick /subFieldSize);
	var clickedFieldY = parseInt(yClick /subFieldSize);
	console.log(clickedFieldX + " " + clickedFieldY);    */
	
	var xClick = e.clientX - canvas.offsetLeft;
	var yClick = e.clientY - canvas.offsetTop;
	var clickedFieldX = parseInt(xClick /subFieldSize);
	var clickedFieldY = parseInt(yClick /subFieldSize);
	console.log(clickedFieldX + " " + clickedFieldY); 
	
	
	
	if(player==1){
		drawCircle(clickedFieldX,clickedFieldY);
		player = 2;
	}else{
		drawCross(clickedFieldX,clickedFieldY);
		player = 1;		
	}
}

function drawCircle(xpos,ypos){
	canvasContext.beginPath();
	canvasContext.strokeStyle = "#ff0000"
	canvasContext.arc(xpos*subFieldSize+ subFieldSize/2,ypos*subFieldSize + subFieldSize/2,subFieldSize/2,0,2*Math.PI)
	canvasContext.stroke();
	canvasContext.closePath();
}
function drawCross(xpos,ypos){
	canvasContext.beginPath();
	canvasContext.strokeStyle = "#ff0000"
	canvasContext.moveTo(xpos*subFieldSize,ypos*subFieldSize);
	canvasContext.lineTo(xpos*subFieldSize+subFieldSize,ypos*subFieldSize + subFieldSize);
	canvasContext.moveTo(xpos*subFieldSize + subFieldSize,ypos*subFieldSize);
	canvasContext.lineTo(xpos*subFieldSize,ypos*subFieldSize + subFieldSize);
	canvasContext.stroke();
	canvasContext.closePath();
}










//objects
function Field(x,y){

	this.xpos = xpos;
	this.ypos = ypos;
	//who won on this field (0=nobody yet, 1=player1,2=player2,3=draw)
	this.wonBy = 0;
	
	this.handleClick = function(xpos,ypos){
		if(this.wonBy==0){
			
		}
	}
	
	
}



