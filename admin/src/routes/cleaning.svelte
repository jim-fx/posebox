<script lang="ts">
  import api from "@poser/api";
  import PoseList from "../components/PoseList.svelte";

  const statusPromise = api.get("/data/status");
  const posePromise = api.getPoses();
</script>

{#await Promise.all([statusPromise, posePromise])}
  <p>Loading...</p>
{:then [status, poses]}
  {#if status.totalVerified < 1}
    <PoseList {poses} {status} />
  {:else}
    <p>All poses are verified!</p>
  {/if}
{/await}
