import type { MetadataRoute } from "next";
import { siteMeta } from "./site-meta";

export default function sitemap(): MetadataRoute.Sitemap {
  return [{url: `${siteMeta.url}/`, changeFrequency: "monthly", priority: 1}];
}
