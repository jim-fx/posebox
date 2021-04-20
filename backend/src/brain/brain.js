import activationFuncs from "./activationFuncs.js";
import createMatrix from "./math/createMatrix.js";
import eachMatrix from "./math/eachMatrix.js";
import multiplyVectorMatrix from "./math/multiplyVectorMatrix.js";

class Brain {
  constructor(dimensions) {
    this.dimensions = dimensions;
    this.activationFunction = activationFuncs.sigmoid;
    this.layers = new Array(dimensions.length - 1);

    for (let i = 0; i < dimensions.length - 1; i++) {
      // The plus one is for the bias neuron
      const layerHeight = dimensions[i] + 1;
      const nextLayerHeight = dimensions[i + 1];
      this.layers[i] = createMatrix(layerHeight, nextLayerHeight);
    }

    console.log("New Brain:");
    let maxHeight = Math.max(...this.dimensions);

    let layers = createMatrix(this.dimensions.length, maxHeight).map((row, y) =>
      row.map((_, x) => {
        if (y < this.dimensions[x]) {
          return "X";
        }
        return " ";
      })
    );

    layers = [[...this.dimensions], ...layers];

    console.matrix(layers);
  }

  eachLayer(cb) {
    return this.layers.map(cb);
  }

  eachWeight(cb) {
    this.layers = this.layers.map((layer) => eachMatrix(layer, cb));
  }

  initWeights(createValue) {
    this.eachWeight(createValue);
  }

  setActivationFunction(func) {
    this.activationFunction = func;
  }

  feed(vec) {
    const activationValues = new Array(this.layers.length + 1);

    activationValues[0] = vec;

    for (let i = 0; i < this.layers.length; i++) {
      const layerWeights = this.layers[i];

      //Add bias to vector
      /*
        because our layers have a bias neuron,
        we need to add one value to our vector to be
        able to multiply them with the layers
        */
      activationValues[i] = [1, ...activationValues[i]];

      // Multiply our vector with our layer weights
      activationValues[i + 1] = multiplyVectorMatrix(
        layerWeights,
        activationValues[i]
      );

      // Apply the activation function to each value in our output vector
      activationValues[i + 1] = eachMatrix(
        activationValues[i + 1],
        this.activationFunction
      );
    }

    // Return the activation vector of the last layer
    return activationValues[activationValues.length - 1];
  }

  calculateLossVector(input, expected) {
    const output = this.feed(input);

    if (output.length !== expected.length) {
      throw new Error(
        `Ouput length (${output.length}) and expected length (${expected.length}) don't match!`
      );
    }

    return output.map((out, i) => {
      return Math.pow(out - expected[i], 2) / 2;
    });
  }

  calculateLoss(input, expected) {
    const errorVec = this.calculateLossVector(input, expected);
    return errorVec.reduce((a, b) => a + b);
  }

  deltaPrevActivityOnZ(layerIndex, currentNodeIndex, prevNodeIndex) {
    return this.layers[layerIndex][currentNodeIndex][prevNodeIndex];
  }

  deltaWeightOnZ(layerIndex, weightIndex) {
    if (layerIndex !== 0) {
      return this.network.layers[layerIndex - 1].nodes[weightIndex].activity;
    } else {
      return (this.network.input && this.network.input[weightIndex]) || 0;
    }
  }

  createDeltaMatrix() {
    const output = new Array(this.dimensions.length);

    for (let i = 0; i < this.dimensions.length - 1; i++) {
      const layerWeights = this.dimensions[i];
      const nextLayerHeight = this.dimensions[i + 1];

      output[i] = new Array(layerWeights).map((node) => {
        return {
          bias: 0,
          weights: new Array(nextLayerHeight),
        };
      });
    }

    return output;
  }

  train(input, output) {
    // This array of matrices will store the changes
    // to the weights and biases
    const deltaMatrix = this.createDeltaMatrix();

    console.log(deltaMatrix);

    for (let i = this.layers.length - 1; i >= 0; i--) {
      const layer = this.layers[i];
    }
  }
}

export default Brain;
