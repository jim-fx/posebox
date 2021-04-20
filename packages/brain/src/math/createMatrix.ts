import createVector from "./createVector";

export default (cols: number, rows: number, createValue?: () => number) =>
  new Array(cols).fill(null).map(() => createVector(rows, createValue));
