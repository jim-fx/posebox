import tf from "@tensorflow/tfjs-node";
import { mkdir, readFile } from "fs/promises";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import db from "../database/index.js";
import socket from "../socket-server.js";
import createIdentityMatrix from "./helpers/createIdentityMatrix.js";
import shuffleArray from "./helpers/shuffleArray.js";
import visualizeSelection from "./helpers/visualizeSelection.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * @type tf.Sequential
 */
let neuralNet;
let trainingSet;
let validationSet;
let testSetInput;

const options = {
  batchSize: 20,
  epochs: 10,
  verbose: 0,
  learningRate: 0.05,
  startTime: Date.now(),
};

const dataSetInformation = {};

// Keep track of the learning process here;
let iterations = [];

async function train() {
  const a = Date.now();

  const answer = await neuralNet.fit(trainingSet, validationSet, options);

  const prediction = neuralNet.predict(testSetInput);

  console.log("Current Iteration ", iterations.length);

  visualizeSelection(prediction);

  const loss = answer.history.loss[0];

  console.log("Loss: ", loss);

  const b = Date.now();

  // Save the weights on each 10 iteration
  if ((iterations.length + 1) % 10 === 0) {
    const res = await neuralNet.save(
      `file://${resolve(__dirname, "./weights")}`
    );
    console.log("Save neural net");
    console.log(res);
  }

  const currentIteration = {
    loss,
    prediction: prediction.arraySync(),
    duration: b - a,
  };

  iterations.push(currentIteration);

  socket.send("brain.iteration", currentIteration);

  if (loss) {
    train();
  } else {
    console.log("We seem to have a problem here");
  }
}

function createNeuralNet() {
  const neuralNet = tf.sequential();
  const adamOpt = tf.train.sgd(0.05);

  neuralNet.add(
    tf.layers.dense({
      units: 30,
      inputShape: [34],
    })
  );
  neuralNet.add(
    tf.layers.dense({
      units: 50,
    })
  );

  neuralNet.add(
    tf.layers.dense({
      units: 50,
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
  const trainingData = shuffleArray(await db.getAllTrainingPoses());
  const allPoses = await db.getAllPoses();

  const amountPerID = {};
  const training = trainingData.map((pose) => {
    amountPerID[pose.id] =
      pose.id in amountPerID ? amountPerID[pose.id] + 1 : 0;
    return pose.pose;
  });
  dataSetInformation.amounts = amountPerID;
  dataSetInformation.amount = trainingData.length;

  console.log("Loading " + trainingData.length + " poses");

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

async function init() {
  if (neuralNet) return;

  await mkdir(resolve(__dirname, "weights"));

  await initializingTrainingSets();

  neuralNet = createNeuralNet();

  train();
}

function getIterations() {
  return JSON.parse(JSON.stringify(iterations));
}

async function getInfo() {
  const info = { ...options, dataset: dataSetInformation };
  info.currentTime = Date.now();
  try {
    const rawSummary = await readFile(
      resolve(__dirname, "weights/model.json"),
      "utf-8"
    );
    info.summary = JSON.parse(rawSummary);
    console.log(info.summary);
  } catch (error) {
    console.log(error);
  }
  info.duration = info.currentTime - info.startTime;
  return info;
}

function reset() {
  neuralNet.setWeights(neuralNet.initialWeights);
  options.startTime = Date.now();
  iterations = [];
  socket.send("brain.reset");
  return { ...options };
}

function getWeights() {
  return neuralNet.getWeights(true).map((w) => w.arraySync());
}

init();

export default { getIterations, getInfo, getWeights, reset };
