<script lang="ts">
  import { mapNormalizedToAbsolut, mapSkeleton } from "helpers";
  import P5 from "p5-svelte";

  export let pose;

  const sketch = (p5) => {
    p5.setup = () => {
      p5.createCanvas(600, 480);
    };

    p5.draw = () => {
      p5.clear();

      if (pose) {
        const _pose = mapSkeleton(mapNormalizedToAbsolut(pose, 600, 480));
        let eyeR = _pose.rightEye;
        let eyeL = _pose.leftEye;
        let d = p5.dist(eyeR.x, eyeR.y, eyeL.x, eyeL.y);
        p5.fill(255, 0, 0);
        p5.ellipse(_pose.nose.x, _pose.nose.y, d);

        p5.ellipse(_pose.nose.x, _pose.nose.y, d * 2);
        p5.fill(0, 0, 255);
        p5.ellipse(_pose.rightWrist.x, _pose.rightWrist.y, 32);
        p5.ellipse(_pose.leftWrist.x, _pose.leftWrist.y, 32);

        p5.stroke(255, 204, 0);
        p5.strokeWeight(5);

        p5.line(
          _pose.leftWrist.x,
          _pose.leftWrist.y,
          _pose.leftElbow.x,
          _pose.leftElbow.y
        );
        p5.line(
          _pose.leftElbow.x,
          _pose.leftElbow.y,
          _pose.leftShoulder.x,
          _pose.leftShoulder.y
        );
        p5.line(
          _pose.leftShoulder.x,
          _pose.leftShoulder.y,
          _pose.rightShoulder.x,
          _pose.rightShoulder.y
        );
        p5.line(
          _pose.rightShoulder.x,
          _pose.rightShoulder.y,
          _pose.rightElbow.x,
          _pose.rightElbow.y
        );
        p5.line(
          _pose.rightElbow.x,
          _pose.rightElbow.y,
          _pose.rightWrist.x,
          _pose.rightWrist.y
        );
        p5.line(
          _pose.rightShoulder.x,
          _pose.rightShoulder.y,
          _pose.rightHip.x,
          _pose.rightHip.y
        );
        p5.line(
          _pose.rightHip.x,
          _pose.rightHip.y,
          _pose.leftHip.x,
          _pose.leftHip.y
        );
        p5.line(
          _pose.leftHip.x,
          _pose.leftHip.y,
          _pose.leftShoulder.x,
          _pose.leftShoulder.y
        );
        p5.line(
          _pose.leftHip.x,
          _pose.leftHip.y,
          _pose.leftKnee.x,
          _pose.leftKnee.y
        );
        p5.line(
          _pose.leftHip.x,
          _pose.leftHip.y,
          _pose.leftAnkle.x,
          _pose.leftAnkle.y
        );
        p5.line(
          _pose.rightHip.x,
          _pose.rightHip.y,
          _pose.rightKnee.x,
          _pose.rightKnee.y
        );
        p5.line(
          _pose.rightKnee.x,
          _pose.rightKnee.y,
          _pose.rightAnkle.x,
          _pose.rightAnkle.y
        );
      }
    };
  };
</script>

<P5 {sketch} />
