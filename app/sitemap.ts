import { getPosts } from "@/lib/notion";
import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://nagpurstartup.in";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPosts();
  const blogPosts = posts
    .filter((p: any) => !p.category?.toLowerCase().includes("job"))
    .map((p: any) => ({
      url: `${SITE_URL}/blog/${p.slug}`,
      lastModified: p.date ? new Date(p.date) : new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

  const staticPages = [
    { url: SITE_URL, priority: 1.0, changeFrequency: "daily" as const },
    { url: `${SITE_URL}/blog`, priority: 0.9, changeFrequency: "daily" as const },
    { url: `${SITE_URL}/insights`, priority: 0.9, changeFrequency: "daily" as const },
    { url: `${SITE_URL}/founder-stories`, priority: 0.9, changeFrequency: "weekly" as const },
    { url: `${SITE_URL}/startup-news`, priority: 0.9, changeFrequency: "daily" as const },
    { url: `${SITE_URL}/job-opportunities`, priority: 0.8, changeFrequency: "daily" as const },
  ].map((p) => ({ ...p, lastModified: new Date() }));

  return [...staticPages, ...blogPosts];
}
