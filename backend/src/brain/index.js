import tf from "@tensorflow/tfjs";
import { getAllPoses, getAllTrainingPoses } from "../database/index.js";
import createIdentityMatrix from "./helpers/createIdentityMatrix.js";
import visualizeSelection from "./helpers/visualizeSelection.js";

let neuralNet;
let trainingSet;
let validationSet;
let testSetInput;

async function train() {
  const setup = {
    epochs: 50,
  };
  const answer = await neuralNet.fit(trainingSet, validationSet, setup);

  const prediction = neuralNet.predict(testSetInput);

  visualizeSelection(prediction);
  console.log(answer.history.loss[0]);
  //prediction.print();

  train();
}

function createNeuralNet() {
  const neuralNet = tf.sequential();
  const adamOpt = tf.train.sgd(0.002);

  neuralNet.add(
    tf.layers.dense({
      units: 30,
      inputShape: [34],
    })
  );
  neuralNet.add(
    tf.layers.dense({
      units: 25,
    })
  );

  neuralNet.add(
    tf.layers.dense({
      units: 20,
    })
  );
  neuralNet.add(
    tf.layers.dense({
      units: 13,
    })
  );

  neuralNet.compile({
    optimizer: adamOpt,
    loss: tf.losses.softmaxCrossEntropy,
  });

  return neuralNet;
}

async function initializingTrainingSets() {
  let trainingData = await getAllTrainingPoses();
  let allPoses = await getAllPoses();

  let training = trainingData.map((pose) => pose.pose);

  // Create a matrix of the format
  /**
   * [1, 0, 0, 0, 0]
   * [0, 1, 0, 0, 0]
   * [0, 0, 1, 0, 0]
   * [0, 0, 0, 1, 0]
   * [0, 0, 0, 0, 1]
   */
  const testSetExpected = createIdentityMatrix(allPoses.length);

  // Map the poses into a string array ["x", "o", "lmrh", ...]
  const allPoseIdArray = allPoses.map((pose) => pose.id);

  // Map each pose to a vector from the identity matrix
  const validation = trainingData.map(
    (pose) => testSetExpected[allPoseIdArray.indexOf(pose.id)]
  );

  validationSet = tf.tensor2d(validation);
  trainingSet = tf.tensor2d(training);

  let testSetTemp = allPoses.map((pose) => pose.pose);

  testSetInput = tf.tensor2d(testSetTemp);

  // console.log("validationSet")
  // validationSet.print();
  // console.log("trainingSet")
  // trainingSet.print();
  // console.log("testSetInput")
  // testSetInput.print();
  // console.log(allPoses)
}

(async function () {
  await initializingTrainingSets();

  neuralNet = createNeuralNet();

  train();
})();
