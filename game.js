//Canvas----------------------------------------------------------------------
var canvas;
var canvasContext;
var fps;
var extraBalls = [];
var startScreen = true;

//Onload function ------------------------------------------------------------
window.onload = function() {
  canvas = document.getElementById('gameCanvas');
  canvasContext = canvas.getContext('2d');

  canvas.addEventListener('mousemove',
    function(evt) {
      var mousePos = calMousePos(evt);
      player.paddle.x = mousePos.x - 50;
    });
  canvas.addEventListener('mousedown', handleMouseClick);

  generateBrickArray();

  fps = 30;
  setInterval(function() {
    drawEverything();
    moveEverything();
  }, 1000 / fps);
}
//Move function---------------------------------------------------------------

function moveEverything() {
  if (game.showGameOver || game.levelDone) return;                              //Check if level is done or game is over

  ball.x += ball.speedX;
  ball.y += ball.speedY;

  if (ball.y > canvas.height) {                                                 // Paddle Reflect
    if ((ball.x > player.paddle.x) && (ball.x < player.paddle.x + player.paddle.width)) {
      ball.speedY *= -1;

      var deltaX = ball.x - (player.paddle.x + player.paddle.width / 2);
      ball.speedX = deltaX * 0.35;
    } else {
      ball.reset();
      player.lives--;
    }
  }

  if (ball.x < 0 || ball.x > canvas.width) ball.speedX *= -1;                   // Left/Right reflect

  if (ball.y < 0) ball.speedY *= -1;                                            // Top Reflect

  for (i = 0; i < brickArray.length; i++) {                                     //Check if a brick is hit
    if(brickArray[i]){
      if (ball.y <= BRICK_HEIGHT && ((ball.x > i*100) && (ball.x < i*100 + BRICK_WIDTH))) {
        ball.speedY *= -1;
        checkAndGenPowerup(i*100 + 50);
        brickArray[i] =false;
        player.score += 100;
        if(brickArray.every(function (x){return !x;})){
          game.levelDone = true;
          game.nextLevel();
        }
      }
    }
  }

  for (i = 0; i < powerUpArray.length; i++) {                                   // Check & Move powerUps
    var powUp = powerUpArray[i];
    powUp.yPos += 5;

    if (powUp.yPos > canvas.height - 10) {                                      // Power up handling
      if ((powUp.xPos > player.paddle.x) && (powUp.xPos < player.paddle.x + player.paddle.width)) {
        powUp.activate();
      }
      powerUpArray.splice(i, 1)
    }
  }

  // Extra ball handling -----------------------------------------------------
  for (var i = 0; i < extraBalls.length; i++) {
    extraBalls[i].x += extraBalls[i].speedX;
    extraBalls[i].y += extraBalls[i].speedY;

    if (extraBalls[i].y > canvas.height) {                                      // Paddle Reflect
      if ((extraBalls[i].x > player.paddle.x) && (extraBalls[i].x < player.paddle.x + player.paddle.width)) {
        extraBalls[i].speedY *= -1;

        var deltaX = extraBalls[i].x - (player.paddle.x + player.paddle.width / 2);
        extraBalls[i].speedX = deltaX * 0.35;
      } else extraBalls.splice(i, 1);
    }

    if (extraBalls[i].x < 0 || extraBalls[i].x > canvas.width) extraBalls[i].speedX *= -1; // Left/Right reflect

    if (extraBalls[i].y < 0) extraBalls[i].speedY *= -1;                         // Top Reflect

    for (index = 0; index < brickArray.length; index++) {                       //Check if a brick is hit
      if (extraBalls[i].y <= BRICK_HEIGHT && ((extraBalls[i].x > i*100) && (extraBalls[i].x < i*100 + BRICK_WIDTH))) {
        extraBalls[i].speedY *= -1;
        checkAndGenPowerup(i*100 + 50);
        brickArray[i] =false;
        player.score += 100;
        if(brickArray.every(function (x){return !x;})){
          game.levelDone = true;
          game.nextLevel();
        }
      }
    }
  }
}

//Draw functions -------------------------------------------------------------
function drawEverything() {
  colorRect(0, 0, canvas.width, canvas.height, 'black');                        //Background

  if (game.showGameOver) {
    drawScreen("Game Over", "Try again?", "Click to continue")
    return;
  }

  if (game.levelDone) {
    drawScreen("Level Complete", "Ready for level " + game.level + "?", "Click to continue")
    return;
  }

  colorRect(0, 0, canvas.width, canvas.height, 'black');                        //Background
  colorRect(player.paddle.x, 590, player.paddle.width, 10, 'white');            //Paddle 1
  canvasContext.fillText(player.lives, 100, 100);                               //Lives
  canvasContext.fillText(player.score, 700, 100);                               //Score
  canvasContext.fillText(game.highScore, 400, 100);                             //HighScore
  colorCircle(ball.x, ball.y, 5, ' white');                                     //Ball
  drawBricks();                                                                 //Bricks
  drawPowerUps();                                                               //Power Ups
  drawExtraBalls();
}

// PowerUp functions----------------------------------------------------------
var powerUpArray = [];

function checkAndGenPowerup(xPos) {
  var chance = Math.floor(Math.random() * 5);                                   //20% to get a powerup when a brick breaks
  if (chance > 0) {
    var whichPowerUp = Math.floor((Math.random() * 4) + 1);                     //Generate which powerup
    var pu = powerUp.create(whichPowerUp, xPos);
    powerUpArray.push(pu);
  }
}

//Bricks positioning & generation---------------------------------------------
const BRICK_HEIGHT = 20;
const BRICK_WIDTH = 100;
var brickArray = [true,false,false,false,false,false,false];

function generateBrickArray() {
  if (game.level == 1) {
      brickArray = [true,false,false,false,false,false,false];
  } else {
    console.log("reached")
    brickArray = brickArray.map(brick => {
      var x =Math.random() >= 0.5;
      console.log(x)
      return x;
    });
  }
  console.log(brickArray);
}


//Event listeners ------------------------------------------------------------
function calMousePos(evt) {
  var rect = canvas.getBoundingClientRect();
  var root = document.documentElement;

  var mouseX = evt.clientX - rect.left - root.scrollLeft;
  var mouseY = evt.clientY - rect.top - root.scrollTop;

  return {
    x: mouseX,
    y: mouseY
  };
}

function handleMouseClick(evt) {
  if (game.showGameOver) {
    game.showGameOver = false;
  } else if (game.levelDone) {
    game.levelDone = false;
  } else if (startScreen){
    startScreen = false;
  }
}
