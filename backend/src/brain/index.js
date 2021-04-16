const createMatrix = require("../math/createMatrix");
const fillMatrix = require("../math/fillMatrix");
const random = require("../helpers/random");
const Brain = require("./brain");
const printMatrix = require("../math/printMatrix");
const transposeMatrix = require("../math/transposeMatrix");
const multiplyMatrix = require("../math/multiplyMatrix");

console.matrix = printMatrix;

const b = new Brain([3, 5, 5, 5, 1]);

b.fill(random.int(0, 10));

const answer = b.feed([1, 2, 3]);

console.log("ANSWER", answer);
