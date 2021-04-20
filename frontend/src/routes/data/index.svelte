<script lang="ts">
  import { createPoseDetector, speak, throttle } from "helpers";
  import { onMount } from "svelte";
  import PoseDisplay from "../../components/PoseDisplay.svelte";
  import { compressPose } from "@poser/skelly";

  let video;
  let detector;
  let pose;

  let poses = [];

  let currentIndex = 0;
  let prepareDuration = 5;
  let holdPoseDuration = 5;
  let currentTime = prepareDuration + holdPoseDuration;
  let interval;
  let savedPoses = [];

  function startRecording() {
    if (interval) {
      return;
    }
    interval = setInterval(() => {
      if (currentIndex < poses.length) {
        if (currentTime == 0) {
          sendPoses();
          savedPoses = [];
          currentTime = prepareDuration + holdPoseDuration;
          poses[currentIndex].pose = pose;
          currentIndex++;
          speak(poses[currentIndex].description);
        }
        currentTime--;
      }   
    }, 1000);
  }

  const sendPoses = () => {
    if (savedPoses.length) {
      console.log(savedPoses);
      fetch("/trainingData", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(savedPoses),
      }).then((response) => {});
    }
  };

  const savePoses = throttle((_pose) => {
    let temp = {
      id: poses[currentIndex].id,
      pose: _pose,
    };
    savedPoses.push(temp);
  }, 200);

  onMount(async () => {
    const response = await fetch("/poses");

    poses = await response.json();

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });

      video.srcObject = stream;

      detector = createPoseDetector(video, (p) => {
        if (currentTime < holdPoseDuration) {
          savePoses(p);
        }
        pose = p;
      });

      video.play();
    } catch (error) {
      console.error(error);
    }
  });
</script>

<h3>Training Route</h3>

<div class="wrapper">
  {#if !interval}
    <button
      on:click={() => {
        startRecording();
      }}>Starte Aufnahme Session</button
    >
  {:else}
    {#if poses.length}
      <p style="font-size: larger;">{poses[currentIndex].description}</p>
    {/if}

    {#if currentTime < holdPoseDuration}
      <p>HOLD {currentTime + 1}</p>
    {:else}
      <p>Prepare Next Position {currentTime - holdPoseDuration + 1}</p>
    {/if}
  {/if}

  <div class="inner-wrapper">
    <div id="preview">
      <video bind:this={video} width="600" height="480">
        <track kind="captions" />
      </video>
      <div id="bodyTracer">
        <PoseDisplay {pose} />
      </div>
    </div>

    <div id="examplePose">
      {#if poses.length}
        <PoseDisplay pose={poses[currentIndex].pose} />
      {/if}
    </div>
  </div>
</div>

<div
  id="progress-bar"
  style={`width: ${(currentTime / holdPoseDuration) * 100}%;`}
/>

<style>
  button {
    width: fit-content;
    align-self: center;
    margin: 0 auto;
  }

  #progress-bar {
    position: fixed;
    bottom: 0px;
    left: 0px;
    height: 50px;
    background-color: white;
    transition: width 1s linear;
  }

  #preview {
    position: relative;
  }

  #bodyTracer {
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0.5;
  }

  .wrapper {
    display: grid;
    justify-content: center;
  }

  .inner-wrapper {
    margin: 0 auto;
    display: grid;
    grid-template-columns: min-content min-content;
  }
</style>
