import parts from "./parts.js";

export default (pose) => {
  const output = {};

  parts.forEach((p, i) => {
    output[p] = {
      x: pose[i * 2 + 0],
      y: pose[i * 2 + 1],
    };
  });

  return output;
};
