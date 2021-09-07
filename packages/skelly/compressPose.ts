import parts from "./parts";

export default (pose) => {
  const output = {};

  pose.forEach((point) => (output[point.part] = [point.x, point.y]));

  return parts.map((p) => output[p]).flat();
};
