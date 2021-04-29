<script lang="ts">
  import { PoseDisplay } from "@poser/components";
  import { createPoseDetector, throttle } from "helpers";
  import { onMount } from "svelte";

  let video;
  let skeleton;

  let detector;
  let classifier;

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

<video bind:this={video} width="600" height="480">
  <track kind="captions" />
</video>

<PoseDisplay {pose} />

{#each Object.values(remotePoses) as _pose}
  <PoseDisplay pose={_pose} />
{/each}

<style>
  video {
    /* display: none; */
    border: solid thin red;
  }
</style>
