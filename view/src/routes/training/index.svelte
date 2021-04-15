<script lang="ts">
  import { onMount } from "svelte";
  import throttle from "../../helpers/throttle";
  import PoseDisplay from "../../components/PoseDisplay.svelte";
  import createPoseDetector from "../deploy/poseDetector";

  const poses = [
    {
      description: "T pose",
      id: "a",
      pose: {},
    },
    {
      description: "Mache ein O",
      id: "o",
      pose: {},
    },
  ];

  let video;
  let detector;
  let pose;
  let _pose;
  let currentIndex = 0;

  onMount(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });

      video.srcObject = stream;

      detector = createPoseDetector(
        video,
        throttle((p) => {
          pose = p;
        }, 2000)
      );

      video.play();
    } catch (error) {
      console.error(error);
    }
  });
</script>

<h3>Training Route</h3>

<svelte:window
  on:keydown={() => {
    console.log("---GOT TRAINING DATA---");
    console.log(poses[currentIndex].description);
    console.log(pose);
    console.log("-----------------------");
    currentIndex = (currentIndex + 1) % poses.length;
  }}
/>

<div class="wrapper">
  <p>{poses[currentIndex].description}</p>

  <video bind:this={video} width="600" height="480">
    <track kind="captions" />
  </video>

  <PoseDisplay {pose} />
</div>

<style>
</style>
