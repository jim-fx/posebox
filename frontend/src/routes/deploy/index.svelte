<script lang="ts">
  import api from "@poser/api";
  import { BarChart, PoseDisplay } from "@poser/components";
  import type * as tf from "@tensorflow/tfjs";
  import { createPoseDetector, throttle } from "helpers";
  import { onMount } from "svelte";

  const _tf: typeof tf =
    //@ts-ignore
    "tf" in window ? window.tf : "ml5" in window && window.ml5.tf;

  let video;
  let skeleton;

  let detector;
  let classifier;

  let model: tf.Sequential;

  $: prediction =
    model && pose && (model.predict(_tf.tensor2d(pose, [1, 34])) as tf.Tensor);

  let allPoses;
  api.getPoses().then((poses) => {
    allPoses = poses;
  });

  $: chartData =
    prediction &&
    allPoses &&
    prediction.arraySync()[0].map((v, i) => {
      return {
        id: allPoses[i].id,
        amount: v,
      };
    });

  $: probablePose =
    chartData && [...chartData].sort((a, b) => b.amount - a.amount)[0];

  let pose;
  let remotePoses = {};

  onMount(async () => {
    // const video = document.createElement("video");

    const socket = io();

    socket.on("pose", function (msg) {
      remotePoses = { ...remotePoses, [msg.id]: msg.pose };
    });

    socket.on("connect", () => {
      console.log("socket connected");
    });

    model = (await _tf.loadLayersModel(
      "/brain/model/model.json"
    )) as tf.Sequential;

    const sendPose = throttle((p) => {
      socket.emit("pose", {
        id: socket.id,
        pose: p,
      });
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

<section>
  <video bind:this={video} width="600" height="480">
    <track kind="captions" />
  </video>

  <PoseDisplay {pose} />
</section>

<section class="chart">
  {#if probablePose}
    Probably: {probablePose.id}
  {/if}
  {#if chartData}
    <BarChart data={chartData} />
  {/if}
</section>

<!-- {#each Object.values(remotePoses) as _pose}
  <PoseDisplay pose={_pose} />
{/each} -->
<style>
  .chart {
    max-width: 500px;
  }

  video {
    /* display: none; */
    border: solid thin red;
  }

  section {
    margin: 100px auto;
  }
</style>
