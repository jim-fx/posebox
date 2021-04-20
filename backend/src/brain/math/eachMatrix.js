export default function (m, cb) {
  if (Array.isArray(m[0])) {
    return m.map((row, y) => row.map((cell, x) => cb(cell, x, y)));
  }
  return m.map(cb);
}
