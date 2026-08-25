import type { MetadataRoute } from "next";
import { THERAPISTS_DATA } from "@/features/therapists/data/therapists";
import { SERVICES } from "@/features/services/data/services";
import { TRAININGS } from "@/features/training/data/trainings";
import { BLOG_POSTS } from "@/features/blog/data/blogs";
import { EVENTS_DATA } from "@/features/events/data/events";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://cmhcbd.com";

  // Static routes
  const routes = [
    "",
    "/about",
    "/affiliation",
    "/appointment",
    "/blog",
    "/contact",
    "/events",
    "/faqs",
    "/gallery",
    "/privacy-policy",
    "/services",
    "/success-stories",
    "/support",
    "/terms",
    "/therapists",
    "/training",
    "/workshops",
    "/legal/community-service",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  // Dynamic routes
  const therapistRoutes = THERAPISTS_DATA.map((t) => ({
    url: `${baseUrl}/therapists/${t.id}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const serviceRoutes = SERVICES.map((s) => ({
    url: `${baseUrl}/services/${s.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const trainingRoutes = TRAININGS.map((tr) => ({
    url: `${baseUrl}/training/${tr.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const blogRoutes = BLOG_POSTS.map((bp) => ({
    url: `${baseUrl}/blog/${bp.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  const eventRoutes = EVENTS_DATA.map((ev) => ({
    url: `${baseUrl}/events/${ev.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  const workshopRoutes = EVENTS_DATA.filter((e) =>
    e.tags.some((tag) => tag.toLowerCase() === "workshop")
  ).map((ws) => ({
    url: `${baseUrl}/workshops/${ws.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [
    ...routes,
    ...therapistRoutes,
    ...serviceRoutes,
    ...trainingRoutes,
    ...blogRoutes,
    ...eventRoutes,
    ...workshopRoutes,
  ];
}
