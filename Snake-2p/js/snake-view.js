var Board = require('./snake.js');

var SIZE = 50;

function View(rootEl) {
  this.board = new Board(SIZE);
  this.$rootEl = rootEl;
  this.setupBoard();
  this.registerEvents();
  // this.currentScore = 0;
  // this.setScore();
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
  //
  // setScore: function() {
  //   var $score = window.$l('.score')
  //   $score.html("Score: " + this.currentScore);
  // },

  registerEvents: function() {
    document.addEventListener('keydown', this.handleKeyEvent.bind(this));
    document.addEventListener('click', this.handleMouseEvent.bind(this));
  },

  handleKeyEvent: function(e) {
    var code = e.keyCode;
    var direction = (String.fromCharCode(code)).toLowerCase();
    this.board.turnSnake(direction);
  },

  handleMouseEvent: function(e) {
    window.$l('.twop').remove();
    this.board.playing = true;
  },

  render: function() {
    window.$l('div').removeClass('snake-segment');
    window.$l('div').removeClass('snake-segment2');

    this.board.snake.segments.forEach(function(pos) {
      var row = pos[0];
      var col = pos[1];
      window.$l('.snake').
        find('.row-' + row + '-col-'+ col).addClass('snake-segment');
    });


    this.board.snake2.segments.forEach(function(pos) {
      var row = pos[0];
      var col = pos[1];
      window.$l('.snake').
        find('.row-' + row + '-col-'+ col).addClass('snake-segment2');
    });

    window.$l('div').removeClass('apple');
    var applePos = this.board.applePos;

    window.$l('.snake').
      find('.row-' + applePos[0]+ "-col-" + applePos[1]).addClass('apple');

    // if (this.appleCollision()) {
    //   this.currentScore += 10;
    //   this.setScore();
    // }

  },

  // appleCollision: function () {
  //   var snakeHead = this.board.snake.segments[0]
  //
  //   return (this.board.applePos[0] === snakeHead[0] &&
  //           this.board.applePos[1] === snakeHead[1])
  // },

  step: function() {
    if (this.board.playing === true) {
      this.board.moveSnake();
      this.render();
      if (this.board.gameOver) {
        window.clearInterval(this.intervalId);
        alert("Gameover!");
      }
    }
  },
});

module.exports = View;
