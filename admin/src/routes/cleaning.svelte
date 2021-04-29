<script lang="ts">
  import api from "@poser/api";
  import { PoseDisplay } from "@poser/components";

  const pageSize = 20;
  let index = 0;

  $: posesPromise =
    index > -1 &&
    api.getTrainingPoses({
      amount: pageSize,
      offset: index * pageSize,
      verified: null,
    });

  function handleSubmit() {
    index++;
  }
</script>

{#await posesPromise}
  <p>Loading</p>
{:then poses}
  {#each poses as pose}
    <PoseDisplay pose={pose.pose} />
    <p>{pose._id}</p>
    <input type="checkbox" />
  {/each}

  <button on:click={handleSubmit}>submit</button>
{/await}
