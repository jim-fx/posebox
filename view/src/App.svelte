<script lang="ts">
  import Main from "./routes/main/index.svelte";
  import Training from "./routes/training/index.svelte";

  export let route: string =
    window.location.hash.length > 2
      ? window.location.hash.replace("#", "")
      : "main";

  $: if (route) {
    window.location.hash = route;
  }
</script>

<button on:click={() => (route = "main")}>main</button>
<button on:click={() => (route = "training")}>training</button>

<main>
  <h1>Active Route {route}</h1>

  {#if route == "main"}
    <Main />
  {:else if route == "training"}
    <Training />
  {/if}
</main>

<style>
  main {
    text-align: center;
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
  }

  h1 {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 4em;
    font-weight: 100;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>
