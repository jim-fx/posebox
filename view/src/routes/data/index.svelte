<script lang="ts">
    import { onMount } from "svelte";
    import PoseDisplay from "../../components/PoseDisplay.svelte";
    import createPoseDetector from "../deploy/poseDetector";
    import P5 from "p5-svelte";
    import {
        mapSkeleton,
        mapNormalizedToAbsolut,
        throttle,
    } from "../../helpers";

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
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
            });

            video.srcObject = stream;

            detector = createPoseDetector(video, (p) => {
                pose = p;
            });

            video.play();
        } catch (error) {
            console.error(error);
        }
    });

    const sketch = (p5) => {
        let skeleton;
        p5.setup = () => {
            p5.createCanvas(640, 480);
        };

        p5.draw = () => {
            p5.clear();

            if (pose) {
                const _pose = mapSkeleton(
                    mapNormalizedToAbsolut(pose, 640, 480)
                );
                let eyeR = _pose.rightEye;
                let eyeL = _pose.leftEye;
                let d = p5.dist(eyeR.x, eyeR.y, eyeL.x, eyeL.y);
                p5.fill(255, 0, 0);
                p5.ellipse(_pose.nose.x, _pose.nose.y, d);
                p5.ellipse(_pose.nose.x, _pose.nose.y, d*2);                p5.fill(0, 0, 255);
                p5.ellipse(_pose.rightWrist.x, _pose.rightWrist.y, 32);
                p5.ellipse(_pose.leftWrist.x, _pose.leftWrist.y, 32);

                p5.stroke(255, 204, 0);
                p5.strokeWeight(5);

                p5.line(
                    _pose.leftWrist.x,
                    _pose.leftWrist.y,
                    _pose.leftElbow.x,
                    _pose.leftElbow.y
                );
                p5.line(
                    _pose.leftElbow.x,
                    _pose.leftElbow.y,
                    _pose.leftShoulder.x,
                    _pose.leftShoulder.y
                );
                p5.line(
                    _pose.leftShoulder.x,
                    _pose.leftShoulder.y,
                    _pose.rightShoulder.x,
                    _pose.rightShoulder.y
                );
                p5.line(
                    _pose.rightShoulder.x,
                    _pose.rightShoulder.y,
                    _pose.rightElbow.x,
                    _pose.rightElbow.y
                );
                p5.line(
                    _pose.rightElbow.x,
                    _pose.rightElbow.y,
                    _pose.rightWrist.x,
                    _pose.rightWrist.y
                );
                p5.line(
                    _pose.rightShoulder.x,
                    _pose.rightShoulder.y,
                    _pose.rightHip.x,
                    _pose.rightHip.y
                );
                p5.line(
                    _pose.rightHip.x,
                    _pose.rightHip.y,
                    _pose.leftHip.x,
                    _pose.leftHip.y
                );
                p5.line(
                    _pose.leftHip.x,
                    _pose.leftHip.y,
                    _pose.leftShoulder.x,
                    _pose.leftShoulder.y
                );
                p5.line(
                    _pose.leftHip.x,
                    _pose.leftHip.y,
                    _pose.leftKnee.x,
                    _pose.leftKnee.y
                );
                p5.line(
                    _pose.leftHip.x,
                    _pose.leftHip.y,
                    _pose.leftAnkle.x,
                    _pose.leftAnkle.y
                );
                p5.line(
                    _pose.rightHip.x,
                    _pose.rightHip.y,
                    _pose.rightKnee.x,
                    _pose.rightKnee.y
                );
                p5.line(
                    _pose.rightKnee.x,
                    _pose.rightKnee.y,
                    _pose.rightAnkle.x,
                    _pose.rightAnkle.y
                );
            }
        };
    };
</script>

<P5 {sketch} />

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

    <!-- <PoseDisplay {pose} /> -->
</div>

<style>
    video {
        transform: translateX(-50%);
        position: absolute;
        width: 600;
        height: 480;
    }
</style>
