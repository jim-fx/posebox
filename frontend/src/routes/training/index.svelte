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
      description: "Links Mitte rechts Mitte",
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

  const synth = window.speechSynthesis;

  function speak(sentence) {
    const Audio = new SpeechSynthesisUtterance(sentence);
    synth.speak(Audio);
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

  let poseNet;
  let skeleton;

  function setup() {
    createCanvas(640, 480);
    video = createCapture(VIDEO);
    video.hide();
    poseNet = ml5.poseNet(video, modelLoaded);
    poseNet.on("pose", gotPoses);
  }

  function gotPoses(poses) {
    //console.log(poses);
    if (poses.length > 0) {
      pose = poses[0].pose;
      skeleton = poses[0].skeleton;
    }
  }

  function modelLoaded() {
    console.log("poseNet ready");
  }

  function draw() {
    image(video, 0, 0);

    if (pose) {
      let eyeR = pose.rightEye;
      let eyeL = pose.leftEye;
      let d = dist(eyeR.x, eyeR.y, eyeL.x, eyeL.y);
      fill(255, 0, 0);
      ellipse(pose.nose.x, pose.nose.y, d);
      fill(0, 0, 255);
      ellipse(pose.rightWrist.x, pose.rightWrist.y, 32);
      ellipse(pose.leftWrist.x, pose.leftWrist.y, 32);

      for (let i = 0; i < pose.keypoints.length; i++) {
        let x = pose.keypoints[i].position.x;
        let y = pose.keypoints[i].position.y;
        fill(0, 255, 0);
        ellipse(x, y, 16, 16);
      }

      for (let i = 0; i < skeleton.length; i++) {
        let a = skeleton[i][0];
        let b = skeleton[i][1];
        strokeWeight(2);
        stroke(255);
        line(a.position.x, a.position.y, b.position.x, b.position.y);
      }
    }
  }
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
    width: 600;
    height: 480;
  }
</style>
