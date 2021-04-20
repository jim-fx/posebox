import createMatrix from "./createMatrix";

export default function (m) {
  const output = createMatrix(m[0].length, m.length);

  m.forEach((row, y) => {
    row.forEach((cell, x) => {
      output[x][y] = cell;
    });
  });

  return output;
}
