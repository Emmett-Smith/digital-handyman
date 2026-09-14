import type { MetadataRoute } from "next";
import { site } from "@/content/site";
import { industries } from "@/content/industries";
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: site.url, priority: 1 },
    ...industries.map((i) => ({
      url: `${site.url}/for/${i.slug}`,
      priority: 0.8,
    })),
    { url: `${site.url}/call`, priority: 0.5 },
  ];
}
