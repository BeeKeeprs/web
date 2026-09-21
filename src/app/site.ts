// Vercel provides the production hostname at build time.
// Set SITE_URL when connecting a custom domain.
export const siteUrl = new URL(
  process.env.SITE_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "http://localhost:3000"),
);
