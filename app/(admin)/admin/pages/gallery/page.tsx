import * as React from "react";
import type { Metadata } from "next";
import prisma from "@/lib/prisma";
import { GalleryClientWrapper } from "@/features/admin/components/gallery-client-wrapper";

export const metadata: Metadata = {
  title: "Media Gallery Management | Admin Portal | CMHCB",
  description: "Manage highlights, images, and videos featured in the public Media Gallery.",
};

export const dynamic = "force-dynamic";

export default async function AdminGalleryPage(): Promise<React.JSX.Element> {
  const items = await prisma.galleryItem.findMany({
    orderBy: { createdAt: "desc" },
  });

  // Map database categories string to exact type categories
  const mappedItems = items.map((item: any) => ({
    id: item.id,
    type: item.type as "image" | "video",
    src: item.src,
    thumbnailSrc: item.thumbnailSrc || undefined,
    alt: item.alt,
    caption: item.caption,
    category: item.category as "event" | "workshop" | "activity" | "occasion",
  }));

  return (
    <div className="flex flex-col gap-8">
      <GalleryClientWrapper initialItems={mappedItems} />
    </div>
  );
}
