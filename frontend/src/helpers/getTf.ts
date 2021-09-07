import type * as tf from "@tensorflow/tfjs";

export default () => {
  const _tf: typeof tf =
    //@ts-ignore
    "tf" in window ? window.tf : "ml5" in window && window.ml5.tf;

  return _tf;
};
