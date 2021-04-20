import tf from "@tensorflow/tfjs"

let neuralNet = tf.sequential();
const adamOpt = tf.train.adam(0.3);

var trainingSet;
let validationSet;
let testSetInput;
let testSetExpected;


testSetInput = tf.tensor([
    [5, 5],
    [7, 3],
    [22, 56],
    [1, 12]
])

testSetExpected = tf.tensor([
    [7.071],
    [7.616],
    [60.166],
    [12.042]
])

createNeuralNet();
initializingTrainingSet();

setInterval(function(){
    train().then(neuralNet.predict(testSetInput).print());
}, 1000);





async function train() {
    let setup = {
        epochs: 1
    }
    let answer = await neuralNet.fit(trainingSet, validationSet, setup)
    console.log(answer.history.loss[0]);

}

function createNeuralNet() {

    neuralNet.add(tf.layers.dense({
        units: 5,
        inputShape: [2]
    }));
    neuralNet.add(tf.layers.dense({
        units: 6
    }));

    neuralNet.add(tf.layers.dense({
        units: 5
    }));
    neuralNet.add(tf.layers.dense({
        units: 1
    }));

    neuralNet.compile({
        optimizer: adamOpt,
        loss: "meanSquaredError"
    });
}

function initializingTrainingSet() {
    let training = [];
    let testing = [];
    
    // let training = [];
    // let testing = [];

    // for (let i = 0; i < 1000; i++) {
    //     let x = Math.floor(Math.abs(Math.random() * 100));
    //     let y = Math.floor(Math.abs(Math.random() * 100));
    //     let z = Math.sqrt(x * x + y * y);

    //     training.push([x, y]);
    //     testing.push(z);
    // }

    // trainingSet = tf.tensor(training);
    // validationSet = tf.tensor(testing);
}