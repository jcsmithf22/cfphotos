import Cloudflare from "cloudflare";
import { error } from "@sveltejs/kit";
import * as v from "valibot";

export const uploadImageSchema = v.object({
  images: v.array(
    v.pipe(
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
        "Please upload an image."
      ),
      v.maxSize(100 * 1024 * 1024, "Image size is too large (max 100mb).")
    )
  ),
});

export const getImages = async (platform: Readonly<App.Platform>) => {
  const imageApiToken = platform.env.IMAGE_API_TOKEN;
  const cloudflareAccountId = platform.env.CLOUDFLARE_ACCOUNT_ID;

  const client = new Cloudflare({
    apiToken: imageApiToken,
  });

  const imageData = await client.images.v2.list({
    account_id: cloudflareAccountId,
  });

  if (!imageData.images) {
    error(500, "Error loading images");
  }

  const images = imageData.images
    .map((image) => {
      const id = image.id;
      const variants = image.variants;
      if (!variants || !id) {
        return undefined;
      }
      return {
        ...image,
        id,
        variants,
        thumbnail: variants.find((url) => url.endsWith("/thumbnail")),
      };
    })
    .filter((image) => image !== undefined);

    return images;
};


export type Image = Awaited<ReturnType<typeof getImages>>[number];