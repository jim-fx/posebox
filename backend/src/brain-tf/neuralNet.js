import tf, {
    denseBincount
} from "@tensorflow/tfjs"
import {
    getTrainingPosesByID,
    getAllTrainingPoses,
    getAllPoses
} from "../database/index.js"

let neuralNet = tf.sequential();
const adamOpt = tf.train.adam(0.01);

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

let prediction

setInterval(function () {
    train().then(
        prediction = neuralNet.predict(testSetInput),
        //  prediction.print(),
        // console.log(prediction),
        visualizeSelection(prediction)
    );
}, 1000);

async function train() {
    let setup = {
        epochs: 10
    }
    let answer = await neuralNet.fit(trainingSet, validationSet, setup)
    console.log(answer.history.loss[0]);

}

function createNeuralNet() {

    neuralNet.add(tf.layers.dense({
        units: 30,
        inputShape: [34]
    }));
    neuralNet.add(tf.layers.dense({
        units: 25
    }));

    neuralNet.add(tf.layers.dense({
        units: 20
    }));
    neuralNet.add(tf.layers.dense({
        units: 13
    }));

    neuralNet.compile({
        optimizer: adamOpt,
        loss: "meanSquaredError"
    });
}

function visualizeSelection(prediction) {
    let arrayPrediction = []
    for (let i = 0; i < prediction.strides; i++) {
        let a = prediction.arraySync()[i];
        arrayPrediction.push(a)
    }

    let correctGuesses = 0;
    let finalArray = [];

    for (let i = 0; i < arrayPrediction.length; i++) {
        let finalRow = [];
        let currentBestScore = 0;
        let indexBestScore = 0
        for (let j = 0; j < arrayPrediction[i].length; j++) {
            if (arrayPrediction[i][j] > currentBestScore) {
                currentBestScore = arrayPrediction[i][j];
                indexBestScore = j;
            }
        }
        for (let j = 0; j < arrayPrediction.length; j++) {
            if (j == indexBestScore) {
                finalRow.push(1)
            } else finalRow.push(0)
        }

        if (finalRow[i] == 1) {
            correctGuesses++;
        }

        finalArray.push(finalRow);
    }

    let finalTensor = tf.tensor(finalArray);
    finalTensor.print();
    console.log("Correct Guesses: " + correctGuesses)
}


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