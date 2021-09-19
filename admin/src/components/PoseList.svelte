<script lang="ts">
	import api from "@poser/api";
	import type { Pose } from "@poser/types";
	import PoseVote from "../components/PoseVote.svelte";
	import Visibility from "../components/Visibility.svelte";

	export let status;
	export let poses: Pose[];

	let poseGroups: { id: string; description?: string; poses: Pose[] }[] = [];

	let currentPoseIndex = 0;

	let offsetCurrentPose = 0;
	let isLoading = false;
	async function loadMorePoses() {
		if (isLoading) return;
		isLoading = true;
		const _poses = await api.getTrainingPoses({
			amount: 50,
			id: poses[currentPoseIndex].id,
			offset: offsetCurrentPose,
			verified: null,
		});

		if (poseGroups[currentPoseIndex]) {
			poseGroups[currentPoseIndex].poses.push(..._poses);
		} else {
			poseGroups[currentPoseIndex] = {
				...poses[currentPoseIndex],
				poses: _poses,
			};
		}

		poseGroups = poseGroups;

		offsetCurrentPose += 50;

		if (_poses.length < 50) {
			currentPoseIndex++;
			offsetCurrentPose = 0;
		}

		setTimeout(() => {
			isLoading = false;
		}, 200);
	}
	loadMorePoses();

	let isSubmitting = false;
	async function submitVerified() {
		if (isSubmitting) return;
		isSubmitting = true;

		const store = { ...verifiedStore };
		verifiedStore = {};

		const body = Object.keys(store).map((id) => {
			return {
				id,
				verified: store[id],
			};
		});

		await api.put("/data/verify", body);

		setTimeout(() => {
			isSubmitting = false;
		}, 200);
	}

	let verifiedStore = {};
	let timeout;
	function handleVerify(poseId, isVerified) {
		verifiedStore[poseId] = isVerified;
		if (Object.keys(verifiedStore).length > 2) {
			submitVerified();
		}

		if (timeout) clearTimeout(timeout);
		timeout = setTimeout(submitVerified, 10000);
	}
</script>

{#each poseGroups as poseGroup}
	<Visibility let:percent>
		<div class="pose-preview">
			<!-- <p>{poseGroup.id}</p> -->
			<p>
				{poseGroup.description} ({Math.floor(
					status.verified[poseGroup.id] * 100
				)}%) verified
			</p>
		</div>
		<div class="pose-group-wrapper">
			{#if poseGroup.poses.length === 0}
				<p>All done with {poseGroup.id}</p>
			{/if}

			{#each poseGroup.poses as pose}
				<PoseVote
					{pose}
					on:verify={({ detail: verified }) => handleVerify(pose._id, verified)}
				/>
			{/each}
		</div>
	</Visibility>
{/each}

{#if isLoading}
	<span>Loading ...</span>
{:else}
	<Visibility let:percent>
		<div class="loading-wrapper">
			<p>{percent}</p>
			{#if percent > 0}
				{loadMorePoses()}
			{/if}
		</div>
	</Visibility>
{/if}

{#if isSubmitting}
	<div class="submit-wrapper">Submitting...</div>
{/if}

<style>
	.submit-wrapper {
		position: fixed;
		bottom: 0px;
		left: 0px;
	}

	.pose-preview {
		position: sticky;
		top: 0px;
		left: -100%;
		background: white;
		color: black;
		z-index: 99;
	}

	.loading-wrapper {
		height: 50vh;
		margin-top: -25vh;
	}

	.pose-group-wrapper {
		display: flex;
		flex-wrap: wrap;
	}
</style>
