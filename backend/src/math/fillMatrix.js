module.exports = function (m, cb) {
  return m.map((row) => row.map(() => (cb ? cb() : 0)));
};
