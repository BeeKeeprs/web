import type { MetadataRoute } from "next";
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://webeelab.com",
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
