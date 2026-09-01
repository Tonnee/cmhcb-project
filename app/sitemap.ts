import type { MetadataRoute } from "next";
import prisma from "@/lib/prisma";
import { THERAPISTS_DATA } from "@/features/therapists/data/therapists";
import { SERVICES } from "@/features/services/data/services";
import { TRAININGS } from "@/features/training/data/trainings";
import { BLOG_POSTS } from "@/features/blog/data/blogs";
import { EVENTS_DATA } from "@/features/events/data/events";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://cmhcbd.com";

  // Static routes
  const routes = [
    "",
    "/about",
    "/affiliation",
    "/appointment",
    "/blog",
    "/contact",
    "/events-workshops",
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

  // Fetch DB items with static fallbacks
  let dbTherapists: any[] = [];
  let dbServices: any[] = [];
  let dbTrainings: any[] = [];
  let dbBlogs: any[] = [];

  try {
    const [t, s, tr, b] = await Promise.all([
      prisma.therapist.findMany({ select: { id: true, updatedAt: true } }),
      prisma.service.findMany({ select: { slug: true, updatedAt: true } }),
      prisma.training.findMany({ select: { slug: true, updatedAt: true } }),
      prisma.blogPost.findMany({ select: { slug: true, updatedAt: true } }),
    ]);
    dbTherapists = t;
    dbServices = s;
    dbTrainings = tr;
    dbBlogs = b;
  } catch (err) {
    console.error("Error fetching sitemap entities:", err);
  }

  const therapistRoutes = (dbTherapists.length > 0 ? dbTherapists.map((t) => ({ id: t.id, date: t.updatedAt })) : THERAPISTS_DATA.map((t) => ({ id: t.id, date: new Date() }))).map((t) => ({
    url: `${baseUrl}/therapists/${t.id}`,
    lastModified: new Date(t.date || new Date()),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const serviceRoutes = (dbServices.length > 0 ? dbServices.map((s) => ({ slug: s.slug, date: s.updatedAt })) : SERVICES.map((s) => ({ slug: s.slug, date: new Date() }))).map((s) => ({
    url: `${baseUrl}/services/${s.slug}`,
    lastModified: new Date(s.date || new Date()),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const trainingRoutes = (dbTrainings.length > 0 ? dbTrainings.map((tr) => ({ slug: tr.slug, date: tr.updatedAt })) : TRAININGS.map((tr) => ({ slug: tr.slug, date: new Date() }))).map((tr) => ({
    url: `${baseUrl}/training/${tr.slug}`,
    lastModified: new Date(tr.date || new Date()),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const blogRoutes = (dbBlogs.length > 0 ? dbBlogs.map((bp) => ({ slug: bp.slug, date: bp.updatedAt })) : BLOG_POSTS.map((bp) => ({ slug: bp.slug, date: new Date() }))).map((bp) => ({
    url: `${baseUrl}/blog/${bp.slug}`,
    lastModified: new Date(bp.date || new Date()),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  const eventRoutes = EVENTS_DATA.map((ev) => ({
    url: `${baseUrl}/events-workshops/${ev.slug}`,
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
