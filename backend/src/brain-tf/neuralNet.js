import tf, {
    denseBincount
} from "@tensorflow/tfjs"
import {
    getTrainingPosesByID,
    getAllTrainingPoses,
    getAllPoses
} from "../database/index.js"

let neuralNet = tf.sequential();
const adamOpt = tf.train.adam(0.3);

var trainingSet;
let validationSet;
let testSetInput;


let testSetExpected = tf.tensor([
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1]
])

createNeuralNet();
initializingTrainingSets();



setInterval(function () {
    train().then(neuralNet.predict(testSetInput).print());


}, 1000);


async function initializingTrainingSets() {
    let trainingData = await getAllTrainingPoses()
    let allPoses = await getAllPoses();

    let training = [];
    let validation = [];

    trainingData.forEach(pose => {
        training.push(pose.pose)
        for (let i = 0; i < allPoses.length; i++) {
            if (pose.id === allPoses[i].id) {
                let temp = testSetExpected.arraySync()[i];
                validation.push(temp)
            }
        }
    });

    validationSet = tf.tensor2d(validation);
    trainingSet = tf.tensor2d(training);

    let testSetTemp = []

    allPoses.forEach(pose => {
        testSetTemp.push(pose.pose)
    });

    testSetInput = tf.tensor2d(testSetTemp)
}


async function train() {
    let setup = {
        epochs: 5
    }
    let answer = await neuralNet.fit(trainingSet, validationSet, setup)
    console.log(answer.history.loss[0]);

}

function createNeuralNet() {

    neuralNet.add(tf.layers.dense({
        units: 5,
        inputShape: [34]
    }));
    neuralNet.add(tf.layers.dense({
        units: 6
    }));

    neuralNet.add(tf.layers.dense({
        units: 5
    }));
    neuralNet.add(tf.layers.dense({
        units: 13
    }));

    neuralNet.compile({
        optimizer: adamOpt,
        loss: "meanSquaredError"
    });
}