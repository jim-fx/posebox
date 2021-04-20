import activationFuncs from "./activationFuncs.js";
import Brain from "./brain.js";
import random from "./helpers/random.js";
import printMatrix from "./math/printMatrix.js";

console.matrix = printMatrix;

const b = new Brain([3, 5, 5, 3]);

b.setActivationFunction(activationFuncs.relu);

b.initWeights(random.uniformp);

b.eachLayer(printMatrix);

// [
//   [1, 2, 3],
//   [3, 2, 1],
//   [0, 0, 0],
// ].forEach((vec) => {
//   console.log(`ANSWER \n [${vec}] -> [${b.feed(vec)}]`);
// });

b.train();
