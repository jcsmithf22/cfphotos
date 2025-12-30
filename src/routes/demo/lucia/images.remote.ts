import { error } from "@sveltejs/kit";
import Cloudflare from "cloudflare";
import * as v from "valibot";
import { form, getRequestEvent } from "$app/server";
import { uploadImageSchema } from "$lib/images";


export const deleteImage = form(
  v.object({
    id: v.string(),
  }),
  async ({ id }) => {
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
      const params: Cloudflare.Images.V1.V1DeleteParams = {
        account_id: cloudflareAccountId,
      };
      await client.images.v1.delete(id, params);
      return { success: true };
    } catch (err) {
      console.error(err);
      error(500, "Failed to delete image");
    }
  }
);

export const uploadImage = form(uploadImageSchema, async ({ images }) => {
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
    const results = await Promise.all(
      images.map(async (image) => {
        const buffer = await image.arrayBuffer();
        const file = new File([buffer], image.name, {
          type: image.type,
        });

        const params: Cloudflare.Images.V1.V1CreateParams = {
          account_id: cloudflareAccountId,
          file: file,
        };

        await client.images.v1.create(params);
        return { filename: image.name, success: true };
      })
    );
    return { results };
  } catch (err) {
    console.error(err);
    error(500, "Failed to upload images");
  }
});