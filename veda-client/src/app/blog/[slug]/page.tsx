import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, Tag, ArrowLeft, User } from "lucide-react";
import { renderMarkdownLite } from "@/utils/markdownLite";
import { fetchWordPressPostBySlug, isWordPressConfigured } from "@/utils/wordpress";

interface NormalizedPost {
  title: string;
  excerpt: string;
  contentHtml: string; // always resolved to final HTML before rendering
  date: string;
  authorName: string;
  tags: string[];
  coverImage: string | null;
  seoTitle?: string;
  seoDescription?: string;
}

async function getMongoPost(slug: string): Promise<NormalizedPost | null> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
    const res = await fetch(`${apiUrl}/blog/slug/${slug}`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    const post = await res.json();
    return {
      title: post.title, excerpt: post.excerpt, contentHtml: renderMarkdownLite(post.content),
      date: post.publishedAt, authorName: post.authorName, tags: post.tags || [],
      coverImage: post.coverImage || null, seoTitle: post.seoTitle, seoDescription: post.seoDescription,
    };
  } catch {
    return null;
  }
}

async function getPost(slug: string): Promise<NormalizedPost | null> {
  // WordPress headless is the primary source when configured (see /blog/utils/wordpress.ts).
  if (isWordPressConfigured()) {
    const wp = await fetchWordPressPostBySlug(slug);
    if (wp) {
      return {
        title: wp.title, excerpt: wp.excerpt, contentHtml: wp.content, // WP content is already HTML
        date: wp.date, authorName: wp.authorName, tags: wp.tags,
        coverImage: wp.featuredImage, seoTitle: wp.seoTitle, seoDescription: wp.seoDescription,
      };
    }
  }
  return getMongoPost(slug);
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Post not found | VAIDYA ERP Blog" };

  const title = post.seoTitle || `${post.title} | VAIDYA ERP Blog`;
  const description = post.seoDescription || post.excerpt;

  return {
    title,
    description,
    keywords: post.tags,
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime: post.date,
      images: post.coverImage ? [{ url: post.coverImage }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: post.coverImage ? [post.coverImage] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    author: { "@type": "Person", name: post.authorName },
    publisher: { "@type": "Organization", name: "VAIDYA ERP" },
  };

  return (
    <div className="min-h-screen bg-[#F6F9F8] pt-32 pb-24 px-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />

      <div className="max-w-2xl mx-auto">
        <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm text-ink-500 hover:text-primary-600 mb-8 font-medium">
          <ArrowLeft size={14} /> All posts
        </Link>

        <div className="flex items-center gap-4 text-xs text-ink-400 mb-4">
          <span className="flex items-center gap-1.5"><Calendar size={12} /> {new Date(post.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
          <span className="flex items-center gap-1.5"><User size={12} /> {post.authorName}</span>
        </div>

        <h1 className="font-display text-2xl md:text-3xl font-bold text-ink-900 tracking-tight mb-6">{post.title}</h1>

        {post.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {post.tags.map((tag: string) => (
              <Link key={tag} href={`/blog?tag=${encodeURIComponent(tag)}`} className="flex items-center gap-1 text-[11px] font-semibold bg-primary-50 text-primary-700 px-2.5 py-1 rounded-full hover:bg-primary-100">
                <Tag size={10} /> {tag}
              </Link>
            ))}
          </div>
        )}

        {post.coverImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={post.coverImage} alt={post.title} className="w-full rounded-2xl mb-10 border border-ink-100" />
        )}

        <article
          className="wp-content"
          dangerouslySetInnerHTML={{ __html: post.contentHtml }}
        />

        <div className="mt-16 pt-8 border-t border-ink-200 text-center">
          <p className="text-sm text-ink-500 mb-4">Running an Ayurvedic clinic and tired of spreadsheets?</p>
          <Link href="/signup" className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-primary-700 transition-all">
            Start your 15-day free trial
          </Link>
        </div>
      </div>
    </div>
  );
}
