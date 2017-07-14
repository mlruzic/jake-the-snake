var POPULATION_SIZE = 500;
var MAX_GENERATIONS = 500000;
var MAX_SNAKE_HUNGER = 40;
var MUTATION_CHANCE = 0.1;

function Genetics(options) {
  options = options || {};
  this.onStart = options.onStart || function() {};
  this.onDone = options.onDone || function() {};
  this.onNextGeneration = options.onNextGeneration || function() {};
  this.onNewBestScore = options.onNewBestScore || function() {};
}

Genetics.prototype.start = function(populationSize, mutationChance) {
  this.onStart();

  this.canceled = false;
  this.bestScore = 0;

  this.populationSize = populationSize || POPULATION_SIZE;
  this.mutationChance = mutationChance || MUTATION_CHANCE;

  var population = [];
  for (var i = 0; i < populationSize; i++) {
    population.push(NeuralNet.randomWeights());
  }

  // start genetic algorighm
  this.selection(population, 1);
}

Genetics.prototype.stop = function() {
  this.canceled = true;
  this.onDone();
}

Genetics.prototype.selection = function(population, generation) {
  this.onNextGeneration(generation, this.bestScore);

  var promises = [];

  // evaluation
  for (var i = 0; i < population.length; i++) {
    var neuralNet = new NeuralNet(population[i]);
    var promise = this.evaluate(neuralNet, generation);
    promises.push(promise);
  }

  var self = this;
  Promise.all(promises).then(function(neuralNets) {
    var sortedNeuralNets = neuralNets.sort(function(a, b) {
      return b.score - a.score;
    });

    // notify ui if new best score is found
    if (sortedNeuralNets[0].score > self.bestScore) {
      self.bestScore = sortedNeuralNets[0].score;
      self.onNewBestScore(sortedNeuralNets[0].neuralNet, sortedNeuralNets[0].score);
    }

    // generate new population
    if (generation < MAX_GENERATIONS && !self.canceled) {
      var newPopulation = self.crossover(sortedNeuralNets, generation);
      self.selection(newPopulation, generation + 1);
    } else {
      // we're done
      self.onDone();
    }
  });
}

Genetics.prototype.crossover = function(neuralNets, generation) {
  var newPopulation = [];

  // take half of the best performing NNs to the next generation
  for (var i = 0; i < neuralNets.length / 2; i ++) {
    newPopulation.push(neuralNets[i].neuralNet.weights);
  }

  for (var i = 0; i < neuralNets.length; i += 2) {
    var a = neuralNets[i].neuralNet.weights;
    var b = neuralNets[Math.random() * neuralNets.length | 0].neuralNet.weights;
    var c = [];

    // generate new neural net by randomly taking weights from each parent
    for (var j = 0; j < a.length; j++) {
      c[j] = Math.random() <= 0.5 ? a[j] : b[j];
    }

    this.mutate(c, generation);
    newPopulation.push(c);
  } 

  return newPopulation;
}

Genetics.prototype.mutate = function(weights, generation) {
  // increase mutation chance with time
  var lateMutationChance = generation / (MAX_GENERATIONS * 1.3);

  for (var i = 0; i < 5; i += 2) {
    var chance = Math.random();
    if (chance < this.mutationChance || chance < lateMutationChance) {
      var index = Math.random() * weights.length | 0;
      weights[index] = Math.random() * 100 - 50;
    }
  }
}

Genetics.prototype.evaluate = function(neuralNet, generation) {
  var hunger = 0;
  var moves = 0;

  return new Promise(function(resolve) {
    setTimeout(function() {
      var player = new NeuralPlayer();
      var game = new Game(null, null, player, {
        onAteFood: function() {
          hunger = 0;
        },
      });

      // run simulation until snake dies (either by hitting its tail or starvation)
      while(hunger++ < MAX_SNAKE_HUNGER && !game.gameOver) {
        var inputParams = NeuralNet.getInputVector(game);
        var output = neuralNet.calculateOutput(inputParams);

        player.performMove(output, game);
        moves++;
        game.gameFrame();
      }

      var score = 0;
      if (hunger >= MAX_SNAKE_HUNGER) {
        score = game.snake.tailLen * 100 - moves * game.snake.tailLen;
      } else {
        score = moves / 2 + game.snake.tailLen * 100;
      }

      resolve({
        neuralNet: neuralNet,
        score: score,
      });      
    });
  });
}
