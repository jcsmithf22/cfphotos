<script lang="ts">
  import type { PageProps } from "./$types";

  let { params }: PageProps = $props();
</script>

<div>this is neat: {params.id}</div>
