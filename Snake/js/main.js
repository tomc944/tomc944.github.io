var SnakeView = require('./snake-view.js');

window.$l(function() {
  var rootEl = window.$l('.snake');
  new SnakeView(rootEl);
});
