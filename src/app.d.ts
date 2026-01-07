// See https://svelte.dev/docs/kit/types#app.d.ts

import type { Image } from "$lib/images";

// for information about these interfaces
declare global {
  namespace App {
    interface Platform {
      env: {
        DB: D1Database;
        IMAGE_API_TOKEN: string;
        CLOUDFLARE_ACCOUNT_ID: string;
        CLOUDFLARE_ACCOUNT_HASH: string;
      };
      ctx: ExecutionContext;
      caches: CacheStorage;
      cf?: IncomingRequestCfProperties;
    }

    interface Locals {
      user: import("$lib/server/auth").SessionValidationResult["user"];
      session: import("$lib/server/auth").SessionValidationResult["session"];
    }

    interface PageState {
      selectedImage: {
        image: Image;
      };
    }

    // interface Error {}
    // interface Locals {}
    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
  }
}

export {};
