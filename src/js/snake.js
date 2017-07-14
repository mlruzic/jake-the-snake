var MAX_TAIL = 100;

function Snake(gridRows, gridCols) {
  this.gridRows = gridRows;
  this.gridCols = gridCols;

  this.pos = null;
  this.vel = null;
  this.tail = null;
  this.tailLen = null;
  this.tailStart = null;

  this.reset();
}

Snake.prototype.reset = function() {
  this.pos = {
    x: this.gridCols / 2 | 0,
    y: this.gridRows / 2 | 0,
  };
  var direction = Math.round(Math.random());
  this.vel = {
    x: direction,
    y: 1 - direction,
  };

  this.tail = [];
  this.tailLen = 0;
  this.tailStartIndex = -1;
}

Snake.prototype.update = function() {
  this.tailStartIndex = (this.tailStartIndex + 1) % MAX_TAIL;
  this.tail[this.tailStartIndex] = { x: this.pos.x, y: this.pos.y };

  this.pos.x += this.vel.x;
  this.pos.y += this.vel.y;

  // allow passing through the walls
  if (this.pos.x < 0) {
    this.pos.x = this.gridCols - 1;
  } else if (this.pos.x >= this.gridCols) {
    this.pos.x = 0;
  } 
  if (this.pos.y < 0) {
    this.pos.y = this.gridRows - 1;
  } else if (this.pos.y >= this.gridRows) {
    this.pos.y = 0;
  }
};

Snake.prototype.isDead = function() {
  for (var i = 0, index = this.tailStartIndex; i < this.tailLen; i++, index--) {
    if (index < 0) {
      index = MAX_TAIL - 1;
    }
    if (this.pos.x === this.tail[index].x && this.pos.y === this.tail[index].y) {
      // we hit the tail
      return true;
    }
  }
  return false;
}

Snake.prototype.draw = function(ctx, cellWidth, cellHeight) {
  ctx.fillStyle = 'white';
  ctx.fillRect(this.pos.x * cellWidth, this.pos.y * cellHeight, cellWidth, cellHeight);

  // draw tail
  for (var i = 0, index = this.tailStartIndex; i < this.tailLen; i++, index--) {
    if (index < 0) {
      index = MAX_TAIL - 1;
    }

    var tailPos = this.tail[index];
    // fade out effect on snakes tail. Scale alpha from 1 to 0.5
    var alpha = -i / ( 2 * this.tailLen ) + 1;
    ctx.fillStyle = 'rgba(200, 200, 200, ' + alpha + ')';
    ctx.fillRect(tailPos.x * cellWidth, tailPos.y * cellHeight, cellWidth, cellHeight);
  }
}

Snake.prototype.dir = function(x, y) {
  if (this.tailStartIndex >= 0 && this.pos.x + x === this.tail[this.tailStartIndex].x && this.pos.y + y === this.tail[this.tailStartIndex].y) {
    // cannot go backwards
    return false;
  }

  this.vel.x = x;
  this.vel.y = y;

  return true;
}

Snake.prototype.didAte = function(food) {
  return this.pos.x === food.pos.x && this.pos.y === food.pos.y;
}

Snake.prototype.grow = function() {
  this.tailLen++;
}

Snake.prototype.getLeftPoint = function() {
  // return point to the left of the snake head in respect to its current direction
  return {
    x: this.pos.x + this.vel.y,
    y: this.pos.y - this.vel.x,
  };
}
Snake.prototype.getFrontPoint = function() {
  // return point in front of the snake head in respect to its current direction
  return {
    x: this.pos.x + this.vel.x,
    y: this.pos.y + this.vel.y,
  };
}
Snake.prototype.getRightPoint = function() {
  // return point to the right of the snake head in respect to its current direction
  return {
    x: this.pos.x - this.vel.y,
    y: this.pos.y + this.vel.x,
  };
}
