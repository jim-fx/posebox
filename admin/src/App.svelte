<script lang="ts">
  import * as routes from "./routes";

  let currentRoute = "index";

  $: if (!(currentRoute in routes)) {
    currentRoute = "index";
  }
</script>

<main>
  <nav>
    {#each Object.keys(routes) as key}
      <button
        on:click={() => {
          currentRoute = key;
        }}>{key}</button
      >
    {/each}
  </nav>

  {#if currentRoute in routes}
    <svelte:component this={routes[currentRoute]} />
  {/if}
</main>

<style>
  main {
    max-width: 800px;
    margin: 0 auto;
  }
</style>
