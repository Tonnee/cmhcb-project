import * as React from "react";
import type { Metadata } from "next";
import prisma from "@/lib/prisma";
import BlogsClientWrapper from "@/features/admin/components/blogs-client-wrapper";

export const metadata: Metadata = {
  title: "Manage Blog Posts | Admin Portal | CMHCB",
  description: "Create, update, and delete wellness articles and blog posts for Center for Mental Health and Care, Bangladesh.",
};

export const dynamic = "force-dynamic";

export default async function AdminBlogsPage(): Promise<React.JSX.Element> {
  // Fetch posts from database
  const posts = await prisma.blogPost.findMany({
    orderBy: { publishedAt: "desc" },
  });

  return (
    <BlogsClientWrapper initialPosts={posts} />
  );
}
