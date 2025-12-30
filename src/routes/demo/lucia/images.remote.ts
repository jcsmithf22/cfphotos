import { error } from "@sveltejs/kit";
import Cloudflare from "cloudflare";
import * as v from "valibot";
import { form, getRequestEvent } from "$app/server";

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
      "Please upload an image."
    ),
    v.maxSize(100 * 1024 * 1024, "Image size is too large (max 100mb).")
  ),
});

export const uploadImage = form(schema, async ({ image }) => {
  const { locals, platform } = getRequestEvent();
  if (!locals.session) {
    error(401, "Unauthorized");
  }

  if (!platform) {
    error(500, "Platform not found");
  }

  const imageApiToken = platform.env.IMAGE_API_TOKEN;
  const cloudflareAccountId = platform.env.CLOUDFLARE_ACCOUNT_ID;

  const client = new Cloudflare({
    apiToken: imageApiToken,
  });

  try {
    const buffer = await image.arrayBuffer();
    const file = new File([buffer], image.name, {
      type: image.type,
    });

    const params: Cloudflare.Images.V1.V1CreateParams = {
      account_id: cloudflareAccountId,
      file: file,
    };

    const _ = await client.images.v1.create(params);
    return { success: true };
  } catch (err) {
    console.error(err);
    error(500, "Failed to upload image");
  }
});
