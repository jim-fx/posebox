import tf from "@tensorflow/tfjs";
import { getAllPoses, getAllTrainingPoses } from "../database/index.js";
import createIdentityMatrix from "./helpers/createIdentityMatrix.js";
import visualizeSelection from "./helpers/visualizeSelection.js";

let neuralNet;

let trainingSet;
let validationSet;
let testSetInput;

let testSetExpected = tf.tensor(createIdentityMatrix(13));

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

  let training = [];
  let validation = [];

  trainingData.forEach((pose) => {
    training.push(pose.pose);
    for (let i = 0; i < allPoses.length; i++) {
      if (pose.id === allPoses[i].id) {
        let temp = testSetExpected.arraySync()[i];
        validation.push(temp);
      }
    }
  });

  validationSet = tf.tensor2d(validation);
  trainingSet = tf.tensor2d(training);

  let testSetTemp = [];

  allPoses.forEach((pose) => {
    testSetTemp.push(pose.pose);
  });

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
