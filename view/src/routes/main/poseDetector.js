export default function createPoseDetector(video) {
  let pose;
  function modelLoaded() {
    console.log("poseNet ready");
  }

  const poseNet = ml5.poseNet(video, modelLoaded);
  poseNet.on("pose", (_pose) => {
    pose = _pose;
  });

  return {
    getPose() {
      if (pose) {
        return pose[0];
      }
      return {};
    },
  };
}
