var Board = require('./snake.js');

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
    document.addEventListener('keydown', this.handleKeyEvent.bind(this));

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
