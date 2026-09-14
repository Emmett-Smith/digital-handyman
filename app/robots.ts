import type { MetadataRoute } from "next";
import { site } from "@/content/site";
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/c/", "/personalized/"],
    },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
