import type ml5 from "ml5";
import { compressPose } from "@poser/skelly"

export default function createPoseDetector(video, cb) {
  let pose;

  const poseNet = ml5.poseNet(video, () => {
    console.log("poseNet ready");
  });

  const { width, height } = video;

  poseNet.on("pose", (_pose) => {
    if (_pose[0]) {
      pose = _pose[0].pose;

      //Normalize coordinates
      pose.keypoints = pose.keypoints.map((p) => {
        p.position.x /= width;
        p.position.y /= height;
        return p;
      });

      pose = pose.keypoints.map((p) => {
        return {
          part: p.part,
          x: p.position.x,
          y: p.position.y,
        };
      });

      pose = compressPose(pose);

      cb && cb(pose);
    }
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
