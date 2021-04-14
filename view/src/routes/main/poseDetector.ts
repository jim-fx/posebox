import ml5 from "ml5";

export default function createPoseDetector(video, cb) {
  let pose;

  const poseNet = ml5.poseNet(video, () => {
    console.log("poseNet ready");
  });

  const { width, height } = video;

  poseNet.on("pose", (_pose) => {
    pose = _pose[0].pose;

    //Normalize coordinates
    pose.keypoints = pose.keypoints.map((p) => {
      p.position.x /= width;
      p.position.y /= height;
      return p;
    });

    cb && cb(pose);
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
