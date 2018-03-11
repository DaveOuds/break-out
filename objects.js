//Object declarations --------------------------------------------------------
var ballData = {
  create: function(x, y, speedX, speedY) {
    var self = Object.create(this);
    self.x = x;
    self.y = y;
    self.speedX = speedX;
    self.speedY = speedY;
    return self
  },
  reset: function() {
    if (player.lives == 0) {
      game.showGameOver = true;
      game.gameOver();
    }
    this.y = canvas.height / 2;
    this.x = canvas.width / 2;
    this.speedX = 0;
    if (this.speedY < 0) this.speedY *= -1;
    extraBalls = [];
    powerUpArray = [];
  }
};

var player1 = {
  create: function() {
    var self = Object.create(this);
    self.score = 0;
    self.lives = 3;
    self.paddle = {
      x: 295,
      width: 100
    };
    return self;
  },
  reset: function() {
    this.score = 0;
    this.lives = 3;
  }
};

var gameState = {
  create: function() {
    var self = Object.create(this);
    self.level = 1;
    self.levelDone = false;
    self.highScore = 0;
    self.showGameOver = false;
    return self;
  },
  gameOver: function() {
    if (player.score > this.highScore) this.highScore = player.score;
    player.reset();
    this.level = 1;
    ball.speedY = 10;
    generateBrickArray();
  },
  nextLevel: function() {
    ball.reset();
    ball.speedX = 0;
    ball.speedY += 3;
    this.level++;
    generateBrickArray();
  }
};

var powerUp = {
  create: function(whichPowerUp, xPos) {
    var self = Object.create(this);
    switch (whichPowerUp) {
      case 1: //Ball
        self.color = "red";
        break;
      case 2: //Extra Live
        self.color = "white";
        break;
      case 3: //Bigger PanelExtra Lives
        self.color = "green";
        break;
      case 4: //Smaller Panel
        self.color = "red";
        break;
    }
    self.whichPowerUp = whichPowerUp;
    self.xPos = xPos;
    self.yPos = 20;
    return self;
  },
  activate: function() {
    switch (this.whichPowerUp) {
      case 1:                                                                   //extra ball
        if (ball.speedY > 0) extraBalls.push(ballData.create(395, 295, 0, ball.speedY));
        else extraBalls.push(ballData.create(395, 295, 0, -ball.speedY));
        break;
      case 2:                                                                   //Extra live
        player.lives++;
        break;
      case 3:
        player.paddle.width = 150;                                              //Bigger Panel
        break;
      case 4:                                                                   //Smaller Panel
        player.paddle.width = 75;
        break;
    }
  }
};

var game = gameState.create();
var ball = ballData.create(395, 295, 0, 10);
var player = player1.create();
