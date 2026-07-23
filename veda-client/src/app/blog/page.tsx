import type { Metadata } from "next";
import Link from "next/link";
import { Calendar, Tag, ArrowRight, Newspaper } from "lucide-react";
import { fetchWordPressPosts, isWordPressConfigured } from "@/utils/wordpress";

export const metadata: Metadata = {
  title: "Blog | VAIDYA ERP — Ayurvedic & Clinic Management Insights",
  description: "Practical guides on running an Ayurvedic clinic or hospital in India — patient records, NABH-aligned documentation, GST billing, WhatsApp automation, and more.",
  keywords: ["Ayurvedic clinic management blog", "NABH documentation guide", "clinic software India blog", "hospital management tips"],
};

// Normalized shape so the page renders identically regardless of source.
interface NormalizedPost {
  key: string;
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  tag: string | null;
  featuredImage: string | null;
}

async function getMongoPosts(tag?: string): Promise<NormalizedPost[]> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
    const url = tag ? `${apiUrl}/blog?tag=${encodeURIComponent(tag)}` : `${apiUrl}/blog`;
    const res = await fetch(url, { next: { revalidate: 300 } });
    if (!res.ok) return [];
    const posts = await res.json();
    return posts.map((p: any) => ({
      key: p._id, slug: p.slug, title: p.title, excerpt: p.excerpt,
      date: p.publishedAt, tag: p.tags?.[0] || null, featuredImage: p.coverImage || null,
    }));
  } catch {
    return [];
  }
}

async function getPosts(tag?: string): Promise<{ posts: NormalizedPost[]; source: "wordpress" | "builtin" }> {
  // WordPress headless is the primary source when configured — real editorial
  // tooling (SEO plugins, media library, scheduling) beats a bespoke admin UI
  // for actual content marketing. Falls back to the built-in blog otherwise.
  if (isWordPressConfigured()) {
    const wpPosts = await fetchWordPressPosts(tag);
    if (wpPosts.length > 0) {
      return {
        source: "wordpress",
        posts: wpPosts.map(p => ({
          key: String(p.id), slug: p.slug, title: p.title, excerpt: p.excerpt,
          date: p.date, tag: p.tags?.[0] || null, featuredImage: p.featuredImage,
        })),
      };
    }
  }
  return { posts: await getMongoPosts(tag), source: "builtin" };
}

export default async function BlogIndexPage({ searchParams }: { searchParams: Promise<{ tag?: string }> }) {
  const { tag } = await searchParams;
  const { posts } = await getPosts(tag);

  return (
    <div className="min-h-screen bg-[#F6F9F8] pt-32 pb-24 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-primary-50 border border-primary-200 text-primary-700 rounded-full text-[11px] font-bold mb-6 w-fit mx-auto tracking-wide">
            <Newspaper size={13} /> VAIDYA ERP BLOG
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-ink-900 tracking-tight mb-4">
            Running an Ayurvedic clinic, done right
          </h1>
          <p className="text-ink-500 max-w-xl mx-auto">
            Practical guides on patient records, NABH-aligned documentation, billing, and clinic operations — written for Indian Ayurvedic and multi-specialty clinics.
          </p>
        </div>

        {tag && (
          <div className="mb-8 flex items-center justify-center gap-2 text-sm">
            <span className="text-ink-500">Filtered by:</span>
            <span className="bg-primary-50 text-primary-700 px-3 py-1 rounded-full font-semibold">{tag}</span>
            <Link href="/blog" className="text-ink-400 hover:text-ink-600 underline text-xs">Clear</Link>
          </div>
        )}

        {posts.length === 0 ? (
          <div className="bg-white rounded-2xl border border-ink-100 p-16 text-center">
            <Newspaper size={32} className="mx-auto mb-4 text-ink-200" />
            <p className="text-ink-500 font-medium">No posts yet — check back soon.</p>
          </div>
        ) : (
          <div className="space-y-5">
            {posts.map((post) => (
              <Link
                key={post.key}
                href={`/blog/${post.slug}`}
                className="block bg-white rounded-2xl border border-ink-100 p-7 hover:border-primary-200 hover:shadow-sm transition-all group"
              >
                <div className="flex items-center gap-3 text-xs text-ink-400 mb-3">
                  <span className="flex items-center gap-1.5"><Calendar size={12} /> {new Date(post.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  {post.tag && <span className="flex items-center gap-1.5"><Tag size={12} /> {post.tag}</span>}
                </div>
                <h2 className="text-xl font-bold text-ink-900 group-hover:text-primary-700 transition-colors mb-2">{post.title}</h2>
                <p className="text-ink-500 text-sm leading-relaxed mb-4">{post.excerpt}</p>
                <span className="inline-flex items-center gap-1.5 text-primary-600 text-sm font-semibold">
                  Read more <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
