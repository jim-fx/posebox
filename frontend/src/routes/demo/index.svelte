<script lang="ts">
  import api from "@poser/api";
  import { PoseDisplay } from "@poser/components";
  import type { Pose } from "@poser/types";
  import type * as tf from "@tensorflow/tfjs";
  import { normalizePose } from "@poser/skelly";
  import {
    createPoseDetector,
    createVoiceDetector,
    getTf,
    throttle,
  } from "helpers";
  import { onMount } from "svelte";

  const _tf = getTf();

  let video;
  let detector;
  let voice;
  let pose;
  let currentText;
  let allPoses: Pose[];

  let model;

  let prediction;
  let confidence = 0;
  let oldPrediction;

  let recording = [];
  let videoState = "stopped";
  let videoStartTime = 0;

  function sendMessage() {
    if (videoState === "recording") {
      videoState = "stopped";

      if (confirm("Do you want to send the message?")) {
        console.log(recording);
      }
    }
  }

  function startRecording() {
    if (videoState === "stopped") {
      videoState = "recording";
      videoStartTime = Date.now();
      alert("start");
    }
  }

  function handlePose(pose) {
    if (pose === "lmrm" && videoState === "stopped") {
      startRecording();
    }

    if (pose === "x" && videoState === "recording") {
      cancelMessage();
    }

    if (pose === "ok" && videoState === "recording") {
      sendMessage();
    }
  }

  function cancelMessage() {
    recording = [];
    videoState = "stopped";
  }

  function handleVoice(sentence) {
    if (videoState === "recording") {
      recording.push({
        type: "voice",
        content: sentence,
        time: Date.now() - videoStartTime,
      });
      recording = recording;
    }
  }

  const handleRunningPose = throttle((pose) => {
    if (videoState === "recording") {
      recording.push({
        type: "pose",
        content: pose,
        time: Date.now() - videoStartTime,
      });
      recording = recording;

      if (Date.now() - videoStartTime > 30000) {
        stopRecording();
      }
    }
  }, 50);

  function predict() {
    const result =
      model &&
      allPoses &&
      pose &&
      (model.predict(_tf.tensor2d(normalizePose(pose), [1, 34])) as tf.Tensor);

    if (result) {
      const res = result
        .arraySync()[0]
        .map((v, i) => {
          return {
            id: allPoses[i].id,
            amount: v,
          };
        })
        .sort((a, b) => a.amount - b.amount);
      oldPrediction = prediction;
      prediction = res[0];
      if (oldPrediction && oldPrediction.id === prediction.id) {
        confidence++;
        if (confidence > 30) {
          handlePose(prediction.id);
        }
      } else {
        confidence = 0;
      }
    }
  }

  onMount(async () => {
    let stream;

    voice = createVoiceDetector((res, isFinal) => {
      if (isFinal) {
        handleVoice(res);
      }
    });

    try {
      stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });

      video.srcObject = stream;

      detector = createPoseDetector(video, (p) => {
        pose = p;
        predict();
        handleRunningPose(p);
      });

      video.play();
    } catch (error) {
      console.error(error);
    }

    allPoses = await api.getPoses();

    model = (await _tf.loadLayersModel(
      "/brain/model/model.json"
    )) as tf.Sequential;

    return () => {
      video.stop();
      stream.stop();
      voice.stop();
    };
  });
</script>

<div class="inner-wrapper">
  <pre>
    <code>
      {#each recording.slice(Math.max(recording.length - 5, 1)) as step}
        <p>({step.type}) {step.time}ms </p>
      {/each}
    </code>
  </pre>
  <video bind:this={video} width="600" height="480">
    <track kind="captions" />
  </video>
  <p>{videoState}</p>
  <PoseDisplay {pose} />
  {#if prediction}
    <p>{prediction.id} {confidence}</p>
    <p>{prediction.amount}</p>
  {/if}
</div>

<style>
  pre {
    position: absolute;
  }

  :global(nav) {
    opacity: 0.05;
  }

  .inner-wrapper {
    position: absolute;
    width: 100vw;
    height: 100vh;
    top: 0px;
    left: 0px;
  }

  video {
    display: none;
  }

  p {
    /* position: absolute; */
    color: white;
    top: 0px;
  }

  :global(svg) {
    position: absolute;
    left: 0px;
    height: 100vh;
    width: 100vw;
  }
</style>
