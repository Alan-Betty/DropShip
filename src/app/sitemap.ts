import type { MetadataRoute } from "next";
import { store } from "@/config/store";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: store.siteUrl, changeFrequency: "weekly", priority: 1 },
    { url: `${store.siteUrl}/policies`, changeFrequency: "yearly", priority: 0.3 },
  ];
}
