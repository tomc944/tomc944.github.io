var Breakout = function() {};
Breakout.Play = function() {};

Breakout.Play.prototype = {

  preload: function() {
    this.loadImages();
    this.loadAudio();
  },

  create: function() {
    this.setPhysics();
    this.setScale();
    this.setInitialVariables();
    this.startSound();
    this.createPaddle();
    this.createStartButtons();
    this.addBannerText();
  },

  update: function() {
    if(this.playing) {
      this.physics.arcade.collide(this.ball, this.bricks,
                                  this.ballHitBrick.bind(this));
      this.physics.arcade.collide(this.ball, this.paddle,
                                  this.ballHitPaddle.bind(this));

      this.paddle.x = this.input.x || this.gameWidth;
      this.ball.angle += 2;
    }
  },

  loadImages: function() {
    this.load.image('ball', 'assets/img/ball.png')
    this.load.image('wrench', 'assets/img/wrench.png');
    this.load.image('reset', 'assets/img/reset.png');
    this.load.image('paddle', 'assets/img/paddle.png');
    this.load.image('normalButton', 'assets/img/normal.png');
    this.load.image('goofyButton', 'assets/img/goofy.png')
    this.load.image('justinlong', 'assets/img/justinlong.png');
    this.load.image('brick', 'assets/img/brick.png')
  },

  loadAudio: function() {
    this.load.audio('gameover', 'assets/sound/gameover.wav');
    this.load.audio('score', 'assets/sound/score.wav');
    this.load.audio('blip', 'assets/sound/blip.wav');
    this.load.audio('oof', 'assets/sound/oof.wav');
    this.load.audio('victory', 'assets/sound/victory.mp3');
  },

  setInitialVariables: function() {
    this.score = 0;
    this.hits = 0;
    this.lives = 3;
    this.playing = false;
    this.goofyMode = false;
    this.textStyle = {font: '18px Ubuntu', fill: '#0095DD'};
  },

  setPhysics: function() {
    this.physics.startSystem(Phaser.Physics.ARCADE);
    this.physics.arcade.checkCollision.down = false;
  },

  setScale: function() {
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;
    this.scale.maxHeight = this.game.height;
    this.scale.maxWidth = this.game.width;
    this.stage.backgroundColor = "#eee";
    this.gameHeight = this.world.height*0.5;
    this.gameWidth = this.world.width*0.5;
  },

  createStartButtons: function() {
    this.normalButton = this.add.button(this.gameWidth, this.gameHeight + 20  ,
                                  'normalButton', this.startGame, this);
    this.normalButton.anchor.set(0.5);

    this.goofyButton = this.add.button(this.gameWidth, this.gameHeight - 30,
                                  'goofyButton', this.startGoofyGame, this)

    this.goofyButton.anchor.set(0.5);
  },

  startGame: function() {
    this.normalButton.destroy();
    this.goofyButton.destroy();
    this.createBall();
    this.initBricks();
    this.playing = true;
  },

  startGoofyGame: function() {
    this.normalButton.destroy();
    this.goofyButton.destroy();
    this.goofyMode = true;
    this.createBall();
    this.initBricks();
    this.playing = true;
  },

  resetGame: function() {
    location.reload();
  },

  createBall: function() {
    if (this.goofyMode) {
      this.ball = this.add.sprite(this.gameWidth, this.world.height-25, 'wrench');
    } else {
      this.ball = this.add.sprite(this.gameWidth, this.world.height-25, 'ball');
    }

    this.ball.anchor.set(0.5);
    this.physics.enable(this.ball, Phaser.Physics.ARCADE);
    this.ball.body.collideWorldBounds = true;
    this.ball.body.bounce.set(1);

    this.ball.checkWorldBounds = true;
    this.ball.events.onOutOfBounds.add(this.ballLeaveScreen, this);

    this.ball.body.velocity.set(150, -150)
  },

  createPaddle: function() {
    this.paddle = this.add.sprite(this.gameWidth, this.world.height-5, 'paddle');
    this.paddle.anchor.set(0.5, 1);
    this.physics.enable(this.paddle, Phaser.Physics.ARCADE);
    this.paddle.body.immovable = true;
  },

  startSound: function() {
    this.scoreSound = this.add.audio('score');
    this.scoreSound.loop = true;
    this.scoreSound.volume = 0.1;
    this.scoreSound.play();

    this.blipSound = this.add.audio('blip');
    this.gameoverSound = this.add.audio('gameover');
    this.oofSound = this.add.audio('oof');
    this.victorySound = this.add.audio('victory');
  },

  addBannerText: function() {
    this.livesText = this.add.text(this.world.width-5, 5, 'Lives: '+ this.lives,
                              this.textStyle);
    this.livesText.anchor.set(1,0);
    this.lifeLostText = this.add.text(this.gameWidth, this.gameHeight + 20,
                                'Life lost, click to continue', this.textStyle);
    this.lifeLostText.anchor.set(0.5);
    this.lifeLostText.visible = false;

    this.scoreText = game.add.text(5, 5, 'Points: 0', this.textStyle);
  },

  ballLeaveScreen: function() {
    this.lives--;
    if(this.lives){
      this.livesText.setText("Lives: "+ this.lives);
      this.lifeLostText.visible = true;
      this.ball.reset(this.gameWidth, this.world.height-25);
      this.paddle.reset(this.gameWidth, this.world.height-5);
      this.gameoverSound.play();
      this.input.onDown.addOnce(function() {
        this.lifeLostText.visible = false;
        this.ball.body.velocity.set(150, -150);
      }, this);
    } else {
      this.livesText.setText("Lives: "+ this.lives);
      this.gameover();
    }
  },

  gameover: function() {
    this.scoreSound.loop = false;
    this.scoreSound.stop();

    this.ball.kill();

    this.gameoverSound.play();

    this.gameoverText = this.add.text(this.gameWidth, this.gameHeight + 80,
                                'You lost, game over!', this.textStyle)
    this.gameoverText.anchor.set(0.5);
    this.gameoverText.visible = true;

    this.resetButton = this.add.button(this.gameWidth, this.gameHeight + 30,
                                  'reset', this.resetGame, this);
    this.resetButton.anchor.set(0.5);
  },



  ballHitBrick: function(ball, brick) {
    this.brickKill(brick);

    if (this.goofyMode) {
      this.oofSound.play();
    } else {
      this.blipSound.play();
    }

    this.score += 10;
    this.scoreText.setText('Points: '+ this.score);
    this.checkWin();
  },

  brickKill: function(brick) {
    var killTween = this.add.tween(brick.scale);
    killTween.to({x:0,y:0}, 200, Phaser.Easing.Linear.None);
    killTween.onComplete.addOnce(function() {
      brick.kill();
      this.checkWin();
    }, this);
    killTween.start();
  },

  ballHitPaddle: function(ball, paddle) {
    this.hits += 1;
    this.blipSound.play();
    this.ball.body.velocity.x = -1*5*(this.paddle.x-this.ball.x);

    if (this.hits >= 10 && this.paddle.width >= 20) {
      this.paddle.scale.x -= 0.07;
    }

  },

  checkWin: function() {
    if(this.bricks.total === 0) {
      this.winText = this.add.text(this.gameWidth, this.gameHeight + 50,
                                  'You won, play again?!', this.textStyle)
      this.winText.anchor.set(0.5);
      this.winText.visible = true;

      this.resetButton = this.add.button(this.gameWidth, this.gameHeight - 20,
                                        'reset', this.resetGame, this);
      this.resetButton.anchor.set(0.5);

      this.ball.kill();

      this.scoreSound.loop = false;
      this.scoreSound.stop();

      this.victorySound.play();

    }
  },

  initBricks: function() {
    this.brickInfo = {
      width: 50,
      height: 20,
      count: {
        row: 7,
        col: 3
      },
      offset: {
        top: 50,
        left: 60
      },
      padding: {
        width: 10,
        height: 20
      }
    }

    this.bricks = game.add.group();
    for(c=0; c<this.brickInfo.count.col; c++) {
      for (r=0; r<this.brickInfo.count.row; r++) {
        this.setIndividualBrick();
      }
    }
  },

  setIndividualBrick: function() {
    var brickX = (r*(this.brickInfo.width+this.brickInfo.padding.width))
                  + this.brickInfo.offset.left;
    var brickY = (c*(this.brickInfo.height+this.brickInfo.padding.height))
                  + this.brickInfo.offset.top;

    if (this.goofyMode) {
      this.newBrick = this.add.sprite(brickX, brickY, 'justinlong');
      this.newBrick.scale.setTo(.027, .027);
    } else {
      this.newBrick = this.add.sprite(brickX, brickY, 'brick')
    }

    this.physics.enable(this.newBrick, Phaser.Physics.ARCADE);
    this.newBrick.body.immovable = true;
    this.newBrick.anchor.set(0.5);
    this.bricks.add(this.newBrick);
  }
}

var game = new Phaser.Game(480, 320, Phaser.CANVAS, '');
game.state.add('Play', Breakout.Play);
game.state.start('Play');
