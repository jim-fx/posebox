export default (dims) =>
  new Array(dims)
    .fill(null)
    .map((_, y) => new Array(dims).fill(null).map((_, x) => (x === y ? 1 : 0)));
