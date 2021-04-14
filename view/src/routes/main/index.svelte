<script lang="ts">
  import { onMount } from "svelte";
  import createPoseDetector from "./poseDetector.js";
  import PoseDisplay from "../../components/PoseDisplay.svelte";
  import throttle from "../../../helpers/throttle";

  let video;
  let skeleton;

  let detector;
  let classifier;

  let pose;
  let pose2;

  // let p;

  // function setup() {
  //   console.log(p);
  //   p.createCanvas(640, 480);

  //   video = p.createCapture(p.VIDEO);
  //   video.hide();
  //   detector = createPoseDetector(video);

  //   fetch("/training", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({
  //       Eyyyy: "false",
  //     }),
  //   });
  // }

  onMount(async () => {
    // const video = document.createElement("video");

    const socket = io();

    socket.on("pose", function (msg) {
      pose2 = msg;
    });

    socket.on("connect", () => {
      console.log("socket connected");
    });

    const sendPose = throttle((p) => {
      socket.emit("pose", p);
    }, 50);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });

      video.srcObject = stream;

      detector = createPoseDetector(video, (p) => {
        pose = p;
        sendPose(p);
      });

      video.play();
    } catch (error) {}
  });
</script>

<video bind:this={video} width="600" height="480">
  <track kind="captions" />
</video>

<PoseDisplay {pose} />
<PoseDisplay pose={pose2} />

<style>
  video {
    /* display: none; */
    border: solid thin red;
  }
</style>
