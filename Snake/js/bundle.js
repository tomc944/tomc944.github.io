/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/js/";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var SnakeView = __webpack_require__(1);

	window.$l(function() {
	  var rootEl = window.$l('.snake');
	  new SnakeView(rootEl);
	});


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var Board = __webpack_require__(2);

	var SIZE = 30;

	function View($rootEl, restart) {
	  this.board = new Board(SIZE);
	  this.$rootEl = $rootEl;
	  this.restart = restart || false;
	  this.setupBoard();
	  this.registerEvents();
	  this.intervalId = window.setInterval(this.step.bind(this), 50);
	}

	window.$l.extend(View.prototype, {
	  setupBoard: function() {
	    for (var i = 0; i < SIZE; i++) {
	      for (var j = 0; j < SIZE; j++) {
	        var $div = document.createElement('div');
	        $div = window.$l($div);
	        $div.addClass('row-' + i + '-col-'+j);
	        $div.addClass('board-piece');
	        this.$rootEl.append($div);
	      }
	    }
	  },

	  registerEvents: function() {
	    document.addEventListener('keydown', this.handleKeyEvent.bind(this));

	    if (!this.restart) {
	      var startButton = '<button class="start-button" type="button">Start Game!</button>'
	      window.$l('figure').append(startButton)
	      window.$l('.start-button').on('click', this.startGame.bind(this))
	    } else {
	      this.board.playing = true;
	    }
	  },

	  handleKeyEvent: function(e) {
	    var code = e.keyCode;
	    var direction = (String.fromCharCode(code)).toLowerCase();
	    this.board.turnSnake(direction);
	  },

	  startGame: function(e) {
	    window.$l('.start-button').remove();
	    this.board.playing = true;
	  },

	  render: function() {
	    window.$l('div').removeClass('snake-segment');

	    this.board.snake.segments.forEach(function(pos) {
	      var row = pos[0];
	      var col = pos[1];
	      window.$l('.snake').
	        find('.row-' + row + '-col-'+ col).addClass('snake-segment');
	    });

	    window.$l('div').removeClass('apple');
	    var applePos = this.board.applePos;

	    window.$l('.snake').
	      find('.row-' + applePos[0]+ "-col-" + applePos[1]).addClass('apple');
	  },

	  createReset: function() {
	    var resetButton = '<button class="reset-button" type="button">Gameover... Play again?</button>'
	    window.$l('figure').append(resetButton)
	    window.$l('.reset-button').on('click', this.restartGame.bind(this))
	    window.clearInterval(this.intervalId);
	  },

	  restartGame: function() {
	    // removes old board
	    var gameDivs = window.$l('.snake').children()
	    gameDivs.remove()
	    document.removeEventListener('keydown', this.handleKeyEvent.bind(this));

	    // creates new board
	    var rootEl = window.$l('.snake');
	    new View(rootEl, true);
	  },

	  step: function() {
	    if (this.board.playing === true) {
	      this.board.moveSnake();
	      this.render();
	      if (this.board.gameOver) {
	        this.createReset();
	      }
	    }
	  },
	});

	module.exports = View;


/***/ },
/* 2 */
/***/ function(module, exports) {

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


/***/ }
/******/ ]);