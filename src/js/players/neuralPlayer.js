function NeuralPlayer() {
  this.onMoveCallback = null;
}
NeuralPlayer.prototype.onMove = function(callback) {
  this.onMoveCallback = callback;
}
NeuralPlayer.prototype.performMove = function(output, game) {
  if (!this.onMoveCallback) {
    return;
  }

  var max = Math.max.apply(null, output);

  if (max === output[0]) {
    this.left(game.snake.vel);
  } else if (max === output[1]) {
    // no change in direction
  } else if (max === output[2]) {
    this.right(game.snake.vel);
  }
}

NeuralPlayer.prototype.left = function(vel) {
  if (vel.x === 1) this.onMoveCallback(0, -1);
  else if (vel.x === -1) this.onMoveCallback(0, 1);
  else if (vel.y === 1) this.onMoveCallback(1, 0);
  else this.onMoveCallback(-1, 0);
}
NeuralPlayer.prototype.right = function(vel) {
  if (vel.x === 1) this.onMoveCallback(0, 1);
  else if (vel.x === -1) this.onMoveCallback(0, -1);
  else if (vel.y === 1) this.onMoveCallback(-1, 0);
  else this.onMoveCallback(1, 0);
}
