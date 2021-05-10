<script>
  import { PoseDisplay } from "@poser/components";
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  export let pose;
  export let accepted;
  export let visible = true;

  function setAccepted(v) {
    if (v === accepted) {
      accepted = undefined;
    } else {
      accepted = v;
    }
    dispatch("verify", accepted);
  }
</script>

<div
  class="pose-wrapper"
  class:rejected={accepted === false}
  class:accepted={accepted === true}
>
  <div class="pose-display">
    {#if visible}
      <PoseDisplay pose={pose.pose} />
    {/if}
  </div>
  <div class="accept" on:click={() => setAccepted(true)} />
  <div class="reject" on:click={() => setAccepted(false)} />
</div>

<style>
  .pose-wrapper {
    position: relative;
    width: 300px;

    margin: 20px auto;

    outline: solid thin white;

    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 50px;
    gap: 0px 0px;
    grid-template-areas:
      "top top"
      "bottom-left bottom-right";
  }

  .accept,
  .reject {
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

  .pose-display {
    grid-area: top;
  }

  .reject {
    /* left: 80%; */
    grid-area: bottom-left;
    background-color: red;
  }

  .accept {
    grid-area: bottom-right;
    background-color: #0f0;
  }
</style>
