<script lang="ts">
  import api from "@poser/api";
  import { BarChart } from "@poser/components";

  const dataStatus = api.get("/data/status").then(async (res) => {
    return Object.keys(res.amount).map((id) => {
      return {
        id,
        amount: res.amount[id],
      };
    });
  });
</script>

<h1>Moin Admin :)</h1>

{#await dataStatus}
  <p>Loading</p>
{:then data}
  <h3>Verteiling Trainingsdaten</h3>
  <BarChart {data} minValue={0} />
{/await}
