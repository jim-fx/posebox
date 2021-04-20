export default function createMatrix(cols, rows, createValue) {
  return new Array(rows).fill(null).map(() => {
    return new Array(cols).fill(createValue ? createValue() : 0);
  });
}
