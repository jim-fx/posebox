export default function (m) {
  if (Array.isArray(m[0])) {
    console.log(`Matrix: Cols ${m[0].length} Rows ${m.length}`);
    m.forEach((row) => {
      console.log(...row);
    });
  } else {
    console.log(`Vector: ${m.length}`);
    console.log(...m);
  }
}
