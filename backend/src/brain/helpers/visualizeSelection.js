import tf from "@tensorflow/tfjs";

export default function visualizeSelection(prediction) {
  let arrayPrediction = [];

  for (let i = 0; i < prediction.strides; i++) {
    let a = prediction.arraySync()[i];
    arrayPrediction.push(a);
  }

  let correctGuesses = 0;
  let finalArray = [];

  for (let i = 0; i < arrayPrediction.length; i++) {
    let finalRow = [];
    let currentBestScore = 0;
    let indexBestScore = 0;
    for (let j = 0; j < arrayPrediction[i].length; j++) {
      if (arrayPrediction[i][j] > currentBestScore) {
        currentBestScore = arrayPrediction[i][j];
        indexBestScore = j;
      }
    }
    for (let j = 0; j < arrayPrediction.length; j++) {
      if (j == indexBestScore) {
        finalRow.push(1);
      } else finalRow.push(0);
    }

    if (finalRow[i] == 1) {
      correctGuesses++;
    }

    finalArray.push(finalRow);
  }

  finalArray.forEach((row, y) =>
    console.log(
      row
        .map((cell, x) => {
          if (cell && x == y) {
            return "\x1b[42m 1";
          } else if (cell) {
            return "\x1b[41m 1";
          }
          return "\x1b[0m 0";
        })
        .join(" ") + "\x1b[0m"
    )
  );

  let finalTensor = tf.tensor(finalArray);
  //finalTensor.print();
  console.log("Correct Guesses: " + correctGuesses);
}
