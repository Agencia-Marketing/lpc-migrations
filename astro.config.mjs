import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import sitemap from '@astrojs/sitemap';
import { SITE } from './src/config/site.ts';

export default defineConfig({
  adapter: cloudflare({
    platformProxy: {
      enabled: true,
    },
  }),
  integrations: [sitemap()],
  // Canonical origin for canonicals, hreflang and the generated sitemap.
  // Sourced from src/config/site.ts so the domain lives in exactly one place.
  site: SITE.url,
  trailingSlash: 'never',
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en'],
    routing: {
      prefixDefaultLocale: false, // / for Spanish, /en/ for English
    },
  },
});
