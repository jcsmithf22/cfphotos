<script lang="ts">
  import favicon from "$lib/assets/favicon.svg";
  import "$lib/assets/stylesheets/index.css";

  let { children } = $props();
</script>

<svelte:head>
  <link rel="icon" href={favicon} />

  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link
    rel="preconnect"
    href="https://fonts.gstatic.com"
    crossorigin="anonymous"
  />
  <link
    href="https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=EB+Garamond:ital,wght@0,400..800;1,400..800&display=swap"
    rel="stylesheet"
  />
</svelte:head>

{@render children()}
