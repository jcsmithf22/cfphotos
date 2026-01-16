import { form, getRequestEvent } from "$app/server";
import * as auth from "$lib/server/auth";
import { dbD1 } from "$lib/server/db";
import * as table from "$lib/server/db/schema";
import { hash, verify } from "@node-rs/argon2";
import { encodeBase32LowerCase } from "@oslojs/encoding";
import { error, invalid, redirect } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
import * as v from "valibot";
import { resolve } from "$app/paths";

function generateUserId() {
  // ID with 120 bits of entropy, or about the same as UUID v4.
  const bytes = crypto.getRandomValues(new Uint8Array(15));
  const id = encodeBase32LowerCase(bytes);
  return id;
}

export const login = form(
  v.object({
    username: v.string(),
    password: v.string(),
  }),
  async ({ username, password }, issue) => {
    const event = getRequestEvent();
    const db = dbD1(event.platform);
    if (!db) {
      error(500, "Database not found");
    }

    const results = await db
      .select()
      .from(table.user)
      .where(eq(table.user.username, username));

    const existingUser = results.at(0);
    if (!existingUser) {
      invalid(issue.username("Incorrect username or password"));
    }

    const validPassword = await verify(existingUser.passwordHash, password, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    });
    if (!validPassword) {
      invalid(issue.username("Incorrect username or password"));
    }

    const sessionToken = auth.generateSessionToken();
    const session = await auth.createSession(db, sessionToken, existingUser.id);
    auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);

    return redirect(302, resolve("/admin/gallery"));
  },
);

export const register = form(
  v.object({
    username: v.pipe(
      v.string("Username is required"),
      v.minLength(3, "Username must be at least 3 characters"),
      v.maxLength(31, "Username must be at most 31 characters"),
      v.regex(
        /^[a-z0-9_-]+$/,
        "Username must be alphanumeric and can contain underscores and hyphens",
      ),
    ),
    password: v.pipe(
      v.string("Password is required"),
      v.minLength(6, "Password must be at least 6 characters"),
      v.maxLength(255, "Password must be at most 255 characters"),
    ),
  }),
  async ({ username, password }) => {
    const event = getRequestEvent();
    const db = dbD1(event.platform);
    if (!db) {
      error(500, "Database not found");
    }
    const userId = generateUserId();
    const passwordHash = await hash(password, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    });

    try {
      await db
        .insert(table.user)
        .values({ id: userId, username, passwordHash });

      const sessionToken = auth.generateSessionToken();
      const session = await auth.createSession(db, sessionToken, userId);
      auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);
    } catch {
      error(500, "An error has occurred");
    }
    return redirect(302, resolve("/admin/gallery"));
  },
);
