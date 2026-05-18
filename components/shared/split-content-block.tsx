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
    <div className="grid lg:grid-cols-2 gap-6 items-center">
      <div className={`flex flex-col ${reverse ? "lg:order-2" : ""}`}>
        <h2 className="font-marcellus text-4xl text-dark mb-10">{heading}</h2>

        <ul className="space-y-5 mb-10">
          {items.map((item) => (
            <li key={item} className="flex items-center gap-6">
              <span
                className="w-3 h-3 rounded-full shrink-0 bg-light-ash/80"
                aria-hidden="true"
              />
              <span className="font-sans font-normal text-xl leading-8 text-black">
                {item}
              </span>
            </li>
          ))}
        </ul>

        <Button href={cta.href} variant="primary-dark" className="self-start">
          {cta.label}
        </Button>
      </div>

      <div
        className={`relative hidden lg:block h-[575px] ${reverse ? "lg:order-1" : ""}`}
      >
        <div className="relative w-full h-full rounded-3xl overflow-hidden">
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
