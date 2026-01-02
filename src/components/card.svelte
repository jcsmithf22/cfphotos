<script lang="ts">
  import type { Snippet } from "svelte";

  let { children, title }: { children: Snippet; title: string } = $props();
</script>

<div data-component="card">
  <h1 class="Text size-1">{title}</h1>
  <div data-slot="content">
    {@render children()}
  </div>
</div>

<style>
  [data-component="card"] {
    --padding: 6px;
    background-color: var(--muted);
    border-radius: calc(var(--padding) + var(--radius));
    border: 1px solid var(--border);
    padding: var(--padding);

    & h1 {
      line-height: 1;
      padding: 4px;
      margin-block-end: 6px;
      font-weight: 600;
    }

    & [data-slot="content"] {
      border-radius: var(--radius);
      box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
      background-color: var(--background);
      padding: 12px;
    }
  }
</style>
