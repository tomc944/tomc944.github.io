var KEYS1 = ['w', 's', 'a', 'd'];
var DIFF = [[-1,  0],
            [ 1,  0],
            [ 0, -1],
            [ 0,  1]];

function Snake(boardSize, direction) {
  this.direction = direction; // set default direction "right"
  this.segments = [];   // stores the snake
  this.boardSize = boardSize;
  this.createSnake(8);
  this.isGrowing = false;
}

Snake.prototype.createSnake = function(length) {
  var row = Math.floor(this.boardSize / 2);
  var colStart = Math.floor(this.boardSize / 4);
  
  for (var i = 0; i < length; i++) {
    this.segments.unshift([row, colStart + i]);
  }
};

Snake.prototype.move = function(keys) {
  var currentHead = this.segments[0];
  var diff = DIFF[keys.indexOf(this.direction)];
  var newHead = [currentHead[0] + diff[0], currentHead[1] + diff[1]];
  this.segments.unshift(newHead);
  if (!this.isGrowing){
    this.segments.pop();
  }
  this.isGrowing = false;
};

Snake.prototype.turn = function(newDir, keys) {
  if (this.isValidDirection(newDir, keys)) {
    this.direction = newDir;
  }
};

Snake.prototype.isValidDirection = function(newDir, keys) {
  if (keys.indexOf(newDir) === -1) {
    return false;
  } else if (this.isOppositeDirection(newDir, keys)) {
    return true;
  } else {
    return false;
  }
};

Snake.prototype.isOppositeDirection = function(newDir, keys) {
  var currentDiff = DIFF[keys.indexOf(this.direction)];
  var newDiff = DIFF[keys.indexOf(newDir)];
  if (currentDiff[0] + newDiff[0] === 0){
    return false;
  } else {
    return true;
  }
};


function Board(boardSize) {
  this.snake = new Snake(boardSize, 'd');     // hold a snake
  this.applePos = null;             // stores an apple on the board
  this.numMoves = 0;
  this.boardSize = boardSize;
  this.gameOver = false;
  this.randomApple();
  this.playing = false;
}

Board.prototype.moveSnake = function() {
  this.snake.move(KEYS1);
  this.numMoves += 1;

  if (this.isGameOver()) {
    this.gameOver = true;
  } else if (this.isEatingApple(this.snake.segments)){
    this.snake.isGrowing = true;
    this.randomApple();
  }
};

Board.prototype.turnSnake = function (key) {
  if (KEYS1.indexOf(key) !== -1) {
    this.snake.turn(key, KEYS1);
  }
};

Board.prototype.isGameOver = function() {
  this.snakeHead = this.snake.segments[0];

  if (this.checkAllCollisions()) {
    return true;
  } else {
    return false;
  }
};

Board.prototype.checkAllCollisions = function() {
  return (this.hitsSelf() ||
    this.isHeadHittingWall(this.snakeHead))
}

Board.prototype.hitsSelf = function() {
  var snakeBody = this.snake.segments.slice(1)

  for (i=0; i<snakeBody.length; i++) {
    if (_.isEqual(snakeBody[i], this.snakeHead)) {
      return true
    }
  }
  return false
}

Board.prototype.isHeadHittingWall = function(snakeHead) {
  if (snakeHead[0] < 0 || snakeHead[1] < 0
    || snakeHead[0] >= this.boardSize
    || snakeHead[1] >= this.boardSize) {
    return true;
  } else {
    return false;
  }
};

Board.prototype.isEatingApple = function(snake) {
  var snakeHead = snake[0];
  if (this.applePos[0] === snakeHead[0] && this.applePos[1] === snakeHead[1]) {
    return true;
  } else {
    return false;
  }
};

Board.prototype.randomApple = function() {
  do {
    var pos = this.randomPos();
  } while (this.snake.segments.indexOf(pos) !== -1);
  this.applePos = pos;
};

Board.prototype.randomPos = function() {
  var x = Math.floor(Math.random() * this.boardSize);
  var y = Math.floor(Math.random() * this.boardSize);
  return [x, y];
};

module.exports = Board;
