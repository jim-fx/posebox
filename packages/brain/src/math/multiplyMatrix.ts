// shamelessly copied from:
// https://stackoverflow.com/a/27205341

import createMatrix from "./createMatrix";
import printMatrix from "./printMatrix";

export default (matA, matB) => {
  const matARows = matA.length;
  const matACols = matA[0].length;
  const matBRows = matB.length;
  const matBCols = matB[0].length;

  if (matACols !== matBRows) {
    console.error("Eyyy, diese beiden Matrixen kann man nicht multiplizieren");
    console.log("-------- MULTIPLY ---------");
    printMatrix(matA);
    console.log("");
    printMatrix(matB);
    console.log("---------------------------");
  }

  const output = createMatrix(matBCols, matARows);

  for (let row = 0; row < matARows; ++row) {
    for (let col = 0; col < matBCols; ++col) {
      for (let i = 0; i < matACols; ++i) {
        output[col][row] += matA[row][i] * matB[i][col];
      }
    }
  }

  return output;
};
