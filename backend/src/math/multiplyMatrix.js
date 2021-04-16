// shamelessly copied from:
// https://stackoverflow.com/a/27205341

const createMatrix = require("./createMatrix");
const printMatrix = require("./printMatrix");

module.exports = (mat1, mat2) => {
  const mat1Rows = mat1.length;
  const mat1Cols = mat1[0].length;
  const mat2Rows = mat2.length;
  const mat2Cols = mat2[0].length;

  // console.log("-------- MULTIPLY ---------");
  if (mat1Rows != mat2Cols) {
    console.error("Eyyy, diese beiden Matrixen kann man nicht multiplizieren");
  }
  // console.matrix(mat1);
  // console.log("");
  // console.matrix(mat2);
  // console.log("---------------------------");

  const output = createMatrix(mat1Rows, mat2Cols);

  for (let row = 0; row < mat1Rows; ++row) {
    for (let col = 0; col < mat2Cols; ++col) {
      for (let i = 0; i < mat1Cols; ++i) {
        output[col][row] += mat1[row][i] * mat2[i][col];
      }
    }
  }

  return output;
};
