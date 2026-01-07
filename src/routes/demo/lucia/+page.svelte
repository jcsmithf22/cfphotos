<script lang="ts">
  import { enhance } from "$app/forms";
  import type { PageServerData } from "./$types";
  import { uploadImage } from "./images.remote";
  import { uploadImageSchema, type Image } from "$lib/images";
  import Gallery from "../../../components/gallery.svelte";
  import Button from "../../../components/button.svelte";
  import Card from "../../../components/card.svelte";
  import { goto, preloadData, pushState } from "$app/navigation";
  import { page } from "$app/state";
  import Modal from "../../../components/modal.svelte";

  let { data }: { data: PageServerData } = $props();

  const { images } = uploadImage.fields;

  type ImageData = {
    image: Image;
  };

  // Handle click on calendar box - shallow routing
  async function handleImageClick(e: MouseEvent, id: string) {
    // Bail for new tab/window
    if (e.metaKey || e.ctrlKey || e.shiftKey) return;

    e.preventDefault();

    const href = `/demo/lucia/${id}`;

    // Load the day's data first
    const result = await preloadData(href);

    if (result.type === "loaded" && result.status === 200) {
      pushState(href, { selectedImage: result.data as ImageData });
    } else {
      // Fallback to full navigation
      goto(href);
    }
  }
</script>

<div class="container">
  <div class="content">
    <div data-component="heading">
      <div data-slot="eyebrow">
      </div>
      <div data-slot="main">
        <h1 class="Text size-4">Gallery</h1>
        <ul class="Text size-1">
          <li><a href="/">Home</a></li>
          <li><a href="/">Gallery</a></li>
          <li><a href="/">Grid</a></li>
        </ul>
      </div>
    </div>
    <Gallery onclick={handleImageClick} images={data.images} />
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
          {#each uploadImage.fields.allIssues() as issue}
            <p style="color: red">{issue.message}</p>
          {/each}
        </div>
        <Button variant="primary" type="submit">Upload</Button>
      </form>
    </Card>
  </div>
</div>

{#if page.state.selectedImage}
  {@const selectedImage = page.state.selectedImage.image}
  <Modal onclose={() => history.back()}>
    <div>Modal: {selectedImage?.id}</div>
    <div>
      {#if selectedImage?.display}
        <img alt={selectedImage.filename} src={selectedImage.display} />
      {/if}
    </div>
  </Modal>
{/if}

<style>
  .container {
    display: flex;
  }

  .content {
    width: 100%;
    padding-inline: 16px;
    padding-block-start: 48px;
    padding-block-end: 16px;

    & [data-component="heading"] {
      & [data-slot="eyebrow"] {
        & span {
          /* font-weight: 600; */
          /* text-transform: uppercase; */
          line-height: 1;
          font-size: 16px;
        }
      }

      & [data-slot="main"] {
        display: flex;
        align-items: baseline;
        margin-block-end: 24px;
      }

      & ul {
        display: flex;
        gap: 12px;
        margin: 0;
        margin-inline-start: 48px;
        padding: 0;
        list-style: none;
        font-size: 18px;

        & a {
          color: var(--foreground);
          text-decoration: none;

          &:hover {
            text-decoration: underline;
          }
        }
      }
    }
  }

  .sidebar {
    display: flex;
    flex-shrink: 0;
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
