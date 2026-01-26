<script lang="ts">
  import type { Image } from "$lib/images";
  import {
    animate,
    spring,
    type AnimationParams,
    type EasingParam,
    type SpringParams,
  } from "animejs";
  import type { Attachment } from "svelte/attachments";
  import { deleteImage } from "../routes/admin/gallery/images.remote";
  import { hover } from "$lib/hover";

  let {
    images,
    onclick,
  }: {
    images: Array<Image>;
    onclick: (e: MouseEvent, id: string) => Promise<void>;
  } = $props();

  const boop: Attachment = (element) => {
    return hover(element, () => {
      // const sequence: AnimationSequence = [
      //   [
      //     element,
      //     { rotate: 25, scale: 1.1 },
      //     { duration: 0.15, ease: "easeOut" },
      //   ],
      //   [element, { rotate: 0, scale: 1 }, config],
      // ];
      // mAnimate(sequence);
      const duration = 150;
      const ease: EasingParam = "outSine";
      const config: SpringParams = { stiffness: 300, damping: 10, mass: 1 };

      const scale = 1.1;
      const rotation = 25;

      const params: AnimationParams = {
        keyframes: [
          { scale, rotate: rotation, duration, ease },
          { scale: 1, rotate: 0, ease: spring(config) },
        ],
      };
      // const params: AnimationParams = {
      //   rotate: [{ to: 25 }, { to: 0, ease: spring(config) }],
      //   scale: [{ to: 1.1 }, { to: 1, ease: spring(config) }],
      //   duration,
      //   ease,
      // };
      animate(element, params);
    });
  };
</script>

<div data-component="gallery">
  {#each images as image}
    {#if image.thumbnail}
      {@const form = deleteImage.for(image.id)}
      <div>
        <div data-slot="image">
          <button
            data-slot="trigger"
            class="unstyled"
            onclick={(e) => onclick(e, image.id)}
          >
            <img
              src={image.thumbnail}
              alt={image.filename}
              width="120"
              height="120"
            />
          </button>
          <p class="Text size-1 dense">{image.filename}</p>
          <form {...form}>
            <input type="hidden" name="id" value={image.id} />
            <button
              data-slot="delete"
              disabled={!!form.pending}
              aria-label="Delete image"
              {@attach boop}
            >
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
  [data-component="gallery"] {
    display: grid;
    grid-template-columns: repeat(auto-fill, 130px);
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
      /* font-size: 0.875rem; */
      line-height: 1.2;
    }

    & [data-slot="trigger"] {
    }

    & [data-slot="delete"] {
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
      --hover-filter: none;

      background-color: var(--destructive-faint);
      border-color: var(--destructive);
      color: var(--destructive);
    }
  }
</style>
