export default (size: number, createValue?: () => number) =>
  new Array(size).fill(null).map((v) => (createValue ? createValue() : 0));
