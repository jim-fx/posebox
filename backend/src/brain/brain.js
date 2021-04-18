import createMatrix from "../math/createMatrix";
import eachMatrix from "../math/eachMatrix";
import multiplyMatrix from "../math/multiplyMatrix";
import transposeMatrix from "../math/transposeMatrix";
import activationFuncs from "./activationFuncs";

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
    return this.layers.map(cb);
  }

  eachWeight(cb) {
    this.layers = this.layers.map((layer) => eachMatrix(layer, cb));
  }

  initWeights(createValue) {
    this.eachWeight(() => {
      return createValue();
    });
  }

  setActivationFunction(func) {
    this.activationFunction = func;
  }

  feed(vec) {
    const activationValues = new Array(this.layers.length + 1);

    // Turn Vector into matrix
    activationValues[0] = [vec];

    for (let i = 0; i < this.layers.length; i++) {
      const layerWeights = this.layers[i];

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
        able to multiply them with the layers
        */
      activationValues[i] = [[1, ...activationValues[i][0]]];

      // Finally multiply our vector with our layer weights
      activationValues[i + 1] = multiplyMatrix(
        activationValues[i],
        transposedLayerWeights
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

  calculateLoss(input, expected) {
    // def loss(A,Y):
    //     errorVec=Y*np.log(np.maximum(A,1e-50))+(1-Y)*np.log(np.maximum(1-A,1e-50))
    //     error=np.sum(-errorVec)
    //     return error
    // def lossTheta(x,y,Theta):
    //     # Feed the entry x to the neural network with the parameters Theta
    //     A=feedforward(x,Theta)
    //     # Call the loss function, feeding in the activation of the last layer and the target:
    //     error=loss(A[-1],y)
    //     return(error)
  }
}

module.exports = Brain;
