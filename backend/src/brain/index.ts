import * as tf from "@tensorflow/tfjs-node-gpu";
import { Rank, Tensor } from "@tensorflow/tfjs-node-gpu";
import { mkdir, readFile } from "fs/promises";
import { resolve } from "path";
import socket from "../socket-server";
import getTrainingData from "./getTrainingData";
import visualizeSelection from "./helpers/visualizeSelection";

let neuralNet = createNeuralNet();
let trainingSet;
let validationSet;
let testSetInput;

const learningRate = 0.005

const options = {
  batchSize: 20,
  epochs: 10,
  verbose: 0,
  learningRate,
  startTime: Date.now(),
};

// Keep track of the learning process here;
let iterations = [];

let debug = true;

async function train() {
  const a = Date.now();

  const answer = await neuralNet.fit(trainingSet, validationSet, options);

  const prediction = neuralNet.predict(testSetInput) as Tensor<Rank>;

  debug && console.log("Current Iteration ", iterations.length);

  debug && visualizeSelection(prediction);

  const loss = answer.history.loss[0];

  debug && console.log("Loss: ", loss);

  const b = Date.now();

  // Save the weights on each 10 iteration
  if ((iterations.length + 1) % 10 === 0) {
    const res = await neuralNet.save(
      `file://${resolve(__dirname, "./weights")}`
    );
    if (debug) {
      console.log("Save neural net");
      console.log(res);
    }
  }

  const currentIteration = {
    loss,
    prediction: prediction.arraySync(),
    duration: b - a,
  };

  socket.send("brain.iteration", currentIteration);

  if (loss) {
    iterations.push(currentIteration);
    train();
  } else {
    console.log("We seem to have a problem here");
    console.log("The loss is at ", loss);
  }
}

function createNeuralNet() {
  const neuralNet = tf.sequential();
  const adamOpt = tf.train.adam(0.005);

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

async function init() {
  await mkdir(resolve(__dirname, "weights"), { recursive: true });

  const data = await getTrainingData();

  trainingSet = data.trainingSet;
  validationSet = data.validationSet;
  testSetInput = data.testSetInput;

  train();
}

function getIterations() {
  return JSON.parse(JSON.stringify(iterations));
}

async function getInfo() {
  const info: any = { ...options };
  info.currentTime = Date.now();
  try {
    const rawSummary = await readFile(
      resolve(__dirname, "weights/model.json"),
      "utf-8"
    );
    info.summary = JSON.parse(rawSummary);
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
