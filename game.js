//Canvas----------------------------------------------------------------------
var canvas;
var canvasContext;
var fps;

//Object declarations --------------------------------------------------------
var ball = {
  x : 395,
  y : 295,
  speedX : 0,
  speedY : 10,
  reset : function() { 	if(player.lives==0) gameState.showGameOver=true;
                        ball.y = canvas.height/2;
                        ball.x = canvas.width/2;
                        ball.speedX = 0;
                        if(ball.speedY < 0) ball.speedY *=-1;
                      }
};

var player = {
  score : 0,
  lives : 3,
  paddle : {x : 295, width : 100}
};


var gameState = {
  showGameOver : false,
  levelDone : false,
  level :1,
  highScore : 0,
  gameOver : function () {
                          if(player.score > gameState.highScore) gameState.highScore = player.score;
                          player.score = 0;
                          player.lives = 3;
                          gameState.level = 1;
                          gameState.showGameOver=false;
                          ball.speedY = 10;
                          generateBrickArray();
                        },
  nextLevel : function () {
                            ball.reset();
                            gameState.levelDone=false;
                            ball.speedX = 0;
                            ball.speedY += 3;
                            generateBrickArray();

                          }
};

// PowerUp functions----------------------------------------------------------
var powerUpArray =[];

function checkAndGenPowerup(xPos){
  var x = Math.floor(Math.random() * 5); 																			//20% to get a powerup when a brick breaks
  if(x>0){
    var whichPowerUp = Math.floor((Math.random() * 4)+1);											//Generate which powerup
    var color;
    var whichPowerUp

    switch(whichPowerUp){
      case 1: 																																//Ball
         color = "red";
         break;
      case 2: 																																//Extra Live
        color = "white";
        break;
      case 3: 																																//Bigger PanelExtra Lives
        color = "green";
        break;
      case 4:																																	//Smaller Panel
        color = "red";
        break;
    }
    var pu = {	color: color,
                whichPowerUp: whichPowerUp,
                xPos: xPos,
                yPos: 20,
                activate: function(){
                  switch(whichPowerUp){
                    case 1:																										//extra ball

                      break;
                    case 2:																										//Extra live
                      player.lives++;
                      break;
                    case 3:
                      player.paddle.width=150;																//Bigger Panel
                      break;
                    case 4:																										//Smaller Panel
                      player.paddle.width=75;
                      break;
                  }
                }};
    powerUpArray.push(pu);

  }
}

//Bricks positioning & generation---------------------------------------------
const BRICK_HEIGHT = 20;
const BRICK_WIDTH = 100;
var brickArray = [[0,0],[100,0],[200,0],[300,0],[400,0],[500,0],[600,0],[700,0]];

function generateBrickArray(){
  if(gameState.level==1){
    brickArray = [[400,0]]; // [[0,0],[100,0],[200,0],[300,0],[400,0],[500,0],[600,0],[700,0]];
  } else {
    var brickArrayLength = Math.floor((Math.random() * 8)+1);
    for(var i=0; i < brickArrayLength;i++){
      var brickPosition = Math.floor(Math.random() * brickArrayLength)*100;

      if( brickArray.indexOf([brickPosition,0] == -1)){
        brickArray.push([brickPosition,0]);
      } else i--;
     }
  }
}

//Event listeners ------------------------------------------------------------
function calMousePos(evt){
  var rect = canvas.getBoundingClientRect();
  var root = document.documentElement;

  var mouseX = evt.clientX - rect.left - root.scrollLeft;
  var mouseY = evt.clientY - rect.top - root.scrollTop;

  return { x:mouseX, y:mouseY };
}

function handleMouseClick(evt){
  if(gameState.showGameOver){
    gameState.gameOver();
  } else if (gameState.levelDone){
    gameState.nextLevel();
  }
}

//Onload function ------------------------------------------------------------
window.onload = function(){
  canvas = document.getElementById('gameCanvas');
  canvasContext = canvas.getContext('2d');

  fps = 30;
  setInterval(function(){
          drawEverything();
          moveEverything();
        }, 1000/fps);

  canvas.addEventListener('mousemove',
              function(evt){
                var mousePos = calMousePos(evt);
                player.paddle.x = mousePos.x-50;
              })
  canvas.addEventListener('mousedown', handleMouseClick)
}

//Move function---------------------------------------------------------------
function moveEverything(){
  if(gameState.showGameOver || gameState.levelDone) return;										//Check if level is done or game is over

  ball.x += ball.speedX;
  ball.y += ball.speedY;

  if (ball.y > canvas.height) {																								// Paddle Reflect
    if(( ball.x > player.paddle.x) && (ball.x < player.paddle.x+player.paddle.width)){
      ball.speedY *= -1;

      var deltaX = ball.x - (player.paddle.x+player.paddle.width/2);
      ball.speedX = deltaX * 0.35;
    } else {
      player.lives--;
      ball.reset();
    }
  }

  if (ball.x < 0 || ball.x > canvas.width) ball.speedX *= -1;									// Left/Right reflect

  if(ball.y < 0) ball.speedY*=-1;																							// Top Reflect

  for(i = 0; i < brickArray.length; i++){																			//Check if a brick is hit
    if(ball.y <= brickArray[i][1]+BRICK_HEIGHT && ((ball.x > brickArray[i][0]) && (ball.x < brickArray[i][0]+BRICK_WIDTH))) {
      ball.speedY*=-1;
      checkAndGenPowerup(brickArray[i][0]+50);
      brickArray.splice(i,1);
      player.score+=100;
      if(brickArray.length == 0 ) {
        gameState.levelDone=true;
        gameState.level++;
      }
    }
  }

  for(i=0;i<powerUpArray.length; i++){																				// Check & Move powerUps
    var powUp = powerUpArray[i];
    powUp.yPos+=5;

    if (powUp.yPos > canvas.height-10) {																			// Paddle Reflect
      if(( powUp.xPos > player.paddle.x) && (powUp.xPos < player.paddle.x+player.paddle.width)){
        powUp.activate();
      }
      powerUpArray.splice(i,1)
    }
  }
}

//Draw functions -------------------------------------------------------------
function drawEverything(){
colorRect(0, 0, canvas.width, canvas.height, 'black');												//Background

  if(gameState.showGameOver) {
    drawScreen("Game Over", "Try again?", "Click to continue")
    return;
  }

  if(gameState.levelDone) {
    drawScreen("Level Complete", "Ready for level " +gameState.level +"?", "Click to continue")
    return;
  }

  colorRect(0, 0, canvas.width, canvas.height, 'black');											//Background
  colorRect(player.paddle.x, 590, player.paddle.width, 10, 'white');					//Paddle 1
  canvasContext.fillText(player.lives, 100, 100);															//Lives
  canvasContext.fillText(player.score, 700, 100);															//Score
  canvasContext.fillText(gameState.highScore, 400, 100);											//HighScore
  colorCircle(ball.x, ball.y, 5,' white'); 																		//Ball
  drawBricks();																																//Bricks
  drawPowerUps();																															//Power Ups
}

function drawBricks (){
  for(i=0; i < brickArray.length; i++){ 																			//Bricks
    var x= brickArray[i][0]
    var y= brickArray[i][1]
    colorRect(x, y, BRICK_WIDTH, BRICK_HEIGHT, 'red');
    canvasContext.beginPath();
    canvasContext.lineWidth="3";
    canvasContext.strokeStyle="black";
    canvasContext.rect(x, y, BRICK_WIDTH, BRICK_HEIGHT)
    canvasContext.stroke();
  }
}

function drawScreen(message1, message2, message3){
    canvasContext.fillStyle = 'white';
    canvasContext.fillText(message1, 350 ,100);
    canvasContext.fillText(message2, 350 ,120);
    canvasContext.fillText(message3, 350 ,500);
}

function drawPowerUps(){
  for(var i =0; i< powerUpArray.length; i++){
      var powUp = powerUpArray[i];

      switch(powUp.whichPowerUp){
        case 1:		//Ball
          colorCircle(powUp.xPos,powUp.yPos, 10, powUp.color);
          break;
        case 2:		//Extra Live
          canvasContext.fillStyle = powUp.color;
          canvasContext.fillText("+1", powUp.xPos ,powUp.yPos);
          break;
        case 3:		//Bigger Panel
          colorRect(powUp.xPos, powUp.yPos, 10, 10, powUp.color);
          break;
        case 4:		//smaller Panel
          colorRect(powUp.xPos, powUp.yPos, 10, 10, powUp.color);
          break;
      }
  }
}

function colorRect(x, y, width, height, color){
  canvasContext.fillStyle = color;
  canvasContext.fillRect(x, y, width, height);
}

function colorCircle(x, y, radius, color){
  canvasContext.fillStyle = color;
  canvasContext.beginPath();
  canvasContext.arc(x, y, radius, 0, Math.PI*2, true);
  canvasContext.fill();
}
