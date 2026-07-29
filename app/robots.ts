import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/(admin)/"],
      },
      {
        userAgent: [
          "GPTBot",
          "ChatGPT-User",
          "PerplexityBot",
          "ClaudeBot",
          "Google-Extended",
          "Bingbot",
          "Applebot-Extended",
        ],
        allow: "/",
        disallow: ["/api/", "/(admin)/"],
      },
    ],
    sitemap: "https://cmhcbd.com/sitemap.xml",
  };
}
