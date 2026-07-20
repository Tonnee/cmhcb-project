import * as React from "react";
import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { SectionHeading } from "@/components/shared/section-heading";
import GalleryView from "@/features/gallery/components/gallery-view";
import { getRequiredAdminSession } from "@/app/(admin)/admin/admin-management";
import prisma from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Media Gallery | CMHCB",
  description: "Explore photos and videos from Center for Mental Health and Care Bangladesh (CMHCB) events, workshops, and activities.",
};

export const dynamic = "force-dynamic";

const DEFAULT_ITEMS = [
  {
    type: "image",
    src: "/hero-image/group-therapy-support-circle.png",
    alt: "Group Therapy Session",
    caption: "A supportive environment during our weekly group counseling session.",
    category: "event",
  },
  {
    type: "image",
    src: "/hero-image/psychotherapy-counseling-session.png",
    alt: "Psychotherapy Session",
    caption: "One-on-one psychological support provided by our clinical team.",
    category: "activity",
  },
  {
    type: "image",
    src: "/understanding-anxiety-workshop-event.png",
    alt: "Anxiety Coping Workshop",
    caption: "Interactive learning during the Understanding Anxiety workshop.",
    category: "workshop",
  },
  {
    type: "image",
    src: "/mental-health-training-program.png",
    alt: "Mental Health Advocacy Training",
    caption: "Participants sharing experiences in the psychological advocacy workshop.",
    category: "workshop",
  },
  {
    type: "image",
    src: "/compassionate-mental-health-professional.png",
    alt: "Compassionate Counseling",
    caption: "Our counselors discussing community mental health strategies.",
    category: "activity",
  },
  {
    type: "image",
    src: "/cmhcb-mental-health-care.png",
    alt: "Art Therapy Session",
    caption: "Art and creative therapy used as tools for emotional regulation.",
    category: "activity",
  },
  {
    type: "image",
    src: "/cmhcb-mental-health-care-bw.png",
    alt: "Inauguration Ceremony",
    caption: "Reflecting on the milestone inauguration of CMHCB in Dhaka.",
    category: "occasion",
  },
  {
    type: "image",
    src: "/hero-image/family-therapy-psychologist-office.png",
    alt: "Annual Caregivers Day",
    caption: "Interactive counselor sessions during the annual caregivers meet.",
    category: "occasion",
  },
  {
    type: "video",
    src: "https://assets.mixkit.co/videos/preview/mixkit-therapist-talking-to-a-patient-41804-large.mp4",
    alt: "Therapist Patient Consultation",
    caption: "CMHCB Video Feature: A simulation showcasing patient-centric clinical consultation.",
    category: "event",
  },
];

export default async function GalleryPage(): Promise<React.JSX.Element> {
  let isAdmin = false;
  try {
    await getRequiredAdminSession();
    isAdmin = true;
  } catch {
    isAdmin = false;
  }

  let dbItems = await prisma.galleryItem.findMany({
    orderBy: { createdAt: "desc" },
  });

  if (dbItems.length === 0) {
    try {
      await prisma.galleryItem.createMany({
        data: DEFAULT_ITEMS.map((item) => ({
          ...item,
          lastUpdatedBy: "System Seed",
        })),
      });
      dbItems = await prisma.galleryItem.findMany({
        orderBy: { createdAt: "desc" },
      });
    } catch (e) {
      console.error("Failed to seed default gallery items:", e);
    }
  }

  const mappedItems = dbItems.map((item: any) => ({
    id: item.id,
    type: item.type as "image" | "video",
    src: item.src,
    thumbnailSrc: item.thumbnailSrc || undefined,
    alt: item.alt,
    caption: item.caption,
    category: item.category as string,
  }));

  return (
    <main className="bg-page-bg min-h-screen">
      {isAdmin && (
        <div className="bg-primary/10 border-b border-primary/20 py-3 text-center text-sm">
          <Container className="flex items-center justify-between">
            <span className="font-medium text-primary-dark font-sans">
              You are logged in as an Administrator.
            </span>
            <a
              href="/admin/pages/gallery"
              className="px-4 py-1.5 bg-primary-dark hover:bg-primary-dark/90 text-white rounded-lg font-semibold transition-all text-xs font-sans"
            >
              Edit Page Content
            </a>
          </Container>
        </div>
      )}
      <div className="pt-12 pb-24">
        <Container>
          {/* Breadcrumbs */}
          <Breadcrumb
            className="mb-8"
            items={[
              { label: "Home", href: "/" },
              { label: "Gallery", href: "/gallery" },
            ]}
          />

          {/* Section Heading */}
          <SectionHeading
            align="center"
            subtitle="Our Moments"
            title={<>Media <span className="text-primary-dark">Gallery</span></>}
            className="mb-12"
          />

          {/* Interactive Gallery Component */}
          <GalleryView initialItems={mappedItems} />
        </Container>
      </div>
    </main>
  );
}
