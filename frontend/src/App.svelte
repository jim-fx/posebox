<script lang="ts">
  import * as routes from "./routes";

  export let activeRoute: string =
    window.location.hash.length > 2
      ? window.location.hash.replace("#", "")
      : "data";

  $: if (activeRoute) {
    window.location.hash = activeRoute;
  }
</script>

<nav>
  {#each Object.keys(routes) as route}
    <button
      class:active={activeRoute == route}
      on:click={() => {
        activeRoute = route;
      }}
    >
      {route.charAt(0).toUpperCase() + route.slice(1)}
    </button>
  {/each}
</nav>

<main>
  {#if activeRoute in routes}
    <svelte:component this={routes[activeRoute]} />
  {/if}
</main>

<style>
  nav {
    position: fixed;
    top: 50vh;
    transform: translateY(-50%);
  }

  nav > button {
    color: white;
    background: transparent;
    border: none;
    display: block;
    font-weight: bolder;
    font-size: 1.5em;
    border-radius: 0px;
    cursor: pointer;
  }

  nav > button.active {
    color: black;
    background-color: white;
  }

  main {
    text-align: center;
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>
