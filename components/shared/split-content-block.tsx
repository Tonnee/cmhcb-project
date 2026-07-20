import * as React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export interface SplitBlockCta {
  label: string;
  href: string;
}

export interface SplitBlockContent {
  heading: string;
  items: string[];
  cta: SplitBlockCta;
  image: { src: string; alt: string };
}

interface SplitContentBlockProps {
  content: SplitBlockContent;
  reverse?: boolean;
}

export function SplitContentBlock({
  content,
  reverse = false,
}: SplitContentBlockProps): React.JSX.Element {
  const { heading, items, cta, image } = content;

  return (
    <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center py-6">
      <div className={`flex flex-col ${reverse ? "lg:order-2" : ""}`}>
        {/* Title */}
        <h2 className="font-marcellus text-3xl md:text-4xl text-dark mb-8 tracking-wide leading-snug">
          {heading}
        </h2>

        {/* Minimalist List */}
        <ul className="space-y-4 mb-8">
          {items.map((item) => (
            <li key={item} className="flex items-start gap-4">
              <span
                className="w-1.5 h-1.5 rounded-full shrink-0 bg-accent mt-2.5"
                aria-hidden="true"
              />
              <span className="font-sans font-normal text-base md:text-lg leading-relaxed text-light-ash/90">
                {item}
              </span>
            </li>
          ))}
        </ul>

        {/* Action Button */}
        <Button href={cta.href} variant="primary-dark" className="self-start mt-2">
          {cta.label}
        </Button>
      </div>

      {/* Premium Minimalist Image Frame */}
      <div
        className={`relative hidden lg:block h-125 ${reverse ? "lg:order-1" : ""}`}
      >
        <div className="relative w-full h-full rounded-4xl overflow-hidden bg-muted">
          <Image
            src={image.src}
            alt={image.alt}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 568px"
          />
        </div>
      </div>
    </div>
  );
}
