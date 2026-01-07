<script lang="ts">
  import type { Snippet } from "svelte";

  interface Props {
    onclose: () => void;
    children: Snippet;
  }

  let { onclose, children }: Props = $props();

  function handleBackdropClick(e: MouseEvent) {
    if (e.target === e.currentTarget) {
      onclose();
    }
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === "Escape") {
      onclose();
    }
  }
</script>

<svelte:window onkeydown={handleKeydown} />

<div
  data-component="modal"
  onclick={handleBackdropClick}
  onkeydown={handleKeydown}
  role="dialog"
  aria-modal="true"
  tabindex="-1"
>
  <div data-slot="content">
    <button data-slot="close" onclick={onclose} aria-label="Close modal">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
      >
        <path d="M18 6L6 18M6 6l12 12" />
      </svg>
    </button>
    {@render children()}
  </div>
</div>

<style>
  [data-component="modal"] {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.75);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    z-index: 100;
    animation: fadeIn 0.2s ease-out;

    --padding: 16px;

    & [data-slot="content"] {
      background: var(--background);
      border-radius: calc(var(--radius) + var(--padding));
      padding: 32px;
      max-width: 950px;
      width: 100%;
      max-height: 90vh;
      overflow-y: auto;
      position: relative;
      border: 1px solid var(--border);
      animation: slideUp 0.2s ease-out;
    }

    & [data-slot="close"] {
      position: absolute;
      top: var(--padding);
      right: var(--padding);
      width: 2.5rem;
      height: 2.5rem;
      padding: 0;
      display: flex;
      justify-content: center;
      align-items: center;

      & svg {
        width: 1.25rem;
        height: 1.25rem;
      }
    }
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>
