function drawBricks() {
  for (i = 0; i < brickArray.length; i++) {                                     //Bricks
    if(brickArray[i]){
      colorRect(i*100, 0, BRICK_WIDTH, BRICK_HEIGHT, 'red');
      canvasContext.beginPath();
      canvasContext.lineWidth = "3";
      canvasContext.strokeStyle = "black";
      canvasContext.rect(i*100, 0, BRICK_WIDTH, BRICK_HEIGHT)
      canvasContext.stroke();
    }
  }
}

function drawScreen(message1, message2, message3) {
  canvasContext.fillStyle = 'white';
  canvasContext.fillText(message1, 350, 100);
  canvasContext.fillText(message2, 350, 120);
  canvasContext.fillText(message3, 350, 500);
}

function drawPowerUps() {
  for (var i = 0; i < powerUpArray.length; i++) {
    var powUp = powerUpArray[i];

    switch (powUp.whichPowerUp) {
      case 1:                                                                   //Ball
        colorCircle(powUp.xPos, powUp.yPos, 10, powUp.color);
        break;
      case 2:                                                                   //Extra Live
        canvasContext.fillStyle = powUp.color;
        canvasContext.fillText("+1", powUp.xPos, powUp.yPos);
        break;
      case 3:                                                                   //Bigger Panel
        colorRect(powUp.xPos, powUp.yPos, 10, 10, powUp.color);
        break;
      case 4:                                                                   //smaller Panel
        colorRect(powUp.xPos, powUp.yPos, 10, 10, powUp.color);
        break;
    }
  }
}

function drawExtraBalls() {
  for (i = 0; i < extraBalls.length; i++) {                                     //Bricks
    colorCircle(extraBalls[i].x, extraBalls[i].y, 5, ' blue');
  }
}

function colorRect(x, y, width, height, color) {
  canvasContext.fillStyle = color;
  canvasContext.fillRect(x, y, width, height);
}

function colorCircle(x, y, radius, color) {
  canvasContext.fillStyle = color;
  canvasContext.beginPath();
  canvasContext.arc(x, y, radius, 0, Math.PI * 2, true);
  canvasContext.fill();
}
