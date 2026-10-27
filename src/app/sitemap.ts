import type { MetadataRoute } from "next";
import { site } from "@/content/site";

const routes: { path: string; priority: number }[] = [
  { path: "/", priority: 1 },
  { path: "/products", priority: 0.9 },
  { path: "/products/iaac", priority: 0.9 },
  { path: "/design-services", priority: 0.7 },
  { path: "/industries", priority: 0.7 },
  { path: "/company", priority: 0.6 },
  { path: "/contact", priority: 0.8 },
  { path: "/trust", priority: 0.4 },
  { path: "/privacy", priority: 0.2 },
  { path: "/terms", priority: 0.2 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return routes.map((r) => ({
    url: `${site.url}${r.path === "/" ? "" : r.path}`,
    lastModified,
    changeFrequency: "monthly",
    priority: r.priority,
  }));
}
