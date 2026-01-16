import * as auth from "$lib/server/auth";
import { error, fail, redirect } from "@sveltejs/kit";
import { getRequestEvent } from "$app/server";
import type { Actions, PageServerLoad } from "./$types";
import { dbD1 } from "$lib/server/db";
import { getImages } from "$lib/images";
import { resolve } from "$app/paths";

export const load: PageServerLoad = async ({ platform }) => {
  const user = requireLogin();

  if (!platform) {
    error(500, "Platform not found");
  }

  const images = await getImages(platform);

  return { user, images: images };
};

export const actions: Actions = {
  logout: async (event) => {
    if (!event.locals.session) {
      return fail(401);
    }
    const db = dbD1(event.platform);
    if (!db) {
      return fail(500, { message: "Database not found" });
    }
    await auth.invalidateSession(db, event.locals.session.id);
    auth.deleteSessionTokenCookie(event);

    return redirect(302, resolve('/admin/login'));
  },
};

function requireLogin() {
  const { locals } = getRequestEvent();

  if (!locals.user) {
    return redirect(302, resolve("/admin/login"));
  }

  return locals.user;
}
