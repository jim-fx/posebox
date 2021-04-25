<script lang="ts">
  import { decimals } from "helpers";

  export let data: number[] = [];

  export let showChange: boolean = false;
  export let maxAmount: number = Infinity;
  export let minValue: number = undefined;
  export let maxValue: number = undefined;
  export let label: string = "";

  $: cappedArray = data.slice(
    Math.max(0, data.length - 1 - maxAmount),
    data.length - 1
  );

  $: lastValue = cappedArray[cappedArray.length - 1];
  $: change =
    cappedArray.length > 1
      ? lastValue - cappedArray[cappedArray.length - 2]
      : 0;
  $: _minValue =
    typeof minValue === "number" ? minValue : Math.min(...cappedArray) || 0;
  $: _maxValue =
    typeof maxValue === "number" ? maxValue : Math.max(...cappedArray) || 1;

  export let padding = 0.025;

  function applyPadding(v) {
    if (Number.isNaN(v)) {
      return 0;
    }
    return 100 * padding + v * (1 - padding * 2);
  }

  function mapValue(v, i, a) {
    let x = (i / (a.length - 1)) * 100;
    let y = (1 - (v - _minValue) / (_maxValue - _minValue)) * 100;

    x = applyPadding(x);
    y = applyPadding(y);

    return { x, y };
  }
</script>

<svg viewBox="0 0 100 100">
  <polyline
    points={cappedArray
      .map(mapValue)
      .map(({ x, y }) => `${x},${y}`)
      .join(" ")}
  />

  <polyline points="0,0 0,100 100,100" />

  <g id="min-max">
    <text x="-2" y="0"> {decimals(_maxValue, 3)}{label}</text>
    <text x="-2" y="100"> {decimals(_minValue, 3)}{label}</text>
  </g>

  <text
    x="100"
    y={mapValue(lastValue, cappedArray.length - 1, cappedArray.length).y}
  >
    {decimals(lastValue, 3)}{label}
    {#if showChange}
      ({change > 0 ? "+" : ""}{decimals(change, 2)}{label})
    {/if}
  </text></svg
>

<style>
  text {
    alignment-baseline: central;
  }
  #min-max > text {
    text-anchor: end;
  }
  text {
    fill: white;
    font-size: 5px;
  }
  svg {
    width: 100%;
    height: 200px;
    overflow: visible;
  }
  polyline {
    stroke: white;
    fill: none;
    stroke-width: "10";
  }
</style>
