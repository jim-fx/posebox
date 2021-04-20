import fillVector from "./fillVector";
export default (mat, cb) => mat.map((row) => fillVector(row, cb));
