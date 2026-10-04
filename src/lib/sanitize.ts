const ALLOWED_TAGS = ["p", "br", "strong", "em", "b", "i", "ul", "ol", "li", "h2", "h3", "h4", "blockquote", "a", "img"];

export function sanitizeHtml(input: string) {
  const strippedScripts = input
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/on\w+="[^"]*"/gi, "")
    .replace(/on\w+='[^']*'/gi, "")
    .replace(/javascript:/gi, "");
  return strippedScripts.replace(/<\/?([a-z0-9]+)([^>]*)>/gi, (full, tag: string, attrs: string) => {
    const name = tag.toLowerCase();
    if (!ALLOWED_TAGS.includes(name)) return "";
    if (name === "a") {
      const href = attrs.match(/href\s*=\s*["']([^"']+)["']/i)?.[1] ?? "";
      if (!href.startsWith("/") && !href.startsWith("https://") && !href.startsWith("http://") && !href.startsWith("mailto:")) {
        return "<a>";
      }
      return `<a href="${href.replace(/"/g, "")}" rel="noopener noreferrer">`;
    }
    if (name === "img") {
      const src = attrs.match(/src\s*=\s*["']([^"']+)["']/i)?.[1] ?? "";
      const alt = attrs.match(/alt\s*=\s*["']([^"']*)["']/i)?.[1] ?? "";
      if (!src.startsWith("/") && !src.startsWith("https://")) return "";
      return `<img src="${src.replace(/"/g, "")}" alt="${alt.replace(/"/g, "")}" />`;
    }
    return full.startsWith("</") ? `</${name}>` : `<${name}>`;
  });
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);
}

export function parseJson<T>(value: string | null | undefined, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}
