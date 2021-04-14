<script>
  import { onMount } from "svelte";
  import createPoseDetector from "./poseDetector.js";

  let video;
  let skeleton;

  let detector;
  let classifier;

  let p;

  function setup() {
    console.log(p);
    p.createCanvas(640, 480);
    video = p.createCapture(p.VIDEO);
    video.hide();
    detector = createPoseDetector(video);

    fetch("/training", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        Eyyyy: "false",
      }),
    });
  }

  function draw() {
    p.image(video, 0, 0);

    const { pose, skeleton } = detector.getPose();

    if (pose) {
      // let eyeR = pose.rightEye;
      // let eyeL = pose.leftEye;
      // let d = dist(eyeR.x, eyeR.y, eyeL.x, eyeL.y);
      // fill(255, 0, 0);
      // ellipse(pose.nose.x, pose.nose.y, d);
      // fill(0, 0, 255);
      // ellipse(pose.rightWrist.x, pose.rightWrist.y, 32);
      // ellipse(pose.leftWrist.x, pose.leftWrist.y, 32);

      for (let i = 0; i < pose.keypoints.length; i++) {
        let x = pose.keypoints[i].position.x;
        let y = pose.keypoints[i].position.y;
        p.fill(0, 255, 0);
        p.ellipse(x, y, 16, 16);
      }

      for (let i = 0; i < skeleton.length; i++) {
        let a = skeleton[i][0];
        let b = skeleton[i][1];
        p.strokeWeight(2);
        p.stroke(255);
        p.line(a.position.x, a.position.y, b.position.x, b.position.y);
      }
    }
  }

  onMount(() => {
    p = new p5((_p) => {
      _p.setup = setup;
      _p.draw = draw;
    });
    return () => {
      p.remove();
    };
  });
</script>
