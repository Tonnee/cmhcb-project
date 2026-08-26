/**
 * Converts plain text content with newlines into clean HTML paragraphs,
 * while preserving content that already contains HTML markup.
 */
export function formatContentToHtml(content: string | null | undefined): string {
  if (!content) return "";
  const trimmed = content.trim();
  if (!trimmed) return "";

  // If content already contains common HTML block elements, return as is
  if (/<(p|h[1-6]|ul|ol|li|div|blockquote|table|section|article)[^>]*>/i.test(trimmed)) {
    return trimmed;
  }

  // Convert double newlines into separate paragraphs and single newlines into <br />
  const paragraphs = trimmed
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);

  return paragraphs
    .map((p) => `<p>${p.replace(/\n/g, "<br />")}</p>`)
    .join("\n");
}
