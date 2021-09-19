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
	//@ts-ignore
	const socket = io();

	let model;

	let prediction;
	let confidence = 0;
	let oldPrediction;

	let recording = [];
	let videoState = "stopped";
	let videoStartTime = 0;

	let message = "";
	let timeout = 2000;
	$: if (message) {
		let m = message;
		setTimeout(() => {
			if (m !== message) return;
			message = undefined;
		}, timeout);
	}

	function sendMessage() {
		if (videoState === "recording") {
			videoState = "stopped";

			message = "Message Send";
			socket.send("message", message);
		}
	}

	function startRecording() {
		if (videoState === "stopped") {
			videoState = "recording";
			videoStartTime = Date.now();
			message = "Recording Started";
		}
	}

	function handlePose(pose) {
		if (pose === "lmrm") {
			if (videoState === "stopped") {
				startRecording();
			}
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

	function handleVoice(sentence: any) {
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
				cancelMessage();
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
				.sort((a, b) => b.amount - a.amount);
			oldPrediction = prediction;
			prediction = res[0];
			console.log(prediction.id, prediction.amount);
			if (
				oldPrediction &&
				oldPrediction.id === prediction.id &&
				prediction.amount > -500
			) {
				confidence++;
				if (confidence > 30) {
					handlePose(prediction.id);
				}
			} else {
				confidence = 0;
			}
		} else {
			confidence = 0;
		}
	}

	function handleKeyDown(ev) {
		if (ev.key === " ") {
			socket.send("message", { test: true });
		}
	}

	onMount(async () => {
		let stream;

		socket.on("message", () => {
			message = "Received a Message";
			timeout = 10000;
			setTimeout(() => {
				timeout = 2000;
			});
		});

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

<svelte:window on:keydown={handleKeyDown} />

<div class="inner-wrapper">
	<!--<pre>
    <code>
      {#each recording.slice(Math.max(recording.length - 5, 1)) as step}
        <p>({step.type}) {step.time}ms </p>
      {/each}
    </code>
  </pre>-->
	<video bind:this={video} width="600" height="480">
		<track kind="captions" />
	</video>
	<p>{videoState}{prediction ? ` | ${prediction.id}` : ""}</p>
	<PoseDisplay {pose} />

	{#if message}
		<div class="message-wrapper">
			<p>{message}</p>
		</div>
	{/if}
</div>

<style>
	:global(body) {
		overflow: hidden;
	}

	.message-wrapper {
		position: fixed;
		left: 50%;
		bottom: 50%;
		transform: translateX(-50%) translateY(50%);
		padding: 1em;
		background-color: white;
	}

	.message-wrapper > p {
		width: max-content;
		margin: 0;
		color: black;
		font-size: 2em;
	}

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
		left: 10px;
	}

	:global(svg) {
		position: absolute;
		left: 0px;
		height: 100vh;
		width: 100vw;
	}
</style>
