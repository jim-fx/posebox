export default createPoseClassifier = () => {
  const brain = ml5.neuralNetwork({
    inputs: 34,
    outputs: 4,
    task: "classification",
    debug: true,
  });

  function classifyPose(pose) {
    if (pose) {
      let inputs = [];
      for (let i = 0; i < pose.keypoints.length; i++) {
        let x = pose.keypoints[i].position.x;
        let y = pose.keypoints[i].position.y;
        inputs.push(x);
        inputs.push(y);
      }
      brain.classify(inputs, gotResult);
    } else {
      setTimeout(classifyPose, 100);
    }
  }

  return {
    classify: classifyPose,
  };
};
