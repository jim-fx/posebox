import parts from "./parts.js";

export default (skeleton) => {
  const output = {};

  skeleton.forEach((point) => (output[point.part] = [point.x, point.y]));

  return parts.map((p) => output[p]).flat();
};
