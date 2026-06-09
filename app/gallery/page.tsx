import * as React from "react";
import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import GalleryView from "@/features/gallery/components/gallery-view";

export const metadata: Metadata = {
  title: "Media Gallery | CMHCB",
  description: "Browse our images and video highlights of events, workshops, occasions, and activities at the Center for Mental Health and Care Bangladesh.",
};

export default function GalleryPage(): React.JSX.Element {
  return (
    <main className="pt-12 pb-24 bg-page-bg min-h-screen">
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
        <GalleryView />
      </Container>
    </main>
  );
}

