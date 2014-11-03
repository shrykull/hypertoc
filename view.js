var canvasElement, canvasContext;
	var secondaryDisplayElement, secondaryDisplayContext;

//Layout
var subfieldBorderRelative = 0.02,
    bordercolor = 'darkgray',
    bigbordercolor = 'black',
    markedColor = 'lightgreen',
    bigXColor = 'darkred',
    xColor = 'red',
    xLineWidth = 2,
    bigXLineWidth = 14,
    bigOColor = 'darkgreen',
    oColor = 'green',
    bigOLineWidth = 14,
    oLineWidth = 2;


var subfield, subfieldGeometry, clickableSubfieldRects, field,
	currentPlayerSymbol,turnNumber;

init();

$(document).ready(function(){
		document.getElementById("networkingButton").addEventListener('click', jsonToServerTest, false);
});









/*
 *********
 * Model *
 *********
 */

function checkCollision(rect, mouseX, mouseY) {
	var width = getSubfieldRects().subfieldwidth,
		height = getSubfieldRects().subfieldheight;
	if (((mouseX > rect.x) && (mouseX < (rect.x+width)))
	&& ((mouseY > rect.y) && (mouseY < (rect.y+height)))) {
		return true;
	}
	return false;
}

//finds out the area within the subfield we clicked on
function getSubfieldCollisionID(field, mouseX, mouseY) {
    var relativeMouseX = (mouseX - field.x) / getSubfieldRects().subfieldwidth,
        relativeMouseY = (mouseY - field.y) / getSubfieldRects().subfieldheight;
    return Math.floor(relativeMouseX * 3 + 3 * Math.floor(3*relativeMouseY)); 
}

function clickedOnSubField(mouseX, mouseY) {
	var rects = getSubfieldRects().rects;
	for (var i = 0; i < rects.length; i++) {
		if (checkCollision(rects[i], mouseX, mouseY)) {
			return rects[i];
		}
	}
	return null;
}

function getSubfieldRects() {
	var borderthickness = subfieldGeometry.borderthickness,
		width = subfieldGeometry.width,
		height = subfieldGeometry.height;
	return {
		rects: [{
			n: 0,
			x: borderthickness, 
			y: borderthickness
		}, {
			n: 1,
			x: 2*borderthickness + width,
			y: borderthickness
		}, {
			n: 2,
			x: 3*borderthickness + 2*width,
			y: borderthickness
		}, {
			n: 3,
			x: borderthickness,
			y: 2 * borderthickness + height
		}, {
			n: 4,
			x: 2 * borderthickness + width,
			y: 2 * borderthickness + height
		}, {
			n: 5, 
			x: 3 * borderthickness + 2 * width,
			y: 2 * borderthickness + height
		}, {
			n: 6,
			x: borderthickness,
			y: 3 * borderthickness + 2 * height
		}, {
			n: 7,
			x: 2*borderthickness + width, 
			y: 3 * borderthickness + 2 * height
		}, {
			n: 8,
			x: 3 * borderthickness + 2 * width,
			y: 3 * borderthickness + 2 * height
		}],
		subfieldheight 			: height,
		subfieldwidth 			: width,
		subfieldBorderThickness : borderthickness
	};
}

function getSubfieldValues(subfieldID) {
	return field[subfieldID];
}

function getSubField(subfieldXCoord, subfieldYCoord) {
	return {
		x     : subfieldXCoord,
		y 	  : subfieldYCoord,
		top   : subfieldGeometry.borderthickness + subfieldXCoord * (subfieldGeometry.height + subfieldGeometry.borderthickness),
		left  : subfieldGeometry.borderthickness + subfieldYCoord * (subfieldGeometry.width + subfieldGeometry.borderthickness), 
		height: subfieldGeometry.height,
		width : subfieldGeometry.width,
		values: getSubfieldValues(subfieldXCoord+3*subfieldYCoord)
	};
}

function findClickedField(mouseX, mouseY) {
	var subfieldXCoord, subfieldYCoord, subfieldBorders = getSubfieldRects();
	var clickedSubField = clickedOnSubField(mouseX, mouseY);
	if (clickedSubField) {
		subfieldXCoord = clickedSubField.n % 3;
		subfieldYCoord = Math.floor(clickedSubField.n / 3);
	} else {
		return 0;
	}
	
	return getSubField(subfieldXCoord, subfieldYCoord, subfieldBorders);
}




















/*
 ********
 * View *
 ********
 */
 function drawSymbolOnSubSubField(symbol, subfieldID, subsubfieldID) {
 	var subsubfieldWidth = subfieldGeometry.width / 3;
 	var subsubfieldLeft = getSubfieldRects().rects[subfieldID].x
 			+ (subsubfieldID % 3) * subsubfieldWidth, 
 		subsubfieldTop = getSubfieldRects().rects[subfieldID].y
 			+ Math.floor(subsubfieldID / 3) * subsubfieldWidth;
 	
 	switch (symbol) {
 		case "X":
			drawX(xColor, xLineWidth, subsubfieldTop, subsubfieldLeft, subsubfieldWidth, subsubfieldWidth);
 			break;
 		case "O":	
 			drawO(oColor, oLineWidth, subsubfieldTop, subsubfieldLeft, subsubfieldWidth, subsubfieldWidth);
 			break;
 		default:
 			//do nothing
 	}
 	update();
 }
 

 function drawX(context, color, lineWidth, top, left, width, height) {
 	var lineRadius = lineWidth / 2; 
 	
	context.beginPath();
	context.strokeStyle = color;
	context.lineWidth = lineWidth;
	
	context.moveTo(left + lineRadius, top + lineRadius);
	context.lineTo(left + width - lineRadius, top + height - lineRadius);
	
	context.moveTo(left + width - lineRadius, top + lineRadius);
	context.lineTo(left + lineRadius, top + height - lineRadius);
	
	context.stroke();
	context.closePath();
 }
 
 function drawO(context, color, lineWidth, top, left, width, height) {
 	context.beginPath();
	context.strokeStyle = color;
	context.lineWidth = lineWidth;
	context.arc(
		left + width / 2, 
		top + height / 2, 
		(width - lineWidth) / 2, 

		0, 
		2 * Math.PI, 
		false
	);
	context.stroke();
	context.closePath();

 }
 
function markSubFieldByCoordinate(mouseX, mouseY) {
	//find out subfield
	subfield = findClickedField(mouseX, mouseY);
	if (subfield !== 0) {
		markSubField(subfield);
	}
}

function markSubFieldRect(subFieldRect) {
	//TODO: find a more elegant way to solve this
	markSubFieldByCoordinate(subFieldRect.x + 1, subFieldRect.y + 1);
}

function markSubField(subfield) {
	//mark the subfield we clicked on
	//canvasContext.clearRect(0, 0, canvasElement.width, canvasElement.height);
	canvasContext.beginPath();
	canvasContext.strokeStyle = bordercolor;
	canvasContext.lineWidth = 1;
	canvasContext.rect(
		subfield.top,
		subfield.left,
		subfield.width,
		subfield.height
	);
	canvasContext.fillStyle = markedColor;
	canvasContext.fill();
	canvasContext.stroke();
	canvasContext.closePath();
//	update();
}

function drawFieldBorder(startXPos, startYPos, size, color, strokeWidth) {
        //horizontal
    	canvasContext.beginPath();
    	canvasContext.strokeStyle = color;
    	canvasContext.lineWidth = strokeWidth;
    	canvasContext.moveTo(startXPos,startYPos+size*(1/3));
    	canvasContext.lineTo(startXPos+size,startYPos+size*(1/3));
    
    	canvasContext.moveTo(startXPos,startYPos+size*(2/3));
    	canvasContext.lineTo(startXPos+size,startYPos+size*(2/3));
    	//vertical
    	canvasContext.moveTo(startXPos+size*(1/3),startYPos);
    	canvasContext.lineTo(startXPos+size*(1/3),startYPos+size);
    	canvasContext.moveTo(startXPos+size*(2/3),startYPos);
    	canvasContext.lineTo(startXPos+size*(2/3),startYPos+size);
    	canvasContext.stroke();
    	canvasContext.closePath();
}

//this draws the full game area 
function drawFieldBorders() {
    var fields = getSubfieldRects(),
        currentField;
    //draw tiny ones
    for (var i = 0; i < fields.rects.length; ++i) {
        currentField = fields.rects[i];
        drawFieldBorder(currentField.x, currentField.y, fields.subfieldwidth, bordercolor, 1);
    }
    //draw big one
    drawFieldBorder(
        fields.rects[0].x - fields.subfieldBorderThickness/2,
        fields.rects[0].y- fields.subfieldBorderThickness/2, 
        fields.subfieldwidth*3 + fields.subfieldBorderThickness*3, 
        bigbordercolor, 
        3
    );
}

function drawFieldValues() {
	for (var i = 0; i < getSubfieldRects().rects.length;++i) {
		var values = getSubfieldValues(getSubfieldRects().rects[i].n);
		for (var o = 0; o < values.length; ++o) {
			drawSymbolOnSubSubField(values[o], i, o);
		}
	}
}

function drawWinMarkers() {
	for (var i = 0; i < field.length; ++i) {
		if (subfieldIsDone(i)) {
			var subfieldRect = getSubfieldRects().rects[i], 
				symbolGeometry = {
					left:Math.floor(subfieldRect.x),
					top:Math.floor(subfieldRect.y),
					width:Math.floor(getSubfieldRects().subfieldwidth),
					height:Math.floor(getSubfieldRects().subfieldwidth)
				};
			grayscaleArea(symbolGeometry);
			//TODO: performanter machen
			/*
			 * Performanceboost durch:
			 * - Hardwarebeschleunigung im 3d-context mit webgl nutzen
			 * - Einmal geblurtes zeug cachen und nicht neu berechnen sondern einfach nur aus cache redraw
			*/
			//blurArea(symbolGeometry); 
			switch (getWinningSymbolOfSubfieldID(i)) {
				case "X":
					drawX(

						bigXColor, 
						bigXLineWidth, 
						symbolGeometry.top, 
						symbolGeometry.left, 
						symbolGeometry.width, 
						symbolGeometry.height
					);
					break;
				case "XO":
					drawX(
						canvasContext,

						bigXColor, 
						bigXLineWidth, 
						symbolGeometry.top, 
						symbolGeometry.left, 
						symbolGeometry.width, 
						symbolGeometry.height
					);
					//suppresswarning: break needed or smth
				case "O":
					drawO(

						canvasContext,

						bigOColor, 
						bigOLineWidth, 
						symbolGeometry.top, 
						symbolGeometry.left, 
						symbolGeometry.width, 
						symbolGeometry.height
					);
					
					
				default:
					//do nothing
			}
		}
	}
}

//fades the game field out a bit and shows a banner who won
function drawEndBanner(winner){
	canvasContext.globalAlpha = 0.5;
	canvasContext.fillStyle = "darkgray"; 
	canvasContext.fillRect(0,0,canvasElement.width,canvasElement.height);
	canvasContext.font = "70px Arial";
	canvasContext.fillStyle = "blue";
	canvasContext.rotate(-(20*Math.PI /180));
	canvasContext.globalAlpha = 1;
    switch(winner){
    
    	case "X": {
    		canvasContext.fillText("X has won!",0,canvasElement.height/1.5);
    		break;
    	}
    	case "O" :{
    		canvasContext.fillText("O has won!",0,canvasElement.height/1.5);
    		break;
    	}
    	case "XO" :{
    		//TODO: Achievement unlocked: CRIPPLE FIGHT!
    		canvasContext.fillText("Draw!",0,canvasElement.height/1.5);
    	} 
    }
	
	canvasContext.rotate(20*Math.PI /180);
}



function calculateSubfieldGeometry() {
	var border = canvasElement.height * subfieldBorderRelative;
	subfieldGeometry = {
		height			: (canvasElement.height - border * 4) / 3,
		width 			: (canvasElement.width - border * 4) / 3,
		borderthickness	: border
	};
}

function prepareGameModel() {
	currentPlayerSymbol = selectRandomPlayer();
	calculateSubfieldGeometry();
	clearField();
    clickableSubfieldRects = getSubfieldRects().rects; //make everything clickable
}

//selects a random player (used at the start of the game)
function selectRandomPlayer(){
	var	randomNumber = parseInt(Math.random()*2);
	var players = ["X","O"];
	return players[randomNumber];
}

function drawSecondaryDisplay() {
	var symbolGeometry = {
		left:0,
		top:0,
		width:Math.floor(secondaryDisplayElement.width / 2),
		height:secondaryDisplayElement.height
	};

	
	switch(currentPlayerSymbol) {
		case "X":
			drawX(secondaryDisplayContext, bigXColor, bigXLineWidth, symbolGeometry.top, symbolGeometry.left, symbolGeometry.width, symbolGeometry.height);
			break;
		default:
			drawO(secondaryDisplayContext, bigOColor, bigOLineWidth, symbolGeometry.top, symbolGeometry.left, symbolGeometry.width, symbolGeometry.height);

	}
}
function drawGameArea() {
	clearCanvas();
    markClickableSubfields();
    drawFieldBorders();
    drawFieldValues();
    drawWinMarkers();
    drawSecondaryDisplay();
    update();
}

function update() {
	canvasContext.drawImage(canvasElement, 0, 0);
	secondaryDisplayContext.drawImage(secondaryDisplayElement, 0, 0);
}

function clearCanvas() {
    //canvasContext.clearRect(0, 0, canvasElement.width, canvasElement.height);
    canvasContext.fillStyle="lightgray";
    canvasContext.fillRect(0, 0, canvasElement.width, canvasElement.height);
  
}













/*
 **************
 * Controller *
 **************
 */
function clearField() {
	//yes, for each would look better. idontcare.
	field = [
		[" "," "," "," "," "," "," "," "," "],
		[" "," "," "," "," "," "," "," "," "],
		[" "," "," "," "," "," "," "," "," "],
		
		[" "," "," "," "," "," "," "," "," "],
		[" "," "," "," "," "," "," "," "," "],
		[" "," "," "," "," "," "," "," "," "],
		
		[" "," "," "," "," "," "," "," "," "],
		[" "," "," "," "," "," "," "," "," "],
		[" "," "," "," "," "," "," "," "," "],
	];
}

//returns true if no moves are possible on that subfield anymore
function subfieldIsDone(subfieldID) {
	return getWinningSymbolOfSubfieldID(subfieldID) !== " ";
}

//returns "X", "O", " " if x, o or nobody won yet. returns "XO" on a draw.
function getWinningSymbolOfSubfieldID(fieldID) {
	var subfieldValues = field[fieldID];
	return getWinningSymbolOfSubFieldValues(subfieldValues);
}

function getWinningSymbolOfSubFieldValues(subfieldValues) {
	//horizontal
	for (var i = 0; i < subfieldValues.length; i += 3) {
		if ((subfieldValues[i] !== " ")
			&& (subfieldValues[i] !== "XO")
			&& (subfieldValues[i] == subfieldValues[i+1]) 
			&& (subfieldValues[i+1] == subfieldValues[i+2])
		) {
			return subfieldValues[i];
		}
	}
	//vertical
	for (var i = 0; i < subfieldValues.length / 3; ++i) {
		if ((subfieldValues[i] !== " ") 
			&& (subfieldValues[i] !== "XO")
			&& (subfieldValues[i] == subfieldValues[i+3])
			&& (subfieldValues[i+3] == subfieldValues[i+6])
		) {
			return subfieldValues[i];
		}
	}
	//diagonal
	if (
		(subfieldValues[4] !== " ")
			&& (subfieldValues[i] !== "XO")
			&& ((subfieldValues[0] == subfieldValues[4])
			&& (subfieldValues[4] == subfieldValues[8])
		) || (
			(subfieldValues[2] == subfieldValues[4])
			&& (subfieldValues[4] == subfieldValues[6])
		)
	) { 
		return subfieldValues[4];
	}
	//draw
	if (subfieldValues.indexOf(" ") == -1) {
		return "XO";
	}
	
	//no result yet
	return " ";
}

//checks if some won the game returns "X","O"," " or "XO" for "X" won, "O" won, nobody won, or a draw 
function getWinner(){
	//TODO: 
	var tempFields = [];
	var actSymbol;
	var playerSymbols = ["X","O"];
	var actwinner;
	var winners = [];
	for(var p = 0;p<playerSymbols.length;p++){
			tempFields = [];
		for(var i = 0;i<field.length;i++){
		
			actSymbol = getWinningSymbolOfSubfieldID(i);
			//to make draw Fields count for both players
			if(actSymbol == "XO"){
				tempFields.push(playerSymbols[p]);	
			} 
			else {
				tempFields.push(actSymbol);	
			}
	
		}
		actwinner = getWinningSymbolOfSubFieldValues(tempFields);	
		if(actwinner != " " && $.inArray(actwinner, winners)) winners.push(actwinner);
	
		
	}
	
	if(winners.length === 1){
		return winners[0];
	}
	
	return " ";
	}
	


function handleClick(ev) {
    var mouseX = ev.pageX - canvasElement.offsetLeft, mouseY = ev.pageY - canvasElement.offsetTop;
    var newClickableSubfieldRects = 0;
    for (var i = 0; i < clickableSubfieldRects.length; ++i) {
        if (checkCollision(clickableSubfieldRects[i], mouseX, mouseY)) { //check if inside clickable field
        	var clickedSubSubFieldID = getSubfieldCollisionID(clickableSubfieldRects[i], mouseX, mouseY);
        	if (field[clickableSubfieldRects[i].n][clickedSubSubFieldID] == " ") { //check subsubfield may be set by current player
            	field[clickableSubfieldRects[i].n][clickedSubSubFieldID] = currentPlayerSymbol;
            
				//next player
				switchTurns();   
				turnNumber ++;
				
				
	            //mark next area
	            newClickableSubfieldRects = [getSubfieldRects().rects[clickedSubSubFieldID]];
        	}
            break;
        }
    }
    //determine if next area is already won
    if (newClickableSubfieldRects !== 0) {
    	//something useful was clicked
	    
	    if (subfieldIsDone(newClickableSubfieldRects[0].n)) {
	    	newClickableSubfieldRects = [];
	    	//mark every field that's not done yet
	    	for (var i = 0; i < getSubfieldRects().rects.length; ++i) {
	    		if (!subfieldIsDone(i)) {
	    			newClickableSubfieldRects.push(getSubfieldRects().rects[i]);
	    		}
	    	}
	    }
	    
	    clickableSubfieldRects = newClickableSubfieldRects;
	    
	    drawGameArea();
	    
	    var winner = getWinner();
	    if(winner != " "){
	    		drawEndBanner(winner);
	    		canvasElement.removeEventListener("click", handleClick);
	    }
	    
    }
}
function switchTurns() {
	if (currentPlayerSymbol == "X")
		currentPlayerSymbol = "O";
	else 
		currentPlayerSymbol = "X";
}

function markClickableSubfields() {
    for (var i = 0; i < clickableSubfieldRects.length; ++i) {
        //markSubFieldByCoordinate(clickableSubfields[i].x+1, clickableSubfields[i].y+1);
        markSubFieldRect(clickableSubfieldRects[i]);
    }
}

function init() {
	canvasElement = document.getElementById('gameView');
	canvasContext = canvasElement.getContext('2d');
	
	secondaryDisplayElement = document.getElementById('secondaryDisplay');
	secondaryDisplayContext = secondaryDisplayElement.getContext('2d');
	
	canvasElement.addEventListener('click', handleClick, false);
	document.getElementById("clickButton").addEventListener('click', init, false);
	document.getElementById("testButton").addEventListener('click', test, false);
	turnNumber =0;
	prepareGameModel();
    drawGameArea();
}




/*
 **************
 * Networking *
 **************
 */
 function importantInfoToJson(){
	var json = {
		"field": field, 
		"currentPlayerSymbol" : currentPlayerSymbol,
		"turnNumber" : turnNumber
	};
	return json;
 }
 function jsonToServerTest(){
	 $.ajax({
	  type: "POST",
	  url: "server/server.php",
	  data: importantInfoToJson()
	  }).done(function( serverResponse ) {
	   	console.log(serverResponse);
	  });
	  
 }
 function pollServerTest(){
 	$.post("server/server.php",function(serverResponse){
		console.log(serverResponse);
		
	//	setTimeout(pollServerTest,2000);
	});
 }
 




/*
 *
 * Testing range
 *
 */
 
 function grayscaleArea(rect) {
 	canvasContext.putImageData(
 		Filters.getGrayscaleImage(rect.left, rect.top, rect.width, rect.height), 
 		rect.left, 
 		rect.top);
 }
 
 function blurArea(rect) {
 	var intensity = 2, 
 		blurryImage = Filters.getBlurryImage(
	 		rect.left 	- intensity, 
	 		rect.top 	- intensity, 
	 		rect.width 	+ intensity*2, 
	 		rect.height + intensity*2, 
	 		intensity
 		);
 	canvasContext.putImageData(
 		blurryImage, 
 		rect.left - intensity ,
 		rect.top - intensity
 	);
 }
 
function test() {
	//testContext.putImageData(Filters.getBlurryImage(0, 0, testElement.width, testElement.height, 5), 0, 0);
	//canvasContext.putImageData(Filters.getBlurryImage(173, 173, 153, 153, 5), 173, 173);
	//blurArea({left: 173, top: 173, width: 153, height: 153});
	//grayscaleArea(100,100,200,200);
	field = [
		["X","O","X","O"," ","O","O","X"," "], //unentschieden
		["O","O","O"," "," "," "," "," "," "], 
		["O","O","O"," "," "," "," "," "," "], 
		
		["X","X","X"," "," "," "," "," "," "],
		["O","O","O"," "," "," "," "," "," "],
		["X","X","X"," "," "," "," "," "," "],
		
		["X","X","X"," "," "," "," "," "," "],
		["O","O","O"," "," "," "," "," "," "],
		["O","O","O"," "," "," "," "," "," "],
	];
	drawGameArea();
	drawSecondaryDisplay();
}
//Simple imagefilter object
var Filters = {
	getPixels : function (left, top, width, height) {
		return canvasContext.getImageData(left, top, width, height);
	},
	getGrayscaleImage: function (left, top, width, height) {
		var pixels = this.getPixels(left, top, width, height);
		for (var i = 0; i < pixels.data.length; i += 4) {
			var r = pixels.data[i],
				g = pixels.data[i+1],
				b = pixels.data[i+2],
				a = pixels.data[i+3];
			
			pixels.data[i] = pixels.data[i+1] = pixels.data[i+2] = (0.2*r + 0.7*g + 0.1 * b);
		}
		return pixels;
	},
	getBlurryImage: function(left, top, width, height, intensity) {
		var pixels = this.getPixels(left, top, width, height);
		var pixeldata = pixels.data; //create a local copy so we dont work on our results

		for (intensity; intensity > 0; --intensity) {
			var p, 
				blurWeights = [
					[1/9, 1/9, 1/9],
					[1/9, 1/9, 1/9],
					[1/9, 1/9, 1/9]
				],
				neighbourIDs, 
				neighbours;
			for (var pId = 0; pId < pixeldata.length; pId += 4) {
				//empty pixel
				p = this.pixel(pixeldata, pId);
				p.red = 0;
				p.green = 0;
				p.blue = 0;
				p.alpha = 0;
				
				neighbourIDs = [
					[pId - width*4 -4, 		pId - width*4, 	pId - width*4 +4],
					[pId - 4,  				pId, 			pId + 4],
					[pId + width*4 - 4, 	pId + width*4,	pId + width*4 + 4]
				];
				neighbours = this.getPixelField(pixeldata, neighbourIDs);
				for (var i = 0; i < neighbours.length; ++i) {
					for (var o = 0; o < neighbours[i].length; ++o) {
						p.red 	+= neighbours[i][o].red 	* blurWeights[i][o];
						p.green += neighbours[i][o].green 	* blurWeights[i][o];
						p.blue 	+= neighbours[i][o].blue 	* blurWeights[i][o];
						p.alpha += neighbours[i][o].alpha 	* blurWeights[i][o];
					}
				}
				/*
					p.red 	/= 9;
					p.green /= 9;
					p.blue 	/= 9;
					p.alpha /= 9;
				*/	
				pixels.data[pId+0] = p.red;
				pixels.data[pId+1] = p.green;
				pixels.data[pId+2] = p.blue;
				pixels.data[pId+3] = p.alpha; //just for the sake of it
			}
		}
		return pixels; //hurr durr.
	},
	pixel: function(pixels, position) {
		return {
			red:	pixels[position],
			green:	pixels[position+1],
			blue:	pixels[position+2],
			alpha: 	pixels[position+3]
		};
	},
	getPixelField: function(pixels, ids) {
		var pl = pixels.length, r = [], cid;
		for (var i = 0; i < ids.length; ++i) {
			r[i] = [];
			for (var o = 0; o < ids[i].length; ++o) {
				cid = ids[i][o];
				if ((cid < 0) || (cid > pl)) {
					cid = ids[1][1]; //if pixel given in ids out of bounds, use center pixel
				}
				r[i].push(this.pixel(pixels, cid));
			}
		}
		return r;
	}
};