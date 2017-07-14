function HumanPlayer() {
  this.onMoveCallback = null;
  var self = this;

  document.addEventListener('keydown', function(e) {
    if (!self.onMoveCallback) {
      return;
    }

    switch(e.keyCode) {
      case 65:
        self.onMoveCallback(-1, 0);
        break;
      case 87:
        self.onMoveCallback(0, -1);
        break;
      case 68:
        self.onMoveCallback(1, 0);
        break;
      case 83:
        self.onMoveCallback(0, 1);
        break;
      default:
        return;
    }
  });
}
HumanPlayer.prototype.onMove = function(callback) {
  this.onMoveCallback = callback;
}
