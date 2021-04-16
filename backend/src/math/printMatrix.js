module.exports = function (m) {
  console.log(`Matrix: Cols ${m[0].length} Rows ${m.length}`);
  m.forEach((row) => {
    console.log(...row);
  });
};
