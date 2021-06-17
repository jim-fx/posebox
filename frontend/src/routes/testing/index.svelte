<script lang="ts">
  import { PoseDisplay } from "@poser/components";
  import { createPoseDetector } from "helpers";
  import { onMount } from "svelte";

  let video;
  let pose;

  let showSkeleton = true;
  let isRecording = false;

  function startRecording() {
    isRecording = !isRecording;
  }

  function handleKey({ code }) {
    if (code === "KeyM") {
      showSkeleton = !showSkeleton;
    }
    if (code === "Space") {
      startRecording();
    }
  }

  onMount(async () => {
    let stream;

    try {
      stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });

      video.srcObject = stream;

      createPoseDetector(video, (p) => {
        pose = p;
      });

      video.play();
    } catch (error) {
      console.error(error);
    }

    return () => {
      video.stop();
      stream.stop();
    };
  });
</script>

<svelte:window on:keydown={handleKey} />

<div class="wrapper" class:isRecording>
  <video
    bind:this={video}
    class:visible={!showSkeleton}
    width="600"
    height="480"
  >
    <track kind="captions" />
  </video>

  <div id="bodyTracer" class:visible={showSkeleton}>
    <PoseDisplay {pose} />
  </div>
</div>

<style>
  :global(body) {
    overflow: hidden;
  }

  .wrapper > video,
  .wrapper > #bodyTracer {
    visibility: hidden;
    position: absolute;
  }

  .wrapper > video.visible,
  .wrapper > #bodyTracer.visible {
    position: relative !important;
    visibility: visible !important;
  }

  #bodyTracer {
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0.5;
  }

  .wrapper {
    position: absolute;
    display: grid;
    justify-content: center;
    align-items: center;
    width: 100vw;
    height: 100vh;
    top: 0px;
    left: 0px;
  }

  .isRecording {
    background-color: #00ff0045;
  }
</style>
