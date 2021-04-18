export default function (m, cb) {
  return m.map((row, y) => row.map((cell, x) => cb(cell, x, y)));
}
