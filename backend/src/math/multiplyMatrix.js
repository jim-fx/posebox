// shamelessly copied from:
// https://stackoverflow.com/a/27205341

const createMatrix = require("./createMatrix");
const printMatrix = require("./printMatrix");

module.exports = (matA, matB) => {
  const matARows = matA.length;
  const matACols = matA[0].length;
  const matBRows = matB.length;
  const matBCols = matB[0].length;

  // console.log("-------- MULTIPLY ---------");
  if (matACols !== matBRows) {
    console.error("Eyyy, diese beiden Matrixen kann man nicht multiplizieren");
  }
  // console.matrix(matA);
  // console.log("");
  // console.matrix(matB);
  // console.log("---------------------------");

  const output = createMatrix(matBCols, matARows);

  for (let row = 0; row < matARows; ++row) {
    for (let col = 0; col < matBCols; ++col) {
      for (let i = 0; i < matACols; ++i) {
        output[row][col] += matA[row][i] * matB[i][col];
      }
    }
  }

  return output;
};
