"use client";

import { useEffect, useState } from "react";
import axios from "@/utils/axiosConfig";
import toast from "react-hot-toast";
import { Newspaper, Plus, Trash2, Edit3, Eye, X, Loader2 } from "lucide-react";

const EMPTY_FORM = {
  title: "", slug: "", excerpt: "", content: "", coverImage: "",
  tags: "", authorName: "", published: false,
  seoTitle: "", seoDescription: "", seoKeywords: "",
};

export default function BlogAdminPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<any>(null); // null = closed, {} = new, {...} = edit
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  useEffect(() => { loadPosts(); }, []);

  const loadPosts = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("/blog/admin/all", { headers: { Authorization: `Bearer ${token}` } });
      setPosts(res.data || []);
    } catch (err) {
      console.error("Failed to load posts:", err);
      toast.error("Couldn't load posts.");
    } finally {
      setLoading(false);
    }
  };

  const openNew = () => { setForm(EMPTY_FORM); setEditing({}); };
  const openEdit = (post: any) => {
    setForm({
      title: post.title || "", slug: post.slug || "", excerpt: post.excerpt || "",
      content: post.content || "", coverImage: post.coverImage || "",
      tags: (post.tags || []).join(", "), authorName: post.authorName || "",
      published: !!post.published,
      seoTitle: post.seoTitle || "", seoDescription: post.seoDescription || "",
      seoKeywords: (post.seoKeywords || []).join(", "),
    });
    setEditing(post);
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.excerpt.trim() || !form.content.trim()) {
      toast.error("Title, excerpt, and content are required.");
      return;
    }
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      const payload = {
        ...form,
        tags: form.tags.split(",").map(t => t.trim()).filter(Boolean),
        seoKeywords: form.seoKeywords.split(",").map(t => t.trim()).filter(Boolean),
      };
      const config = { headers: { Authorization: `Bearer ${token}` } };

      if (editing?._id) {
        await axios.patch(`/blog/${editing._id}`, payload, config);
        toast.success("Post updated.");
      } else {
        await axios.post("/blog", payload, config);
        toast.success("Post created.");
      }
      setEditing(null);
      loadPosts();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to save post.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Delete "${title}"? This can't be undone.`)) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/blog/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      toast.success("Post deleted.");
      loadPosts();
    } catch {
      toast.error("Failed to delete post.");
    }
  };

  const togglePublish = async (post: any) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(`/blog/${post._id}`, { published: !post.published }, { headers: { Authorization: `Bearer ${token}` } });
      toast.success(post.published ? "Unpublished." : "Published!");
      loadPosts();
    } catch {
      toast.error("Failed to update.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink-900 flex items-center gap-2.5">
            <Newspaper size={20} className="text-primary-600" /> Blog
          </h1>
          <p className="text-sm text-ink-500 mt-1">Platform content for organic SEO growth — public at /blog.</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary-700 transition-all">
          <Plus size={16} /> New post
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-ink-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-ink-100 text-[11px] uppercase tracking-wide text-ink-400 font-semibold">
              <th className="p-4 pl-6">Title</th>
              <th className="p-4">Status</th>
              <th className="p-4">Views</th>
              <th className="p-4 pr-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-50">
            {loading ? (
              <tr><td colSpan={4} className="p-16 text-center text-ink-400 text-sm">Loading…</td></tr>
            ) : posts.length === 0 ? (
              <tr><td colSpan={4} className="p-16 text-center text-ink-400 text-sm">No posts yet — create your first one.</td></tr>
            ) : posts.map(post => (
              <tr key={post._id} className="hover:bg-ink-50/50">
                <td className="p-4 pl-6">
                  <p className="font-semibold text-ink-900 text-sm">{post.title}</p>
                  <p className="text-xs text-ink-400 font-mono">/blog/{post.slug}</p>
                </td>
                <td className="p-4">
                  <button onClick={() => togglePublish(post)} className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded ${post.published ? 'bg-secondary-50 text-secondary-700' : 'bg-ink-100 text-ink-500'}`}>
                    {post.published ? 'Published' : 'Draft'}
                  </button>
                </td>
                <td className="p-4 text-sm text-ink-500">{post.viewCount || 0}</td>
                <td className="p-4 pr-6 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    {post.published && (
                      <a href={`/blog/${post.slug}`} target="_blank" rel="noopener noreferrer" className="p-2 text-ink-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all">
                        <Eye size={15} />
                      </a>
                    )}
                    <button onClick={() => openEdit(post)} className="p-2 text-ink-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all">
                      <Edit3 size={15} />
                    </button>
                    <button onClick={() => handleDelete(post._id, post.title)} className="p-2 text-ink-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing !== null && (
        <div className="fixed inset-0 z-[100] bg-ink-900/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-7 shadow-lg relative my-8 max-h-[90vh] overflow-y-auto">
            <button onClick={() => setEditing(null)} className="absolute top-5 right-5 text-ink-400 hover:text-ink-700">
              <X size={18} />
            </button>
            <h3 className="font-bold text-ink-900 text-lg mb-6">{editing._id ? "Edit post" : "New post"}</h3>

            <div className="space-y-4">
              <Field label="Title" value={form.title} onChange={v => setForm({ ...form, title: v })} />
              <Field label="Slug (optional — auto-generated from title)" value={form.slug} onChange={v => setForm({ ...form, slug: v })} />
              <Field label="Excerpt" value={form.excerpt} onChange={v => setForm({ ...form, excerpt: v })} textarea rows={2} />
              <Field label="Content (supports # headings, **bold**, *italic*, [links](url), - lists)" value={form.content} onChange={v => setForm({ ...form, content: v })} textarea rows={10} mono />
              <Field label="Cover image URL (optional)" value={form.coverImage} onChange={v => setForm({ ...form, coverImage: v })} />
              <div className="grid grid-cols-2 gap-4">
                <Field label="Tags (comma-separated)" value={form.tags} onChange={v => setForm({ ...form, tags: v })} />
                <Field label="Author name" value={form.authorName} onChange={v => setForm({ ...form, authorName: v })} />
              </div>

              <div className="pt-4 border-t border-ink-100">
                <p className="text-xs font-semibold text-ink-500 uppercase tracking-wide mb-3">SEO (optional overrides)</p>
                <div className="space-y-3">
                  <Field label="SEO title" value={form.seoTitle} onChange={v => setForm({ ...form, seoTitle: v })} />
                  <Field label="SEO description" value={form.seoDescription} onChange={v => setForm({ ...form, seoDescription: v })} textarea rows={2} />
                  <Field label="SEO keywords (comma-separated)" value={form.seoKeywords} onChange={v => setForm({ ...form, seoKeywords: v })} />
                </div>
              </div>

              <label className="flex items-center gap-2.5 pt-2">
                <input type="checkbox" checked={form.published} onChange={e => setForm({ ...form, published: e.target.checked })} className="w-4 h-4 rounded accent-primary-600" />
                <span className="text-sm font-medium text-ink-700">Published (visible at /blog)</span>
              </label>

              <button
                onClick={handleSave}
                disabled={saving}
                className="w-full py-3 bg-primary-600 text-white rounded-xl font-semibold text-sm hover:bg-primary-700 transition-all disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
              >
                {saving ? <Loader2 size={16} className="animate-spin" /> : null}
                {editing._id ? "Save changes" : "Create post"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, value, onChange, textarea, rows, mono }: any) {
  return (
    <div>
      <label className="text-xs font-semibold text-ink-500 uppercase tracking-wide mb-1.5 block">{label}</label>
      {textarea ? (
        <textarea
          value={value}
          onChange={e => onChange(e.target.value)}
          rows={rows || 3}
          className={`w-full border border-ink-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 resize-none ${mono ? 'font-mono text-xs' : ''}`}
        />
      ) : (
        <input
          value={value}
          onChange={e => onChange(e.target.value)}
          className="w-full border border-ink-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500"
        />
      )}
    </div>
  );
}
