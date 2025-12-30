<script lang="ts">
  import { enhance } from "$app/forms";
  import * as v from "valibot";
  import type { PageServerData } from "./$types";
  import { uploadImage, deleteImage } from "./images.remote";
  import type { Attachment } from "svelte/attachments";
  import { animate, hover, spring, type AnimationSequence } from "motion";
  import { uploadImageSchema } from "$lib/images";

  let { data }: { data: PageServerData } = $props();

  const { images } = uploadImage.fields;
  const imagesIssues = $derived(images.issues());

  const config = {
    type: spring,
    stiffness: 300,
    damping: 10,
    mass: 1,
  };

  const boop: Attachment = (element) => {
    return hover(element, () => {
      const sequence: AnimationSequence = [
        [element, { rotate: 25, scale: 1.1 }, { duration: 0.15, ease: "easeOut" }],
        [element, { rotate: 0, scale: 1 }, config],
      ];
      animate(sequence);
    });
  };
</script>

<h1>Hi, {data.user.username}!</h1>
<p>Your user ID is {data.user.id}.</p>

<form
  {...uploadImage.preflight(uploadImageSchema)}
  oninput={() =>
    uploadImage.validate({
      preflightOnly: true,
    })}
  enctype="multipart/form-data"
>
  <h2>Upload Images</h2>
  <div>
    <input {...images.as("file multiple")} accept="image/*" multiple />
    {#each imagesIssues as issue}
      <p style="color: red">{issue.message}</p>
    {/each}
  </div>
  <button type="submit">Upload</button>
</form>

<form method="post" action="?/logout" use:enhance>
  <button>Sign out</button>
</form>

<div data-component="gallery">
  {#each data.images as image}
    {#if image.thumbnail}
      {@const form = deleteImage.for(image.id)}
      <div>
        <div data-slot="image">
          <img
            src={image.thumbnail}
            alt={image.filename}
            width="120"
            height="120"
          />
          <p>{image.filename}</p>
          <form {...form}>
            <input type="hidden" name="id" value={image.id} />
            <button disabled={!!form.pending} aria-label="Delete image" {@attach boop}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 256 256"
                fill="currentColor"
                width="16"
                height="16"
                ><rect width="256" height="256" fill="none" /><line
                  x1="216"
                  y1="56"
                  x2="40"
                  y2="56"
                  fill="none"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="16"
                /><line
                  x1="104"
                  y1="104"
                  x2="104"
                  y2="168"
                  fill="none"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="16"
                /><line
                  x1="152"
                  y1="104"
                  x2="152"
                  y2="168"
                  fill="none"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="16"
                /><path
                  d="M200,56V208a8,8,0,0,1-8,8H64a8,8,0,0,1-8-8V56"
                  fill="none"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="16"
                /><path
                  d="M168,56V40a16,16,0,0,0-16-16H104A16,16,0,0,0,88,40V56"
                  fill="none"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="16"
                /></svg
              >
            </button>
            {#if form.pending}
              <p>Loading...</p>
            {/if}
          </form>
        </div>
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

  [data-component="gallery"] {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 8px;
  }

  [data-slot="image"] {
    --padding: 4px;
    position: relative;
    border: 1px solid var(--border);
    padding: var(--padding);
    border-radius: calc(var(--radius) + var(--padding));

    box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.1);

    & img {
      border-radius: var(--radius);
    }
    & p {
      margin: 4px;
      text-align: center;
      font-size: 0.875rem;
    }

    & button {
      position: absolute;
      top: 2px;
      right: 2px;
      border-radius: calc(var(--radius) + 2px);
      padding: 2px;
      inline-size: 24px;
      block-size: 24px;
      display: flex;
      align-items: center;
      justify-content: center;

      background-color: var(--destructive-faint);
      border-color: var(--destructive);
      color: var(--destructive);
    }
  }
</style>
