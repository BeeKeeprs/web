import type { MetadataRoute } from "next";
import { siteUrl } from "./site";
export default function sitemap(): MetadataRoute.Sitemap {
  return ["/", "/products", "/products/smart-hive", "/products/gate", "/app", "/about", "/contact"].map((path) => ({
    url: new URL(path, siteUrl).toString(),
    changeFrequency: "monthly" as const,
    priority: path === "/" ? 1 : 0.8,
  }));
}
