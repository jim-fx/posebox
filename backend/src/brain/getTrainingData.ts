import * as tf from "@tensorflow/tfjs-node";
import db from "../database";
import createIdentityMatrix from "./helpers/createIdentityMatrix";
import shuffleArray from "./helpers/shuffleArray";

export default async () => {
  const trainingData = shuffleArray(await db.getVerifiedTrainingPoses());
  const allPoses = await db.getAllPoses();

  if (!trainingData.length) {
    console.error("No training data available");
  }

  const amountPerID = {};
  const training = trainingData.map((pose) => {
    amountPerID[pose.id] =
      pose.id in amountPerID ? amountPerID[pose.id] + 1 : 0;
    return pose.pose;
  });

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

  const validationSet = tf.tensor2d(validation);
  const trainingSet = tf.tensor2d(training);

  let testSetTemp = allPoses.map((pose) => pose.pose);
  const testSetInput = tf.tensor2d(testSetTemp);

  // console.log("validationSet")
  // validationSet.print();
  // console.log("trainingSet")
  // trainingSet.print();
  // console.log("testSetInput")
  // testSetInput.print();
  // console.log(allPoses)

  return {
    validationSet,
    trainingSet,
    testSetInput,
  };
};
