<script>
  export let mediaFiles = [];

  const getFileUrl = (file) => file?.vault?.getResourcePath(file) || "";
</script>

<style>
  .media-view {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 10px;
    padding: 10px;
  }
  .media-view img {
    width: 100%;
    height: auto;
    object-fit: cover;
    border-radius: 5px;
  }
</style>

{#if mediaFiles.length > 0}
  <div class="media-view">
    {#each mediaFiles as file (file.path)}
      <img src="{getFileUrl(file)}" alt="{file.name}" />
    {/each}
  </div>
{:else}
  <p>No media found.</p>
{/if}
