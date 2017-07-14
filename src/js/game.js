var GRID_ROWS = 20;
var GRID_COLS = 20;

function Game(canvas, ctx, player, options) {
  options = options || {};

  this.canvas = canvas;
  this.ctx = ctx;

  this.onGameOver = options.onGameOver || function() {/* noop */};
  this.onAteFood = options.onAteFood || function() {/* noop */};

  this.player = player;
  this.food = null;
  this.snake = null;
  this.gameOver = false;

  this.reset();
}

/**
 * Init snake, food and hoop up to player commands
 */
Game.prototype.reset = function() {
  var snake = new Snake(GRID_ROWS, GRID_COLS);

  // respond to player commands
  this.player.onMove(function(x, y) {
    snake.dir(x, y);
  });

  this.food = new Food(GRID_ROWS, GRID_COLS);
  this.snake = snake;
  this.gameOver = false;
}

/**
 * Single game frame:
 *   - update snake position
 *   - check if snake ate food
 *   - check if snake is dead
 *   - render to canvas if available
 * Frame rate is controller from the outside to make NN training faster
 */
Game.prototype.gameFrame = function() {
  if (this.gameOver) {
    // no more updates if game is over
    return;
  }

  var snake = this.snake;
  var food = this.food;

  snake.update();
  food.update();

  if (snake.didAte(food)) {
    snake.grow();
    food.reset();
    this.onAteFood.apply(this);
  }
  if (snake.isDead()) {
    this.gameOver = true;
    this.onGameOver.apply(this);
  }
  
  // render if canvas is available
  if (this.canvas && this.ctx) {
    var cellWidth = this.canvas.width / GRID_COLS;
    var cellHeight = this.canvas.height / GRID_ROWS;

    this.ctx.fillStyle = 'black';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    food.draw(this.ctx, cellWidth, cellHeight);
    snake.draw(this.ctx, cellWidth, cellHeight);
  }
}
