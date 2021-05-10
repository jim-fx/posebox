<script lang="ts">
  import { decompressPose, mapNormalizedToAbsolut } from "@poser/skelly";
  import type { RawPose } from "@poser/types";

  export let pose;
  $: _pose =
    pose && (decompressPose(mapNormalizedToAbsolut(pose, 600, 480)) as RawPose);

  function dist2D(p1, p2) {
    return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
  }

  $: eyeDist = _pose ? dist2D(_pose.leftEye, _pose.rightEye) : 0;
</script>

<svg width="640" height="480" viewBox="0 0 640 480">
  {#if _pose}
    <circle id="head" cx={_pose.nose.x} cy={_pose.nose.y} r={eyeDist} />

    <g id="hands">
      <circle cx={_pose.rightWrist.x} cy={_pose.rightWrist.y} r="16" />
      <circle cx={_pose.leftWrist.x} cy={_pose.leftWrist.y} r="16" />
    </g>

    <line
      x1={_pose.leftWrist.x}
      y1={_pose.leftWrist.y}
      x2={_pose.leftElbow.x}
      y2={_pose.leftElbow.y}
    />
    <line
      x1={_pose.leftElbow.x}
      y1={_pose.leftElbow.y}
      x2={_pose.leftShoulder.x}
      y2={_pose.leftShoulder.y}
    />

    <line
      x1={_pose.leftShoulder.x}
      y1={_pose.leftShoulder.y}
      x2={_pose.rightShoulder.x}
      y2={_pose.rightShoulder.y}
    />
    <line
      x1={_pose.rightShoulder.x}
      y1={_pose.rightShoulder.y}
      x2={_pose.rightElbow.x}
      y2={_pose.rightElbow.y}
    />
    <line
      x1={_pose.rightElbow.x}
      y1={_pose.rightElbow.y}
      x2={_pose.rightWrist.x}
      y2={_pose.rightWrist.y}
    />
    <line
      x1={_pose.rightShoulder.x}
      y1={_pose.rightShoulder.y}
      x2={_pose.rightHip.x}
      y2={_pose.rightHip.y}
    />
    <line
      x1={_pose.rightHip.x}
      y1={_pose.rightHip.y}
      x2={_pose.leftHip.x}
      y2={_pose.leftHip.y}
    />
    <line
      x1={_pose.leftHip.x}
      y1={_pose.leftHip.y}
      x2={_pose.leftShoulder.x}
      y2={_pose.leftShoulder.y}
    />
    <line
      x1={_pose.leftHip.x}
      y1={_pose.leftHip.y}
      x2={_pose.leftKnee.x}
      y2={_pose.leftKnee.y}
    />
    <line
      x1={_pose.leftKnee.x}
      y1={_pose.leftKnee.y}
      x2={_pose.leftAnkle.x}
      y2={_pose.leftAnkle.y}
    />
    <line
      x1={_pose.rightHip.x}
      y1={_pose.rightHip.y}
      x2={_pose.rightKnee.x}
      y2={_pose.rightKnee.y}
    />
    <line
      x1={_pose.rightKnee.x}
      y1={_pose.rightKnee.y}
      x2={_pose.rightAnkle.x}
      y2={_pose.rightAnkle.y}
    />
  {/if}
</svg>

<style>
  svg {
    pointer-events: none;
    /* width: 100%; */
    /* height: 100%; */
  }
  circle {
    fill: red;
    stroke: yellow;
    stroke-width: 5px;
  }

  line {
    stroke: yellow;
    stroke-width: 5px;
    stroke-linecap: round;
  }

  #hands > circle {
    fill: blue;
  }
</style>
