// Headless WordPress client — fetches posts from a WordPress instance's REST
// API (wp-json/wp/v2) rather than requiring content to be written through
// this app's own admin UI. WordPress gives real editorial tooling (Yoast/Rank
// Math SEO, media library, scheduled publishing, revision history) that a
// bespoke admin panel doesn't try to replicate.
//
// Setup: point NEXT_PUBLIC_WORDPRESS_API_URL at your WordPress site's REST
// API base, e.g. https://blog.vaidyaerp.in/wp-json/wp/v2
// If unset, isWordPressConfigured() returns false and callers should fall
// back to the built-in Mongo-backed blog (see /dashboard/blog admin page).

export interface WPPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  authorName: string;
  featuredImage: string | null;
  tags: string[];
  seoTitle?: string;
  seoDescription?: string;
}

export function isWordPressConfigured(): boolean {
  return !!process.env.NEXT_PUBLIC_WORDPRESS_API_URL;
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').trim();
}

function mapPost(raw: any): WPPost {
  const featuredMedia = raw._embedded?.['wp:featuredmedia']?.[0];
  const author = raw._embedded?.author?.[0];
  const terms: any[] = raw._embedded?.['wp:term']?.flat() || [];
  const tags = terms.filter(t => t.taxonomy === 'post_tag').map(t => t.name);

  // Rank Math / Yoast both expose SEO fields differently depending on plugin
  // and REST API exposure settings — fall back gracefully if neither is present.
  const seoTitle = raw.yoast_head_json?.title || raw.rank_math_title || undefined;
  const seoDescription = raw.yoast_head_json?.description || raw.rank_math_description || undefined;

  return {
    id: raw.id,
    slug: raw.slug,
    title: stripHtml(raw.title?.rendered || ''),
    excerpt: stripHtml(raw.excerpt?.rendered || ''),
    content: raw.content?.rendered || '',
    date: raw.date,
    authorName: author?.name || 'VAIDYA ERP Team',
    featuredImage: featuredMedia?.source_url || null,
    tags,
    seoTitle,
    seoDescription,
  };
}

export async function fetchWordPressPosts(tag?: string): Promise<WPPost[]> {
  const base = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;
  if (!base) return [];

  try {
    let url = `${base}/posts?_embed&per_page=50`;
    if (tag) {
      // Resolve tag name -> tag ID first, since WP filters by ID not name
      const tagRes = await fetch(`${base}/tags?search=${encodeURIComponent(tag)}`, { next: { revalidate: 300 } });
      const tags = await tagRes.json();
      if (tags?.[0]?.id) url += `&tags=${tags[0].id}`;
    }
    const res = await fetch(url, { next: { revalidate: 300 } });
    if (!res.ok) return [];
    const raw = await res.json();
    return raw.map(mapPost);
  } catch (error) {
    console.error('Failed to fetch WordPress posts:', error);
    return [];
  }
}

export async function fetchWordPressPostBySlug(slug: string): Promise<WPPost | null> {
  const base = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;
  if (!base) return null;

  try {
    const res = await fetch(`${base}/posts?slug=${encodeURIComponent(slug)}&_embed`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    const raw = await res.json();
    if (!raw?.[0]) return null;
    return mapPost(raw[0]);
  } catch (error) {
    console.error('Failed to fetch WordPress post by slug:', error);
    return null;
  }
}
