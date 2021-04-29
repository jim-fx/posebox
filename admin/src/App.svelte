<script lang="ts">
  import * as routes from "./routes";
  import { activeRoute } from "./stores";
</script>

<main>
  <nav>
    {#each Object.keys(routes) as key}
      <button
        on:click={() => {
          $activeRoute = key;
        }}>{key}</button
      >
    {/each}
  </nav>

  {#if $activeRoute in routes}
    <svelte:component this={routes[$activeRoute]} />
  {/if}
</main>

<style>
  main {
    max-width: 800px;
    margin: 0 auto;
  }
</style>
