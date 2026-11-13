import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  images: { formats: ["image/webp", "image/avif"] },
  experimental: { optimizePackageImports: ["lucide-react"] },
  // The embedded app is a single-page build; any app route under /app-demo serves its index.
  // The app entry page must never be served from cache, or visitors keep an old build.
  async headers() {
    return [{ source: "/app-demo/:path((?!_expo|assets).*)", headers: [{ key: "Cache-Control", value: "no-cache, must-revalidate" }] }];
  },
  async rewrites() {
    return [{ source: "/app-demo/:route((?!_expo|assets)[^.]*)", destination: "/app-demo/index.html" }];
  },
};
export default nextConfig;
