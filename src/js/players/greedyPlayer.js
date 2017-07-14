function GreedyPlayer(lookaheadMoves) {
  this.lookaheadMoves = Math.min(lookaheadMoves, 9);
  this.lookaheadMoves = Math.max(this.lookaheadMoves, 0);
  this.onMoveCallback = null;
}
GreedyPlayer.prototype.onMove = function(callback) {
  this.onMoveCallback = callback;
}
GreedyPlayer.prototype.performMove = function(game) {
  if (!this.onMoveCallback) {
    return;
  }

  var scoreLeft = evalMoves(game.snake, game.food, { x: -1, y: 0} , this.lookaheadMoves);
  var scoreTop = evalMoves(game.snake, game.food, { x: 0, y: -1 }, this.lookaheadMoves);
  var scoreRight = evalMoves(game.snake, game.food, { x: 1, y: 0 }, this.lookaheadMoves);
  var scoreBottom = evalMoves(game.snake, game.food, { x: 0, y: 1 }, this.lookaheadMoves);

  console.log(scoreLeft, scoreTop, scoreRight, scoreBottom);
  var max = Math.max(scoreLeft, scoreTop, scoreRight, scoreBottom);

  if (max === scoreLeft) this.onMoveCallback(-1, 0);
  else if (max === scoreTop) this.onMoveCallback(0, -1);
  else if (max === scoreRight) this.onMoveCallback(1, 0);
  else if (max === scoreBottom) this.onMoveCallback(0, 1);
}

function evalMoves(snake, food, dir, movesAheadLeft) {
  var newSnake = cloneSnake(snake);
  if (newSnake.dir(dir.x, dir.y) === false) {
    // cannot go backwards
    return -1000;
  }
  newSnake.update();
  var currentPositionEval = evalPosition(newSnake, food) * (movesAheadLeft + 1);

  
  if (movesAheadLeft > 0) {
    var scoreLeft = evalMoves(newSnake, food, { x: -1, y: 0} , movesAheadLeft - 1);
    var scoreTop = evalMoves(newSnake, food, { x: 0, y: -1 }, movesAheadLeft - 1);
    var scoreRight = evalMoves(newSnake, food, { x: 1, y: 0 }, movesAheadLeft - 1);
    var scoreBottom = evalMoves(newSnake, food, { x: 0, y: 1 }, movesAheadLeft - 1);
    return currentPositionEval + Math.max(scoreLeft, scoreLeft, scoreTop, scoreBottom);
  } else {
    // eval this move
    return currentPositionEval;
  }
}

function evalPosition(snake, food) {
  if (snake.isDead()) {
    return -10000;
  } else if (snake.didAte(food)) {
    return 100;
  } else {
    var dx = food.pos.x - snake.pos.x;
    var dy = food.pos.y - snake.pos.y;
    return 1 / Math.sqrt(dx * dx + dy * dy);
  }
}

function cloneSnake(snake) {
  var newSnake = new Snake(snake.gridRows, snake.gridCols);
  newSnake.pos = { x: snake.pos.x, y: snake.pos.y };
  newSnake.vel = { x: snake.vel.x, y: snake.vel.y };
  newSnake.tail = snake.tail.slice();
  newSnake.tailLen = snake.tailLen;
  newSnake.tailStartIndex = snake.tailStartIndex;
  return newSnake;
}
