<script lang="ts">
    import { onMount } from "svelte";
    import PoseDisplay from "../../components/PoseDisplay.svelte";
    import createPoseDetector from "../deploy/poseDetector";
    import {
        mapSkeleton,
        mapNormalizedToAbsolut,
        throttle,
    } from "../../helpers";

    let video;
    let detector;
    let pose;
    let _pose;

    const synth = window.speechSynthesis;
    let poses = [];

    function speak(sentence) {
        const Audio = new SpeechSynthesisUtterance(sentence);
        Audio.lang = "de-DE";
        synth.speak(Audio);
    }

    let currentIndex = 0;
    let duration = 8;
    let holdPoseDuration = 3;
    let currentTime = duration + holdPoseDuration;
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
                    currentTime = duration + holdPoseDuration;
                    poses[currentIndex].pose = pose;
                    currentIndex++;
                    speak(poses[currentIndex].description);
                }
                currentTime--;
            }
        }, 1000);
    }

    const sendPoses = () => {
        fetch("/trainingData/" + poses[currentIndex].id, {
            method: "POST",
            headers: {"Content-Type" : "application/json"},
            body: JSON.stringify(savedPoses),
        }).then((response) => {
            console.log(response);
        });
    };

    const savePoses = throttle((savePose) => {
        savedPoses.push(savePose);
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
    {/if}

    {#if poses.length}
        <p style="font-size: larger;">{poses[currentIndex].description}</p>
    {/if}

    {#if currentTime < holdPoseDuration}
        <p>HOLD {currentTime}</p>
    {:else}
        <p>Prepare Next Position {currentTime - holdPoseDuration}</p>
    {/if}

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
