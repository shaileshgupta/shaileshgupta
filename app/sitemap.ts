import type { MetadataRoute } from "next";
import { SITE_URL, readingOrder } from "@/lib/book";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${SITE_URL}/`, priority: 0.8 },
    { url: `${SITE_URL}/the-third-freedom`, priority: 1 },
    ...readingOrder.map((s) => ({ url: `${SITE_URL}${s.href}`, priority: 0.6 })),
  ];
}
