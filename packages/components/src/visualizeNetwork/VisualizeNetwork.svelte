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

    function getWeights(nn: Sequential) {
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
</script>

<svg width="640" height="480" viewBox="0 0 100 100">
    {#each layers as layer}
        <g>
            {#each layer as n}
                <circle cx={n.x} cy={n.y} r="0.5" />
            {/each}
        </g>
    {/each}

    {#each weights as layer, i}
        {#each layer as neuron, j}
            {#if layers[i+1][j]}
                <line
                    x1={layers[i][j].x}
                    y1={layers[i][j].y}
                    x2={layers[i + 1][j].x}
                    y2={layers[i + 1][j].y}
                />
            {/if}
        {/each}
    {/each}
</svg>

<style>
    circle {
        fill: red;
    }

    line {
        stroke: white;
        stroke-width: 0.1px;
    }
</style>
