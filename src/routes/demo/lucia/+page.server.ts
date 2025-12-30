import * as auth from '$lib/server/auth';
import { error, fail, redirect } from '@sveltejs/kit';
import { getRequestEvent } from '$app/server';
import type { Actions, PageServerLoad } from './$types';
import { dbD1 } from '$lib/server/db';
import Cloudflare from 'cloudflare'

export const load: PageServerLoad = async ({ platform }) => {
  const user = requireLogin()

  if (!platform) {
    error(500, "Platform not found");
  }

  const imageApiToken = platform.env.IMAGE_API_TOKEN;
  const cloudflareAccountId = platform.env.CLOUDFLARE_ACCOUNT_ID;

  const client = new Cloudflare({
    apiToken: imageApiToken,
  });


  const imageData = await client.images.v2.list({
    account_id: cloudflareAccountId
  })

  if (!imageData.images) {
    error(500, "Error loading images")
  }

  const images = imageData.images.map(image => {
    const id = image.id;
    const variants = image.variants;
    if (!variants || !id) { return undefined }
    return {
      ...image,
      id,
      variants,
      thumbnail: variants.find(url => url.endsWith('/thumbnail'))
    }
  }).filter(image => image !== undefined)

  return { user, images: images };
};

export const actions: Actions = {
  logout: async (event) => {
    if (!event.locals.session) {
      return fail(401);
    }
    const db = dbD1(event.platform);
    if (!db) {
      return fail(500, { message: 'Database not found' });
    }
    await auth.invalidateSession(db, event.locals.session.id);
    auth.deleteSessionTokenCookie(event);

    return redirect(302, '/demo/lucia/login');
  },
};

function requireLogin() {
  const { locals } = getRequestEvent();

  if (!locals.user) {
    return redirect(302, "/demo/lucia/login");
  }

  return locals.user;
}
