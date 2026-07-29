/// <reference types="astro/client" />

type CloudflareEnv = {
  /** Cloudflare Turnstile secret key. Set as an encrypted environment
   *  variable in the Cloudflare dashboard (Production + Preview), and in
   *  .dev.vars for local Miniflare runs. Never committed. */
  TURNSTILE_SECRET: string;
  /** Resend API key for transactional email. Same handling as above:
   *  encrypted variable in the Cloudflare dashboard, .dev.vars locally. */
  RESEND_API_KEY: string;
};

type Runtime = import('@astrojs/cloudflare').Runtime<CloudflareEnv>;

declare namespace App {
  interface Locals extends Runtime {}
}
