import activationFuncs from "./activationFuncs";
import createMatrix from "./math/createMatrix";
import eachMatrix from "./math/eachMatrix";
import multiplyMatrix from "./math/multiplyMatrix";
import multiplyVectorMatrix from "./math/multiplyVectorMatrix";
import printMatrix from "./math/printMatrix";
import transposeMatrix from "./math/transposeMatrix";
import transposeVector from "./math/transposeVector";

class Brain {
  dimensions: number[];
  activationFunction: (v: number) => number;

  layers: number[][][];

  constructor(dimensions: number[]) {
    this.dimensions = dimensions;
    this.activationFunction = activationFuncs.sigmoid;
    this.layers = new Array(dimensions.length - 1);

    for (let i = 0; i < dimensions.length - 1; i++) {
      // The plus one is for the bias neuron
      const layerHeight = dimensions[i] + 1;
      const nextLayerHeight = dimensions[i + 1];
      this.layers[i] = createMatrix(layerHeight, nextLayerHeight);
    }

    console.log("New Brain, who dis?:");
    console.log(...this.dimensions);
  }

  print() {
    console.log("New Brain, who dis?:");
    let maxHeight = Math.max(...this.dimensions);

    let layers: any[][] = createMatrix(this.dimensions.length, maxHeight).map(
      (row, y) =>
        row.map((_, x) => {
          if (y < this.dimensions[x]) {
            return "X";
          }
          return " ";
        })
    );

    layers = [[...this.dimensions], ...layers];

    printMatrix(layers);
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

      const transposedLayerWeights = transposeMatrix(layerWeights);

      // Multiply our vector with our layer weights
      activationValues[i + 1] = multiplyVectorMatrix(
        transposedLayerWeights,
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

  calculateError(input, expected) {
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
    const errorVec = this.calculateError(input, expected);
    return errorVec.reduce((a, b) => a + b);
  }

  train(input, expected) {
    const guess = this.feed(input);

    const errorVec = guess.map((out, i) => {
      return Math.pow(out - expected[i], 2) / 2;
    });

    console.log("INPUT", input);
    console.log("EXPECTED", expected);
    console.log("e1: ", errorVec);

    const errors = new Array(this.layers.length + 1);
    errors[errors.length - 1] = errorVec;
    const biases = [];

    for (let i = this.layers.length - 1; i >= 0; i--) {
      const layer = this.layers[i];

      const transposedError = transposeVector(errors[i + 1]);

      const err = multiplyMatrix(layer, transposedError)[0];

      //First element in the array is the bias
      // We need to remove it so we can perform
      // the matrix multiplication in the next layer
      biases[i] = err.shift();
      errors[i] = err;
    }

    console.log("ERRORS", errors);
    console.log("BIASES", biases);
  }
}

export default Brain;
