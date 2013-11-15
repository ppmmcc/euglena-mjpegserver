var obj_canvas,
obj_c,
cp_canvas = null;

var canvas
var video_canvas,
vid_c;

var brown_const=0;

var vid_width = 640;
var vid_height = 480;
var n_object = 20;
var m_object = 5;

var canvas;
var context;

function setupD3(){
	var w = 640,
    	h = 480,
    	n = 20,
    	m = 12,
    	l = 80,
    	degrees = 180 / Math.PI;
    
	var objects = d3.range(n).map(function() {
  		var x = Math.random() * w, y = Math.random() * h;
  		var active = true;
  		var radius = 50;
  		return {
    		vx: Math.random() * 2 - 1,
    		vy: Math.random() * 2 - 1,
    		path: d3.range(m).map(function() { return [x, y]; }),
    		count: 0
  		};
	});

	var svg = d3.select("#canvasArea").append("svg:svg")
    	.attr("width", vid_width)
    	.attr("height", vid_height);

	var image = svg.append("image")
    	.attr("xlink:href", "http://171.65.102.132:8080/?action=snapshot?t=" + new Date().getTime())
    	.attr("width", vid_width)
    	.attr("height", vid_height);
    		
	var g = svg.selectAll("g")
    	.data(objects)
		.enter().append("svg:g");

	var box = g.append("svg:rect")
    	.attr("width", l)
    	.attr("height", l);
	
	function getVideo(){
		var frameURL = "http://171.65.102.132:8080/?action=snapshot?t=" + new Date().getTime();
		//var svg = d3.select('svg');
		image.attr('onload', function() {
         		compareFrame(image);
    		})
    		.attr("xlink:href", frameURL)
    		.attr("width", vid_width)
    		.attr("height", vid_height);		
	}
	
	function drawObjects(){
		for (var i = -1; ++i < n;) {
    		var object = objects[i],
        		path = object.path,
        		dx = object.vx,
        		dy = object.vy,
        		x = path[0][0] += dx,
        		y = path[0][1] += dy,
        		speed = Math.sqrt(dx * dx + dy * dy),
        		count = speed * 10,
        		k1 = -5 - speed / 3;

    		// Bounce off the walls.
    		if (x < 0 || x > w) object.vx *= -1;
    		if (y < 0 || y > h) object.vy *= -1;

    		// Swim!
    		for (var j = 0; ++j < m;) {
      			var vx = x - path[j][0],
          			vy = y - path[j][1],
          			k2 = Math.sin(((object.count += count) + j * 3) / 300) / speed;
      			path[j][0] = (x += dx / speed * k1) - dy * k2;
      			path[j][1] = (y += dy / speed * k1) + dx * k2;
      			speed = Math.sqrt((dx = vx) * dx + (dy = vy) * dy);
    		}
  		}

  		box.attr("transform", function(d) {
    		return "translate(" + d.path[0] + ")rotate(" + Math.atan2(d.vy, d.vx) * degrees + ")";
  		});
  	}

d3.timer(function() {
	getVideo();
	//console.log(hit);
  	drawObjects();
});

}










function game(){
	switch(gamephase)
	{
		case 'pre-game':
			// draw intro
		break;
		case 'game-rest':
    		vid_c.fillStyle = "#fff"; 
    		vid_c.font="14px sans-serif";
    		vid_c.fillText('New target ...',200,20);
    		vid_c.fillText('player : ' + username + '  score : ' +score_val ,20,20);
		break;
		case 'game-action':
    		vid_c.fillStyle = "#fff"; 
    		vid_c.font="14px sans-serif";
    		vid_c.fillText('Run! Run! Run!',200,20);
    		vid_c.fillText('player : ' + username + '  score : ' +score_val ,20,20);
		break;
		case 'gameover':		
    		vid_c.fillStyle = "#fff"; 
    		vid_c.font="14px sans-serif";
    		vid_c.textAlign="start"; 
    		vid_c.fillText('player : ' + username + '  score : ' +score_val ,20,20);
    		vid_c.fillStyle = "rgba(253,172,13,1)"; 
    		vid_c.font="40pt sans-serif";
    		vid_c.textAlign="center"; 
    		vid_c.fillText('GAME OVER',vid_width/2,vid_height/2-100);
    		vid_c.fillStyle = "#fff"; 
    		vid_c.font="20pt sans-serif";
    		vid_c.fillText(username+' scored '+score_val,vid_width/2,vid_height/2);
		break;
		default:
			vid_c.fillStyle = "#fff";
			vid_c.font="14px sans-serif";
    		vid_c.fillText('player : ' + username + '  score : ' +score_val ,20,20);
	}
}

var shipX=vid_width/2,
	shipY=vid_height/2,
	shipRad,
	shipL=20,
	starX=40,
	starY=20;
var gamelevel;
var int_star=-1;
var int_engine=-1;
var engine = false;
var rest = false;
var starTimer;
var enginerTimer;
var gamephase;
var score_val = 0;
var actionTimer;
var hit = new Array();
var unit=30;

function setGameAction(){
	actionTimer = window.requestAnimationFrame(actionLoop);
}

function setbackPreGame(){
    score_val = 0;
    hit = new Array();
    gamelevel=1;
    
	shipX = vid_width/2;
    shipY = vid_height/2;
    
    gamephase='pre-game';
}

function setGameOver(){
  	window.cancelAnimationFrame(actionTimer);
    actionTimer = undefined;
}


function actionLoop(){
	switch(gamephase)
	{
		case 'rest':
  			if(rest==false)
			{
				rest=true;
				int_star=gamelevel+6;
				getStarLocation(); // get new starX, starY, shipRad
				starTimer=window.setInterval(showStar,500);
			}
			drawStar(shipX,shipY,starX,starY,gamelevel-(int_star-6));
			drawShip(shipX,shipY,shipRad);
			actionTimer = window.requestAnimationFrame(gameLoop);
  		break;
		case 'engine':
			console.log(hit);
  			if(hit>0)
			{
				window.clearInterval(engineTimer);
				engine=false;
				rest=false;
				int_star=-1;
				int_engine=-1;
				gamephase='gameover';
				gamelevel=-1;
			}
			else
			{
				score_val=score_val+10;
				if(engine==false)
				{
					engine=true;
					int_engine=gamelevel+4;
					engineTimer=window.setInterval(runEngine,500);
				}
			}
			drawStar(shipX,shipY,starX,starY,gamelevel-(int_star-6));
			drawShip(shipX,shipY,shipRad);
			
  		break;
	}
}

function getStarLocation(){
	shipRad=Math.random()*Math.PI*2;
	starX=shipX+unit*(Math.cos(shipRad))*gamelevel;
	starY=shipY+unit*(Math.sin(shipRad))*gamelevel;
}

function getShipLocation(){
	var step = gamelevel-(int_engine-4);
	var u = (step > gamelevel - 1) ? 0 : 1;
	shipX=shipX+unit*(Math.cos(shipRad))*u;
	shipY=shipY+unit*(Math.sin(shipRad))*u;
}

function showStar(){
	if(int_star>0)
	{
		int_star=int_star-1;
	}
	else
	{
		window.clearInterval(starTimer);
		rest=false;
		gamephase='engine';
	}
}
	
function runEngine(){
	if(int_engine>0)
	{
		getShipLocation();
		int_engine=int_engine-1;
	}
	else
	{
		window.clearInterval(engineTimer);
		engine=false;
		gamephase='rest';
		if(gamelevel<10)
		{
			gamelevel=gamelevel+1;
		}
	}
}

function gameOver(){
    var msg = {type:'sendscore', user:username, score:score_val};
    socket.json.send(msg);
}




/*******************************************************************************
  Copyright (C) 2009 Tom Stoeveken
  This program is free software;
  you can redistribute it and/or modify it under the terms of the
  GNU General Public License, version 2.
  See the file COPYING for details.
*******************************************************************************/

var img1 = null;
var img2 = null;
var md_canvas = null;

function setupMotionDetection() {
  md_canvas = document.getElementById('mdCanvas');
  test_canvas = document.getElementById('testCanvas');
  md_canvas.width = vid_width;
  md_canvas.height = vid_height;
}

/*
  compare two images and count the differences

  input.: image1 and image2 are Image() objects
  input.: threshold specifies by how much the color value of a pixel
          must differ before they are regarded to be different

  return: number of different pixels
*/

function compare(image1, image2, ptX, ptY, threshold, ObjR) {
  var movement = new Array(0,0,0,0);
  var md_ctx = md_canvas.getContext("2d");
  var width = md_canvas.width/2, height = md_canvas.height/2;

  // copy images into canvas element
  // these steps scale the images and decodes the image data
  md_ctx.drawImage(image1, 0, 0, width, height);
  md_ctx.drawImage(image2, width, 0, width, height);

  // this makes r,g,b,alpha data of images available
  var pixels1 = md_ctx.getImageData(0, 0, width, height);
  var pixels2 = md_ctx.getImageData(width, 0, width, height);
  
  // substract picture1 from picture2
  // if they differ set color value to max,
  // if the difference is below threshold set difference to 0.
  for (var x = Math.round((ptX-ObjR)/2); x < Math.round((ptX+ObjR)/2); x++) {
    for (var y = Math.round((ptY-ObjR)/2); y < Math.round((ptY+ObjR)/2); y++) {

      // each pixel has a red, green, blue and alpha value
      // all values are stored in a linear array
      var i = x*4 + y*4*pixels1.width;

      var ch0 = ((pixels1.data[i] - pixels2.data[i])>threshold)?255:0;
      var ch1 = ((pixels1.data[i] - pixels2.data[i])>threshold)?255:0;
      var ch2 = ((pixels1.data[i] - pixels2.data[i])>threshold)?255:0;

      // count differing pixels
      var n = (x<Math.round(ptX/2))?0:1;
      var m = (y<Math.round(ptY/2))?0:2;
      movement[n+m] += Math.min(1, ch0 + ch1 + ch2);
    }
  }
  return movement;
}


function compareFrame(img1,arrObject) {
  // just compare if there are two pictures
  if ( img2 != null ) {
    var res=[0,0,0,0];
    var ObjR=10;

    try {
    		for (var n=0; n<arrMotion.length; n++){
    			// arrObject [active, position_x, position_y, detection_radius]
    			res = compare(img1, img2, arrObject[n][1], arrObject[n][2], 10, arrObject[n][3]); 
    			    if ((res[0]>400)||(res[1]>400)||(res[2]>400)||(res[3]>400)){
            			res[0]=0;res[1]=0;res[2]=0;res[3]=0;
    				}
				hit[n]=res[0]+res[1]+res[2]+res[3];
    		}
    	}
    catch(e) {
    		// errors
    	}
	}
	img2 = img1;
}
