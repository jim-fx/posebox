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
  let duration = 8;
  let currentTime = duration;

  //@ts-ignore
  window.poses = poses;

  const synth = window.speechSynthesis

  function speak(sentence) {
    const Kevin = new SpeechSynthesisUtterance(sentence)
    synth.speak(Kevin)
  }

  function startRecording() {
    setInterval(() => {
      if (currentIndex < poses.length) {
        if (currentTime == 0) {
          currentTime = duration;
          poses[currentIndex].pose = pose;
          currentIndex++;
          speak(poses[currentIndex].description);
        }
        currentTime--;
      }
    }, 1000);
  }

  onMount(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });

      video.srcObject = stream;

      detector = createPoseDetector(video, (p) => {
        pose = p;
      });

      video.play();
    } catch (error) {
      console.error(error);
    }
  });
</script>

<h3>Training Route</h3>

<svelte:window
  on:keydown={() => {
    startRecording();
  }}
/>

<div class="wrapper">
  <p style="font-size: larger;">{poses[currentIndex].description}</p>
  <p>{currentTime}</p>

  <video bind:this={video} width="600" height="480">
    <track kind="captions" />
  </video>

  <PoseDisplay {pose} />
</div>

<style>
  video {
    transform: translateX(-50%);
    position: absolute;
  }
</style>
