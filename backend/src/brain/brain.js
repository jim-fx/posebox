const random = require("../helpers/random");
const createMatrix = require("../math/createMatrix");
const eachMatrix = require("../math/eachMatrix");
const multiplyMatrix = require("../math/multiplyMatrix");
const printMatrix = require("../math/printMatrix");
const transposeMatrix = require("../math/transposeMatrix");
const transposeVector = require("../math/transposeVector");
const activationFuncs = require("./activationFuncs");

class Brain {
  constructor(dimensions) {
    this.dimensions = dimensions;
    this.activationFunction = activationFuncs.sigmoid;
    this.layers = new Array(dimensions.length - 1);

    for (let i = 0; i < dimensions.length - 1; i++) {
      const layerHeight = dimensions[i];
      const nextLayerHeight = dimensions[i + 1];
      this.layers[i] = createMatrix(layerHeight + 1, nextLayerHeight);
    }
  }

  eachLayer(cb) {
    this.layers.forEach(cb);
  }

  eachWeight(cb) {
    this.layers = this.layers.map((layer) => eachMatrix(layer, cb));
  }

  fill(createValue) {
    this.eachWeight(() => {
      return createValue();
    });
  }

  setActivationFunction(func) {
    this.activationFunction = func;
  }

  feed(vec) {
    const activationValues = new Array(this.layers.length + 1);

    activationValues[0] = transposeVector(vec);

    for (let i = 0; i < this.layers.length; i++) {
      const layerWeights = this.layers[i];

      console.log("Lazyer Weights");
      console.matrix(layerWeights);

      //Reshape the vector into a matrix
      // from [1,2,3]
      /* into [
        [1],
        [2],
        [3]
      ]*/

      //activationValues[i] = transposeVector(activationValues[i]);

      //Reshape layer to fit
      /*
        from
        [
          [1,2,3],
          [4,5,6]
        ]

        to
        [
          [1,4],
          [2,5],
          [3,6]
        ]
      */
      const transposedLayerWeights = transposeMatrix(layerWeights);

      //Add bias to vector
      /*
        because our layers have a bias neuron,
        we need to add one value to our vector to be
        able to multiply them
      */
      activationValues[i] = [[1], ...activationValues[i]];
      console.log("Activation Vector");
      console.matrix(activationValues[i]);

      // Finally multiply our vector with our layer weights
      activationValues[i + 1] = multiplyMatrix(
        transposedLayerWeights,
        transposeMatrix(activationValues[i])
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
}

module.exports = Brain;
