<script lang="ts">
  import api from "@poser/api";
  import { PoseDisplay } from "@poser/components";
  import type { Pose } from "@poser/types";
  import type * as tf from "@tensorflow/tfjs";
  import { createPoseDetector, createVoiceDetector, getTf } from "helpers";
  import { onMount } from "svelte";

  const _tf = getTf();

  let video;
  let detector;
  let voice = createVoiceDetector((res, isFinal) => {
    console.log(res, isFinal);
  });
  let pose;
  let currentText;
  let allPoses: Pose[];

  let model;

  let prediction;
  let confidence = 0;
  let oldPrediction;

  function stopRecording() {}

  function startRecording() {}

  function handlePose(pose) {
    console.log(pose);
  }

  function handleVoice() {}

  function predict() {
    const result =
      model &&
      allPoses &&
      pose &&
      (model.predict(_tf.tensor2d(pose, [1, 34])) as tf.Tensor);

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
        if (confidence < 30) {
          confidence++;
          handlePose(prediction.id);
        }
      } else {
        confidence = 0;
      }
    }
  }

  onMount(async () => {
    let stream;

    try {
      stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });

      video.srcObject = stream;

      detector = createPoseDetector(video, (p) => {
        pose = p;
        predict();
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
  <video bind:this={video} width="600" height="480">
    <track kind="captions" />
  </video>
  <PoseDisplay {pose} />

  {#if prediction}
    <p>{prediction.id} {confidence}</p>
  {/if}
</div>

<style>
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
    position: absolute;
    color: white;
    top: 0px;
  }

  :global(svg) {
    height: 100vh;
    width: 100vw;
  }
</style>
