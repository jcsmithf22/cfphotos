import { getImage } from "$lib/images";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ platform, params }) => {
  if (!platform) {
    error(500, "Platform not found");
  }

  const image = await getImage(platform, params.id)

  return {
    image
  }
}
