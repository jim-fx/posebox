export default (mat, vec) => {
  if (mat[0].length != vec.length) {
    console.matrix(mat);
    console.matrix(vec);
    console.error("Cant multiply that mat and vec");
  }

  const output = new Array(mat.length).fill(null).map(() => 0);

  for (let x = 0; x < mat[0].length; x++) {
    for (let y = 0; y < mat.length; y++) {
      output[y] += vec[x] * mat[y][x];
    }
  }

  return output;
};
