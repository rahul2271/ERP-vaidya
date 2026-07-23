// Minimal, dependency-free markdown-ish renderer for blog content.
// Supports: # headings, **bold**, *italic*, [links](url), paragraphs, and
// - bullet lists. Deliberately lightweight — avoids adding an npm dependency
// that would need a fresh `npm install` in an environment where that's unreliable.
export function renderMarkdownLite(md: string): string {
  if (!md) return "";

  const escapeHtml = (s: string) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  const inline = (s: string) =>
    escapeHtml(s)
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.+?)\*/g, "<em>$1</em>")
      .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-primary-600 underline hover:text-primary-700" target="_blank" rel="noopener noreferrer">$1</a>');

  const lines = md.split("\n");
  const html: string[] = [];
  let inList = false;

  for (const raw of lines) {
    const line = raw.trim();

    if (!line) {
      if (inList) { html.push("</ul>"); inList = false; }
      continue;
    }

    if (line.startsWith("### ")) {
      if (inList) { html.push("</ul>"); inList = false; }
      html.push(`<h3 class="text-lg font-bold text-ink-900 mt-8 mb-3">${inline(line.slice(4))}</h3>`);
    } else if (line.startsWith("## ")) {
      if (inList) { html.push("</ul>"); inList = false; }
      html.push(`<h2 class="text-xl font-bold text-ink-900 mt-10 mb-4">${inline(line.slice(3))}</h2>`);
    } else if (line.startsWith("# ")) {
      if (inList) { html.push("</ul>"); inList = false; }
      html.push(`<h1 class="text-2xl font-bold text-ink-900 mt-10 mb-4">${inline(line.slice(2))}</h1>`);
    } else if (line.startsWith("- ") || line.startsWith("* ")) {
      if (!inList) { html.push('<ul class="list-disc pl-6 space-y-1.5 my-4">'); inList = true; }
      html.push(`<li class="text-ink-700">${inline(line.slice(2))}</li>`);
    } else {
      if (inList) { html.push("</ul>"); inList = false; }
      html.push(`<p class="text-ink-700 leading-relaxed my-4">${inline(line)}</p>`);
    }
  }
  if (inList) html.push("</ul>");

  return html.join("\n");
}
