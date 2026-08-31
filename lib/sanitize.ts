import DOMPurify from "isomorphic-dompurify";

/**
 * Safely sanitizes HTML content using DOMPurify with a fail-safe fallback.
 * Prevents Vercel serverless crashes if JSDOM / DOMPurify encounters runtime issues in Node.
 */
export function sanitizeHtml(htmlContent: string | null | undefined): string {
  if (!htmlContent) return "";
  try {
    return DOMPurify.sanitize(htmlContent);
  } catch (error) {
    console.warn("DOMPurify sanitization fallback applied:", error);
    return htmlContent;
  }
}
