<script lang="ts">
  import { enhance } from "$app/forms";
  import * as v from "valibot";
  import type { PageServerData } from "./$types";
  import { uploadImage, deleteImage } from "./images.remote";

  let { data }: { data: PageServerData } = $props();

  const { image } = uploadImage.fields;
  const imageIssue = $derived(image.issues()?.at(0));

  const schema = v.object({
    image: v.pipe(
      v.file("Please upload an image."),
      v.mimeType(
        [
          "image/png",
          "image/jpeg",
          "image/gif",
          "image/webp",
          "image/svg",
          "image/heic",
        ],
        "Please upload an image.",
      ),
      v.maxSize(100 * 1024 * 1024, "Image size is too large (max 100mb)."),
    ),
  });
</script>

<h1>Hi, {data.user.username}!</h1>
<p>Your user ID is {data.user.id}.</p>

<form
  {...uploadImage.preflight(schema)}
  oninput={() =>
    uploadImage.validate({
      preflightOnly: true,
    })}
  enctype="multipart/form-data"
>
  <h2>Upload Image</h2>
  <div>
    <input {...image.as("file")} accept="image/*" />
    {#if imageIssue}
      <p style="color: red">{imageIssue.message}</p>
    {/if}
  </div>
  <button type="submit">Upload</button>
</form>

<form method="post" action="?/logout" use:enhance>
  <button>Sign out</button>
</form>

<div>
  {#each data.images as image}
    {#if image.thumbnail}
      {@const form = deleteImage.for(image.id)}
      <div>
        <p>{image.filename}</p>
        <img
          src={image.thumbnail}
          alt={image.filename}
          width="120"
          height="120"
        />
        <form {...form}>
          <input type="hidden" name="id" value={image.id} />
          <button disabled={!!form.pending}>Delete</button>
          {#if form.pending}
            <p>Loading...</p>
          {/if}
        </form>
      </div>
    {/if}
  {/each}
</div>

<style>
  form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    max-width: 300px;
  }

  input[type="file"] {
    --padding: 8px;
    border: 1px dashed var(--border);
    padding: var(--padding);
    border-radius: calc(var(--radius) + var(--padding));
  }

  input[type="file"]::file-selector-button {
    margin-inline-end: 8px;
  }
</style>
