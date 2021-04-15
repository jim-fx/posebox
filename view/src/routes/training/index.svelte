<script lang="ts">
  import { onMount } from "svelte";
  import throttle from "../../helpers/throttle";
  import PoseDisplay from "../../components/PoseDisplay.svelte";
  import createPoseDetector from "../deploy/poseDetector";

  const poses = [
    {
      description: "X Pose (Verschränkte Arme)",
      id: "o",
      pose: {},
    },
    {
      description: "OK (Arme um den Kopf)",
      id: "o",
      pose: {},
    },
    {
      description: "Beten/bitte",
      id: "o",
      pose: {},
    },
    {
      description: "Hände in den Himmel",
      id: "o",
      pose: {},
    },
    {
      description: "Boxer Pose",
      id: "o",
      pose: {},
    },
    {
      description: "Links Hoch rechts Hoch",
      id: "o",
      pose: {},
    },
    {
      description: "Links Hoch rechts Mitte",
      id: "o",
      pose: {},
    },
    {
      description: "Links Hoch rechts Runter",
      id: "o",
      pose: {},
    },
    {
      description: "Links Mitte rechts Hoch",
      id: "o",
      pose: {},
    },
    {
      description: "Links Mitee rechts Mitte",
      id: "o",
      pose: {},
    },
    {
      description: "Links Mitte rechts Unten",
      id: "o",
      pose: {},
    },
    {
      description: "Links Unten rechts Hoch",
      id: "o",
      pose: {},
    },
    {
      description: "Links Unten rechts Mitte",
      id: "o",
      pose: {},
    },
    {
      description: "Links Unten rechts Unten",
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
          console.log("nächste pose " ,poses[currentIndex].description)
          console.log(p);
          pose = p;
        }, 10000)
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
