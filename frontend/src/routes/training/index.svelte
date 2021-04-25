<script lang="ts">
  import { LineChart, MatrixChart } from "components/graph";
  import { api, humane } from "helpers";

  const history = api.getBrainHistory();
  const info = api.get("/brain/info");

  let duration = 0;

  $: if ($history.length) {
    info.then(({ startTime }) => {
      duration = Date.now() - startTime;
    });
  }

  function mapPrediction(prediction) {
    const flattened = prediction.flat();

    const min = Math.min(...flattened);
    const max = Math.max(...flattened);

    return prediction.map((row, y) => {
      return row.map((cell, x) => {
        const v = (cell - min) / (max - min);
        return `hsl(${v * 360}deg, ${v * 100}%, ${v * 100}%)`;
      });
    });
  }
</script>

<section>
  <h2>General:</h2>
  {#await info}
    <p>Loading info</p>
  {:then i}
    <table>
      <tr>
        <td>batchSize</td>
        <td>{i.batchSize}</td>
      </tr>

      <tr>
        <td>epochs</td>
        <td>{i.epochs}</td>
      </tr>

      <tr>
        <td>learningRate</td>
        <td>{i.learningRate}</td>
      </tr>

      <tr>
        <td>trainingDuration</td>
        <td>{humane.time(duration)}</td>
      </tr>
    </table>
  {/await}
</section>

<h2>Training</h2>

<h3>Current Iteration: {$history.length}</h3>

<section>
  <h3>Loss</h3>
  <LineChart data={$history.map((v) => v.loss, {})} minValue={0} showChange />
</section>

<section>
  <h3>Duration per iteration</h3>
  <LineChart data={$history.map((v) => v.duration, {})} label="ms" />
</section>

<section>
  <h3>Activations for Test Set</h3>
  {#if $history.length}
    <MatrixChart
      data={mapPrediction($history[$history.length - 1].prediction)}
    />
  {/if}
</section>

<style>
  section {
    margin: 100px auto;
  }
  table {
    margin: 0 auto;
    border-collapse: collapse;
  }
  td {
    outline: solid thin gray;
  }
</style>
