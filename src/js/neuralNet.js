function NeuralNet(weights) {
  this.weights = weights || NeuralNet.randomWeights();
}

NeuralNet.neuronsInLayers = [5, 5, 5, 3];
NeuralNet.randomWeights = function() {
  var weights = [];
  for (var i = 0; i < NeuralNet.neuronsInLayers.length; i++) {
    var neuronsInPrevLayer = NeuralNet.neuronsInLayers[i - 1] || 1;
    for (var j = 0; j < neuronsInPrevLayer * NeuralNet.neuronsInLayers[i]; j++) {
      weights.push(Math.random() * 100 - 50);
    }
  }
  return weights;
}

NeuralNet.prototype.calculateOutput = function(input) {
  var neuronOutputs = [];
  var weightIndex = 0;

  // first layer
  neuronOutputs.push([]);
  for (var i = 0; i < input.length; i++, weightIndex++) {
    var output = this.activationFn(input[i] * this.weights[weightIndex]);
    neuronOutputs[0].push(output);
  }

  // other layers
  for (var i = 1; i < NeuralNet.neuronsInLayers.length; i++) {
    neuronOutputs.push([]);
    for (var j = 0; j < NeuralNet.neuronsInLayers[i]; j++) {
      var output = 0;
      for (var k = 0; k < neuronOutputs[i - 1].length; k++, weightIndex++) {
        output += this.weights[weightIndex] * neuronOutputs[i - 1][k];
      }
      output = this.activationFn(output);
      neuronOutputs[i].push(output);
    }
  }

  // values of output neurons
  return neuronOutputs[neuronOutputs.length - 1];
}

NeuralNet.prototype.activationFn = function(x) {
  // sigmoid function
  return 1 / (1 + Math.exp(-x));
}

NeuralNet.getInputVector = function(game) {
  var dx = game.food.pos.x - game.snake.pos.x;
  var dy = game.food.pos.y - game.snake.pos.y;
  var foodDistance
  var foodAngle = getAngle(game.snake.pos, game.snake.vel, game.food.pos);

  var res = [
    1, // bias
    foodAngle,
    1, // is left empty
    1, // is front empty
    1, // is right empty
  ];

  var left = game.snake.getLeftPoint();
  var front = game.snake.getFrontPoint();
  var right = game.snake.getRightPoint();

  var tailOffset = 2;
  for (var i = 0, index = game.snake.tailStartIndex; i < game.snake.tailLen; i++, index--) {
    if (index < 0) {
      index = MAX_TAIL - 1;
    }
    var tail = game.snake.tail[index];
    if (tail.x === left.x && tail.y === left.y) {
      res[tailOffset + 0] = 0;
    }
    if (tail.x === front.x && tail.y === front.y) {
      res[tailOffset + 1] = 0;
    }
    if (tail.x === right.x && tail.y === right.y) {
      res[tailOffset + 2] = 0;
    }
  }

  return res;
}

function getAngle(snakeHead, snakeVel, point) {
  // return angle between the food and snakes current directon
  var foodVector = { x: point.x - snakeHead.x, y: snakeHead.y - point.y};
  return Math.atan2(foodVector.y, foodVector.x) - Math.atan2(-snakeVel.y, snakeVel.x);
}
