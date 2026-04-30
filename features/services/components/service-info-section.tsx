import * as React from "react";
import { Container } from "@/components/layout/container";
import { SplitContentBlock } from "@/components/shared/split-content-block";
import { SERVICE_INFO_BLOCKS } from "@/features/services/data/service-info-blocks";

export function ServiceInfoSection(): React.JSX.Element {
  return (
    <section className="py-16 md:py-24">
      <Container className="flex flex-col gap-16 md:gap-24">
        {SERVICE_INFO_BLOCKS.map((block, i) => (
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
