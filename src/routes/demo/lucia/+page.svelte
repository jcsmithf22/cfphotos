<script lang="ts">
  import { enhance } from "$app/forms";
  import type { PageServerData } from "./$types";
  import { uploadImage } from "./images.remote";
  import { uploadImageSchema } from "$lib/images";
  import Gallery from "../../../components/gallery.svelte";

  let { data }: { data: PageServerData } = $props();

  const { images } = uploadImage.fields;
  const imagesIssues = $derived(images.issues());
</script>

<div class="container">
  <div class="content gcs-1 gce-7">
    <Gallery images={data.images} />
  </div>

  <div class="sidebar gcs-7 gce-9">
    <div class="outer">
      <h1 class="Text size-1">Profile</h1>
      <div class="inner">
        <p class="Text size-2">Welcome, {data.user.username}.</p>

        <form method="post" action="?/logout" use:enhance>
          <button>Sign out</button>
        </form>
      </div>
    </div>

    <div class="outer">
      <h1 class="Text size-1">Upload</h1>
      <div class="inner">

        <form
          {...uploadImage.preflight(uploadImageSchema)}
          oninput={() =>
            uploadImage.validate({
              preflightOnly: true,
            })}
          enctype="multipart/form-data"
        >
          <h2 class="Text size-2">Upload Images</h2>
          <div>
            <input {...images.as("file multiple")} accept="image/*" multiple />
            {#each imagesIssues as issue}
              <p style="color: red">{issue.message}</p>
            {/each}
          </div>
          <button type="submit">Upload</button>
        </form>
      </div>
    </div>
  </div>
</div>

<style>
  .container {
    display: grid;
    grid-template-columns: repeat(8, 1fr);
    gap: 48px;
  }

  .sidebar {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 16px;
    
    & h1 {
      /* font-family: var(--font-family-heading); */
      line-height: 1;
      padding: 4px;
      margin-block-end: 6px;
      font-weight: 600;
    }

    & .outer {
      --padding: 6px;
      background-color: var(--muted);
      border-radius: calc(var(--padding) + var(--radius));
      border: 1px solid var(--border);
      padding: var(--padding);
    }

    & .inner {
      border-radius: var(--radius);
      box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
      background-color: var(--background);
      padding: 12px;
    }
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  input[type="file"] {
    --padding: 8px;
    border: 1px dashed var(--border);
    padding: var(--padding);
    border-radius: calc(var(--radius) + var(--padding));
    width: 100%;
  }

  input[type="file"]::file-selector-button {
    margin-inline-end: 8px;
  }
</style>
