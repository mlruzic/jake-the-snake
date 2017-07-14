function NeuralNetRenderer(neuronsInLayers, canvas) {
  this.neuronsInLayers = neuronsInLayers;
  this.canvas = canvas;
  this.ctx = canvas.getContext('2d');
  this.radius = 60;

  this.neurons = this.prepareNeuronData();
}

NeuralNetRenderer.prototype.prepareNeuronData = function() {
  var neurons = [];

  for (var i = 0; i < this.neuronsInLayers.length; i++) {
    neurons.push([]);

    for (var j = 0; j < this.neuronsInLayers[i]; j++) {
      neurons[i].push({
        x: this.getNeuronX(i),
        y: this.getNeuronY(j, this.neuronsInLayers[i]),
      })
    }
  }

  return neurons;
}

NeuralNetRenderer.prototype.getNeuronX = function(index) {
  var colWidth = (this.canvas.width - 200) / this.neuronsInLayers.length;
  return index * colWidth + colWidth / 2 + 100;
}

NeuralNetRenderer.prototype.getNeuronY = function(index, numNeuronsInCol) {
  var offset = (this.canvas.height - 3.5 * numNeuronsInCol * this.radius) / 2;
  return 4 * this.radius * index + offset + this.radius;
}

NeuralNetRenderer.prototype.draw = function(weights, input, output) {
  // find max. abs. weight so that line height can be scaled properly
  // higher the weight the ticker the line between the neurons
  var maxAbsWeight = -Infinity;
  for (var i = 0; i < weights.length; i++) {
    var absWeight = Math.abs(weights[i]);
    if (absWeight > maxAbsWeight) {
      maxAbsWeight = absWeight;
    }
  }

  // find active output neuron to paint it different color
  var maxOutput = Math.max.apply(null, output);
  var maxOutputIndex = output.indexOf(maxOutput);
  
  this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  this.ctx.strokeStyle = 'white';
  this.ctx.font = "60px Arial";

  // draw input values
  for (var i = 0; i < input.length; i++) {
    var y = 4 * this.radius * i + 90 + this.radius;
    this.ctx.fillStyle = 'white';
    this.ctx.fillText(input[i].toFixed(4), 50, y);
  }

  // draw output labels
  this.ctx.fillText("Left", 1750, 360);
  this.ctx.fillText("Front", 1750, 600);
  this.ctx.fillText("Right", 1750, 840);

  // draw connections between the neurons
  var weigthIndex = 0;
  for (var i = 1; i < this.neurons.length; i++) {
    for (var j = 0; j < this.neurons[i].length; j++) {
      var n1 = this.neurons[i][j];
      for (var z = 0; z < this.neuronsInLayers[i - 1]; z++) {
        var n2 = this.neurons[i - 1][z];
        var weight = weights[weigthIndex++];
        var lineWeight = this.map(0, maxAbsWeight, 5, 15, weight);

        var color = weight >=0 ? 'green' : 'red';
        this.drawLine(n1.x, n1.y, n2.x, n2.y, color, lineWeight)
      }
    }
  }

  // draw neurons
  for (var i = 0; i < this.neurons.length; i++) {
    for (var j = 0; j < this.neurons[i].length; j++) {
      if (i === 0) this.ctx.fillStyle = 'white';
      else if (i < this.neurons.length - 1) this.ctx.fillStyle = 'grey';
      else if (j === maxOutputIndex)  this.ctx.fillStyle = 'blue';
      else  this.ctx.fillStyle = 'white';

      this.ctx.beginPath();
      this.ctx.arc(this.neurons[i][j].x, this.neurons[i][j].y, this.radius / 2, 0, Math.PI * 2);
      this.ctx.closePath();
      this.ctx.fill();
    }
  }

}

NeuralNetRenderer.prototype.drawLine = function(x1, y1, x2, y2, color, width) {
  this.ctx.beginPath();
  this.ctx.moveTo(x1, y1);
  this.ctx.lineTo(x2, y2);
  this.ctx.lineWidth = width;
  this.ctx.strokeStyle = color;
  this.ctx.stroke();
}

NeuralNetRenderer.prototype.map = function(min, max, x, y, w) {
  var a = (y - x) / (max - min);
  var b = x - a * min;
  return a * w + b;
}
