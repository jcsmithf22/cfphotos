<script lang="ts">
  import { enhance } from "$app/forms";
  import type { PageServerData } from "./$types";
  import { uploadImage } from "./images.remote";
  import { uploadImageSchema } from "$lib/images";
  import Gallery from "../../../components/gallery.svelte";
  import Button from "../../../components/button.svelte";
  import Card from "../../../components/card.svelte";

  let { data }: { data: PageServerData } = $props();

  const { images } = uploadImage.fields;
  const imagesIssues = $derived(images.issues());
</script>

<div class="container">
  <div class="content">
    <Gallery images={data.images} />
  </div>

  <div class="sidebar">
    <Card title="Profile">
      <p class="Text size-2">Welcome, {data.user.username}.</p>

      <form method="post" action="?/logout" use:enhance>
        <!-- <button>Sign out</button> -->
        <Button>Sign out</Button>
      </form>
    </Card>
    <Card title="Upload">
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
        <Button variant="primary" type="submit">Upload</Button>
      </form>
    </Card>
  </div>
</div>

<style>
  .container {
    display: flex;
  }

  .content {
    width: 100%;
  }

  .sidebar {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 16px;
    width: 100%;
    max-width: 400px;
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
