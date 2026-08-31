/**
 * Safely sanitizes HTML content for Server (SSR) and Client rendering.
 * Avoids importing heavy JSDOM at module load time to prevent Vercel serverless crashes.
 */
export function sanitizeHtml(htmlContent: string | null | undefined): string {
  if (!htmlContent) return "";
  const str = String(htmlContent);

  // Server-side (Node.js / Vercel Serverless Function):
  // Clean dangerous tags without loading JSDOM module
  if (typeof window === "undefined") {
    return str
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
      .replace(/on\w+\s*=\s*"[^"]*"/gi, "")
      .replace(/on\w+\s*=\s*'[^']*'/gi, "")
      .replace(/javascript:/gi, "");
  }

  // Client-side (Browser):
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const DOMPurify = require("isomorphic-dompurify");
    const purify = DOMPurify.default || DOMPurify;
    return purify.sanitize(str);
  } catch {
    return str;
  }
}
