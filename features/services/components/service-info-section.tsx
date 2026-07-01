import * as React from "react";
import { Container } from "@/components/layout/container";
import { SplitContentBlock } from "@/components/shared/split-content-block";
import { SERVICE_INFO_BLOCKS } from "@/features/services/data/service-info-blocks";

interface ServiceInfoSectionProps {
  infoBlocks?: {
    id: string;
    heading: string;
    items: string; // JSON string of string[]
    ctaLabel: string;
    ctaHref: string;
    image: string;
    imageAlt: string;
    order: number;
  }[];
}

export function ServiceInfoSection({ infoBlocks }: ServiceInfoSectionProps): React.JSX.Element {
  // Map database blocks to SplitBlockContent format if provided, otherwise use static default blocks
  const blocks = infoBlocks && infoBlocks.length > 0 
    ? infoBlocks.map(b => {
        let itemsArray: string[] = [];
        try {
          itemsArray = JSON.parse(b.items);
        } catch {
          itemsArray = [];
        }
        return {
          heading: b.heading,
          items: itemsArray,
          cta: { label: b.ctaLabel, href: b.ctaHref },
          image: { src: b.image, alt: b.imageAlt },
        };
      })
    : SERVICE_INFO_BLOCKS;

  return (
    <section className="py-16 md:py-24">
      <Container className="flex flex-col gap-16 md:gap-24">
        {blocks.map((block, i) => (
          <SplitContentBlock
            key={block.heading}
            content={block}
            reverse={i % 2 !== 0}
          />
        ))}
      </Container>
    </section>
  );
}
