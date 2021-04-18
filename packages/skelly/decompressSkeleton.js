import parts from "./parts.js";

export default (skeleton) => {
  const output = {};

  parts.forEach((p, i) => {
    output[p] = {
      x: skeleton[i * 2 + 0],
      y: skeleton[i * 2 + 1],
    };
  });

  return output;
};
