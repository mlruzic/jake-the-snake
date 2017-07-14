function Food(gridRows, gridCols) {
  this.gridRows = gridRows;
  this.gridCols = gridCols;

  this.pos = null;
  this.alpha = 0;
  this.deltaAlpha = 0;

  this.reset();
}

Food.prototype.reset = function() {
  this.pos = {
    x: Math.random() * this.gridCols | 0,
    y: Math.random() * this.gridRows | 0,
  };
  this.alpha = 1;
  this.deltaAlpha = -0.1;
}

Food.prototype.draw = function(ctx, cellWidth, cellHeight) {
  ctx.fillStyle = 'rgba(0, 200, 0, ' + this.alpha + ')';
  ctx.fillRect(this.pos.x * cellWidth, this.pos.y * cellHeight, cellWidth, cellHeight);
}

Food.prototype.update = function() {
  // update food trancparency on each frame 
  this.alpha += this.deltaAlpha;
  if (this.alpha < 0.5 || this.alpha >= 1) {
    this.deltaAlpha *= -1;
  }
};
