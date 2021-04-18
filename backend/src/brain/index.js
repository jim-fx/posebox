import random from "../helpers/random";
import printMatrix from "../math/printMatrix";
import activationFuncs from "./activationFuncs";
import Brain from "./brain";

console.matrix = printMatrix;

const b = new Brain([3, 5, 1]);

b.setActivationFunction(activationFuncs.relu);

b.initWeights(random.uniform);

console.log("ANSWER", b.feed([1, 2, 3]));
console.log("ANSWER2", b.feed([3, 2, 1]));

// console.matrix([[1, 2, 3, 4]]);
// console.matrix(transposeMatrix([[1, 2, 3, 4]]));

// console.matrix(
//   multiplyMatrix(
//     [
//       [3, 2, 1],
//       [1, 0, 2],
//     ],
//     [
//       [1, 2],
//       [0, 1],
//       [4, 0],
//     ]
//   )
// );
