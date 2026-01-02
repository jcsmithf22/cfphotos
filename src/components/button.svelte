<script lang="ts">
  import type { HTMLButtonAttributes } from "svelte/elements";

  let {
    variant,
    size,
    children,
    ...rest
  }: HTMLButtonAttributes & {
    variant?: "primary" | "secondary" | "destructive";
    size?: "sm" | "md" | "lg";
    children?: import("svelte").Snippet;
  } = $props();
</script>

<button {...rest} data-variant={variant} data-size={size} data-component="button">
  {#if children}
    {@render children()}
  {/if}
</button>

<style>
  button[data-variant] {
    --offset: 0px;
    position: relative;

    &::after {
      content: "";
      position: absolute;
      inset: calc(var(--offset) * -1);
      border-radius: calc((var(--radius) + var(--offset) - 1px));
      border-block-start: 1px solid var(--button-highlight, var(--border));
      opacity: var(--button-highlight-opacity, 1);
    }
  }
</style>
