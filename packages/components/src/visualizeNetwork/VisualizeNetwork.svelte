<script lang="ts">
  import type { Sequential } from "@tensorflow/tfjs";

  export let neuralNet: Sequential;

  function getNeurons(nn): { x: number; y: number }[][] {
    let nodes = [];
    nodes.push(nn.layers[0].input.shape[1]);
    for (let i = 0; i < nn.layers.length; i++) {
      nodes.push(nn.layers[i].units);
    }

    const _neurons = [];

    for (let i = 0; i < nodes.length; i++) {
      let temp = [];
      for (let j = 0; j < nodes[i]; j++) {
        let x = (i / (nodes.length - 1)) * 100;
        let y = (j / nodes[i]) * 100;
        const pos = { x, y };
        temp.push(pos);
      }

      _neurons.push(temp);
    }

    return _neurons;
  }

  function getWeights(nn: Sequential): number[][][] {
    const weights = [];
    const biases = [];

    for (let i = 0; i < nn.layers.length; i++) {
      let a = nn.layers[i].getWeights()[0];
      let b = a.arraySync();
      weights.push(b);

      let c = nn.layers[i].getWeights()[1];
      let d = c.arraySync();
      biases.push(d);
    }

    return weights;
  }

  $: layers = neuralNet && getNeurons(neuralNet);
  $: weights = neuralNet && getWeights(neuralNet);

  let scale = 1;
  let px = 0;
  let py = 0;

  function handleMouseOver() {
    scale = 4;
  }

  function handleMouseOut() {
    scale = 1;
    px = 0;
    py = 0;
  }

  let wrapper: HTMLElement;

  $: rect = wrapper && wrapper.getBoundingClientRect();
  function handleMouseMove({ x, y }: MouseEvent) {
    px = (1 - (x - rect.left) / rect.width - 0.5) * rect.width;
    py = (1 - (y - rect.top) / rect.height - 0.5) * rect.height;
  }
</script>

<div
  class="wrapper"
  bind:this={wrapper}
  on:mouseover={handleMouseOver}
  on:mouseout={handleMouseOut}
  on:mouseleave={handleMouseOut}
  on:mouseenter={handleMouseOver}
  on:mousemove={handleMouseMove}
>
  <svg
    width="640"
    height="480"
    viewBox="0 0 100 100"
    style={`transform: scale(${scale}) translate(${px}px,${py}px)`}
  >
    {#each weights as layer, i}
      {#each layer as neuron, j}
        {#each neuron as singleWeight, k}
          {#if layers[i + 1][k]}
            <line
              stroke-width={singleWeight * 10}
              x1={layers[i][j].x}
              y1={layers[i][j].y}
              x2={layers[i + 1][k].x}
              y2={layers[i + 1][k].y}
            />
          {/if}
        {/each}
      {/each}
    {/each}

    {#each layers as layer}
      <g>
        {#each layer as n}
          <circle cx={n.x} cy={n.y} r="0.5" />
        {/each}
      </g>
    {/each}
  </svg>
</div>

<style>
  .wrapper {
    overflow: hidden;
    width: fit-content;
    margin: 0 auto;
  }

  svg {
    transition: transform 0.3s ease;
    overflow: visible;
  }

  circle {
    fill: red;
  }

  line {
    stroke: white;
    opacity: 0.2;
    stroke-width: 0.1px;
  }
</style>
