const createMatrix = require("./createMatrix");

module.exports = function (m) {
  const output = createMatrix(m.length, m[0].length);

  m.forEach((row, y) => {
    row.forEach((cell, x) => {
      output[x][y] = cell;
    });
  });

  return output;
};
