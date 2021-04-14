<script>
  export let pose;

  $: if (pose) {
    // console.log(pose);
  }
</script>

<div class="wrapper">
  {#if pose && pose.keypoints}
    {#each pose.keypoints as point}
      <div
        class="point"
        style={`transform: translate(${point.position.x * 500}px, ${
          point.position.y * 500
        }px);`}
      />
    {/each}
  {/if}
</div>

<style>
  .wrapper {
    width: 500px;
    height: 500px;
    position: relative;
    margin: 0 auto;
    border: solid thin red;
  }

  .point {
    top: 0;
    left: 0;
    position: absolute;
    width: 5px;
    height: 5px;
    background-color: red;
  }
</style>
