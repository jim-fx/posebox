<script lang="ts">
  export let data: { id: string; amount: number }[] = [];

  export let minValue: number = undefined;
  export let maxValue: number = undefined;

  $: _minValue =
    typeof minValue === "undefined"
      ? Math.min(...data.map((v) => v.amount))
      : minValue;
  $: _maxValue =
    typeof maxValue === "undefined"
      ? Math.max(...data.map((v) => v.amount))
      : maxValue;

  $: _data = data.map((v) => {
    return {
      ...v,
      amount: ((v.amount - _minValue) / (_maxValue - _minValue)) * 100,
    };
  });
</script>

<div class="wrapper">
  {#each _data as value}
    <div>{value.id}</div>

    <div style={`width: ${value.amount}`} />
  {/each}
</div>

<style>
  .wrapper {
    display: grid;
    grid-template-rows: auto;
    grid-template-columns: min-content 1fr;
  }
</style>
