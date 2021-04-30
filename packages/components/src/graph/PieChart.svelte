<script lang="ts">
  export let data: { id: string; amount: number }[] = [];

  export let minValue: number = undefined;
  export let maxValue: number = undefined;

  $: _minValue =
    typeof minValue === "undefined"
      ? data
        ? Math.min(...data.map((v) => v.amount))
        : 0
      : minValue;
  $: _maxValue =
    typeof maxValue === "undefined"
      ? data
        ? Math.max(...data.map((v) => v.amount))
        : 1
      : maxValue;

  $: _data = data.map((v) => {
    return {
      ...v,
      amount: ((v.amount - _minValue) / (_maxValue - _minValue)) * 100,
    };
  });

  $: _total = _data.reduce((a, b) => a + b.amount, 0);
</script>

<div class="wrapper">
  {#each _data as value}
    <div>{value.id}</div>
    <div class="bar" style={`width: ${value.amount}%`}>
      {Math.round((value.amount / _total) * 10000) / 100}%
    </div>
  {/each}
</div>

<svg height="20" width="20" viewBox="0 0 20 20">
  <circle
    r="5"
    cx="10"
    cy="10"
    fill="transparent"
    stroke-dasharray="calc(35 * 31.4 / 100) 31.4"
    transform="rotate(-90) translate(-20)"
  />
</svg>

<style>
  .wrapper {
    display: grid;
    grid-template-rows: auto;
    grid-template-columns: min-content 1fr;
    gap: 10px 2px;
  }

  .bar {
    background-color: white;
    color: black;
    text-align: right;
  }
</style>
