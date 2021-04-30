<script lang="ts">
  export let data: string[][];
</script>

<div class="grid" style="">
  <table>
    {#each data as row}
      <tr>
        {#each row as cell}
          <td class="cell" style={`background-color: ${cell}`} />
        {/each}
      </tr>
    {/each}
  </table>
</div>

<style>
  table {
    margin: 0 auto;
  }

  .cell {
    height: 20px;
    width: 20px;
  }
</style>
