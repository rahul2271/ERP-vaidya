import { MetadataRoute } from "next";

const STATIC_PAGES: { path: string; priority: number }[] = [
  { path: "/", priority: 1.0 },
  { path: "/login", priority: 0.5 },
  { path: "/signup", priority: 0.8 },
  { path: "/blog", priority: 0.8 },
  { path: "/nabh-compliance", priority: 0.7 },
  { path: "/ai-prakriti", priority: 0.8 },
  { path: "/whatsapp-crm", priority: 0.8 },
  { path: "/god-mode-audit", priority: 0.8 },
  { path: "/pharmacy-pos", priority: 0.8 },
  { path: "/digital-emr", priority: 0.8 },
  { path: "/refund", priority: 0.3 },
  { path: "/terms", priority: 0.3 },
  { path: "/privacy", priority: 0.3 },
];

async function getPublishedSlugs(): Promise<{ slug: string; publishedAt: string }[]> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
    const res = await fetch(`${apiUrl}/blog`, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const posts = await res.json();
    return posts.map((p: any) => ({ slug: p.slug, publishedAt: p.publishedAt }));
  } catch {
    return [];
  }
}

// Dynamic sitemap — unlike the old static sitemap.xml, this automatically
// picks up every new blog post the moment it's published, so new SEO content
// gets discovered without a manual sitemap edit.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = "https://vaidyaerp.in";
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_PAGES.map(p => ({
    url: `${base}${p.path}`,
    lastModified: now,
    priority: p.priority,
  }));

  const posts = await getPublishedSlugs();
  const blogEntries: MetadataRoute.Sitemap = posts.map(p => ({
    url: `${base}/blog/${p.slug}`,
    lastModified: p.publishedAt ? new Date(p.publishedAt) : now,
    priority: 0.7,
  }));

  return [...staticEntries, ...blogEntries];
}
