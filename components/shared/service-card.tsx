import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { LinkButton } from "@/components/ui/link-button";

interface ServiceCardProps {
  item: {
    title: string;
    slug: string;
    shortDescription: string;
    image?: string | null;
    duration?: string | null;
    fees?: string | null;
  };
  className?: string;
}

export const SERVICE_IMAGES: Record<string, string> = {
  "psychometric-assessment": "/home-service-images/psychometric-assessment.png",
  "individual-therapy": "/home-service-images/individual-therapy.png",
  "child-therapy": "/home-service-images/child-therapy.png",
  "family-therapy": "/home-service-images/family-therapy.png",
  "couple-therapy": "/home-service-images/couple-therapy.png",
  "iq-test": "/home-service-images/iq-test.png",
};

export function ServiceCard({ item, className = "" }: ServiceCardProps): React.JSX.Element {
  const imageSrc = item.image || SERVICE_IMAGES[item.slug] || "/home-service-images/individual-therapy.png";

  return (
    <Link
      href={`/services/${item.slug}`}
      className={`group flex flex-col bg-white rounded-3xl overflow-hidden border border-gray-100 transition-all hover:shadow-md ${className}`}
    >
      {/* Image Block */}
      <div className="relative w-full h-[240px] overflow-hidden shrink-0 bg-gray-100">
        <Image
          src={imageSrc}
          alt={item.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* Content Block */}
      <div className="p-6 flex flex-col flex-1">
        <h3 className="font-marcellus text-xl text-primary-dark mb-3 leading-snug transition-colors group-hover:text-accent">
          {item.title}
        </h3>
        <p className="font-sans text-sm text-light-ash leading-relaxed mb-6 flex-1 line-clamp-3">
          {item.shortDescription}
        </p>

        <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-4">
          <span className="font-sans text-xs text-light-ash font-medium">
            {item.duration && item.fees
              ? `${item.duration} / ${item.fees}`
              : item.duration || item.fees || "Evidence-Based Support"}
          </span>
          <LinkButton variant="accent">Learn More</LinkButton>
        </div>
      </div>
    </Link>
  );
}
