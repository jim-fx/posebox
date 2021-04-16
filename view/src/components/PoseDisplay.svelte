<script>
  export let pose;

  $: if (pose) {
    // console.log(pose);
  }
</script>

<div class="wrapper">
  {#if pose}
    {#each pose as point}
      <div
        class="point"
        style={`transform: translate(${point.x * 600}px, ${point.y * 450}px);`}
      />
    {/each}
  {/if}
</div>

<style>
  .wrapper {
    width: 600px;
    height: 450px;
    top: 15px;
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
