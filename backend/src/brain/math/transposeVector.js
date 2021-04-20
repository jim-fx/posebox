export default (vec) => {
  return new Array(vec.length).fill(null).map((v, i) => [vec[i]]);
};
