<script lang="ts">
  import api from "@poser/api";
  import { PoseDisplay } from "@poser/components";

  const pageSize = 5;
  let index = 0;
  let isSubmitting = false;

  let activePose = "x";
  const wrappers: HTMLDivElement[] = [];

  $: posesPromise =
    index > -1 &&
    activePose &&
    api.getTrainingPoses({
      amount: pageSize,
      offset: index * pageSize,
      verified: null,
      id: activePose,
    });

  $: activePosePromise = api.get(`/data/status/${activePose}`);

  const posePromise = api.getPoses();

  posePromise.then((poses) => {
    activePose = poses[0].id;
  });

  async function handleSubmit() {
    isSubmitting = true;

    const body = Object.keys(accepted).map((key) => {
      return {
        id: key,
        verified: accepted[key],
      };
    });

    console.log(body);

    await api.post("/data/verify", body);
    index++;
    accepted = {};
    isSubmitting = false;
  }

  const allPosePromise = api.get("/data/status");

  let y = 0;
  let accepted = {};
  function setAccepted(id, type, i) {
    if (accepted[id] === type) {
      delete accepted[id];
    } else {
      accepted[id] = type;
    }
    accepted = accepted;

    if (wrappers[i + 1]) {
      wrappers[i + 1].scrollIntoView({ behavior: "smooth" });
    }
  }
</script>

<svelte:window bind:scrollY={y} />

{#await allPosePromise then status}
  {#if status.totalVerified < 1}
    <div class="sub-nav">
      {#await posePromise}
        <h3>Loading</h3>
      {:then poses}
        {#each poses as pose}
          <div
            class:active={activePose === pose.id}
            on:click={() => {
              activePose = pose.id;
            }}
          >
            {pose.id}
          </div>
        {/each}

        {#if poses.find((p) => p.id === activePose)}
          <p class="description">
            {poses.find((p) => p.id === activePose).description}
          </p>
        {/if}
      {/await}
    </div>

    {#if isSubmitting}
      <p>Submitting...</p>
    {:else if posesPromise}
      {#await posesPromise}
        <p>Loading</p>
      {:then poses}
        {#if !poses.length}
          <p>All poses verified</p>
        {/if}

        {#each poses as pose, i}
          <div
            class="pose-wrapper"
            bind:this={wrappers[i]}
            class:rejected={accepted[pose._id] === false}
            class:accepted={accepted[pose._id] === true}
          >
            <div
              class="accept"
              on:click={() => setAccepted(pose._id, true, i)}
            />
            <div
              class="reject"
              on:click={() => setAccepted(pose._id, false, i)}
            />
            <PoseDisplay pose={pose.pose} />
          </div>
        {/each}

        <button on:click={handleSubmit}>submit</button>
      {/await}

      <div class="info">
        {#await activePosePromise then info}
          <pre>{JSON.stringify(info, null, 2)}</pre>
        {/await}
      </div>
    {/if}
  {:else}
    <p>All poses are verified!</p>
  {/if}
{/await}

<style>
  .description {
    position: fixed;
    top: 0;
    right: 50px;
    bottom: 0px;
    background-color: black;
  }

  .info {
    position: fixed;
    left: 0px;
    bottom: 0px;
    pointer-events: none;
  }

  .sub-nav > div {
    display: inline;
    padding: 2px 10px;
  }
  .sub-nav > div.active {
    background: white;
    color: black;
  }

  .pose-wrapper {
    position: relative;
    width: fit-content;
    margin: 0 auto;
  }

  .accept,
  .reject {
    position: absolute;
    width: 20%;
    height: 100%;
    top: 0px;
    opacity: 0.05;
    cursor: pointer;
  }

  .accepted > .accept,
  .rejected > .reject {
    opacity: 0.4;
  }

  .accept:hover,
  .reject:hover {
    opacity: 0.4;
  }

  .reject {
    left: 80%;
    background-color: red;
  }

  .accept {
    background-color: #0f0;
  }
</style>
