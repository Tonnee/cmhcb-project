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
    feesOnsite?: string | null;
    feesOnline?: string | null;
  };
  className?: string;
}

export const SERVICE_IMAGES: Record<string, string> = {
  "psychometric-assessment": "/home-service-images/psychometric-assessment.png",
  "individual-therapy": "https://qeaszomzltstfhikrais.supabase.co/storage/v1/object/public/cmhcb-media/uploads/zpa2q9bjcks_1790657645690.jpg",
  "child-therapy": "https://qeaszomzltstfhikrais.supabase.co/storage/v1/object/public/cmhcb-media/uploads/wd7q47htmb_1790657708789.jpg",
  "family-therapy": "https://qeaszomzltstfhikrais.supabase.co/storage/v1/object/public/cmhcb-media/uploads/0zlr0jtxsmd_1790659802322.jpg",
  "couple-therapy": "https://qeaszomzltstfhikrais.supabase.co/storage/v1/object/public/cmhcb-media/uploads/pysalgupdp_1790658854751.jpg",
  "iq-test": "/home-service-images/iq-test.png",
};

const LEGACY_DEFAULT_IMAGES = [
  "/home-service-images/individual-therapy.png",
  "/home-service-images/child-therapy.png",
  "/home-service-images/family-therapy.png",
  "/home-service-images/couple-therapy.png",
];

export function ServiceCard({ item, className = "" }: ServiceCardProps): React.JSX.Element {
  const isLegacy = item.image && LEGACY_DEFAULT_IMAGES.includes(item.image);
  const imageSrc =
    (!isLegacy && item.image) ||
    SERVICE_IMAGES[item.slug] ||
    item.image ||
    "/home-service-images/individual-therapy.png";
  const linkHref = `/services/${item.slug}`;
  const onSiteFee = item.feesOnsite || item.fees;
  const onlineFee = item.feesOnline || item.fees;

  return (
    <div
      className={`group flex flex-col bg-white rounded-3xl overflow-hidden border border-gray-100 transition-all hover:shadow-md ${className}`}
    >
      {/* Image Block */}
      <Link
        href={linkHref}
        className="relative w-full h-[240px] overflow-hidden shrink-0 bg-gray-100 block"
      >
        <Image
          src={imageSrc}
          alt={item.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </Link>

      {/* Content Block */}
      <div className="p-6 flex flex-col flex-1">
        <Link href={linkHref} className="block mb-2">
          <h3 className="font-marcellus text-xl text-primary-dark leading-snug transition-colors group-hover:text-accent">
            {item.title}
          </h3>
        </Link>
        <p className="font-sans text-sm text-light-ash leading-relaxed mb-4 flex-1 line-clamp-2">
          {item.shortDescription}
        </p>

        {/* Fees Block (Online & In Person pricing) */}
        <div className="mt-auto pt-4 border-t border-gray-100 flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-2 text-xs font-sans">
            <div className="bg-[#f0f7ef] border border-primary/20 rounded-xl p-2.5 flex flex-col justify-between">
              <span className="text-[10px] font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                In Person
              </span>
              <span className="font-semibold text-dark-green text-xs mt-1 leading-snug">
                {onSiteFee || "Available"}
              </span>
            </div>
            <div className="bg-[#f2f8fc] border border-sky-600/20 rounded-xl p-2.5 flex flex-col justify-between">
              <span className="text-[10px] font-bold text-sky-700 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-600 shrink-0" />
                Online
              </span>
              <span className="font-semibold text-dark text-xs mt-1 leading-snug">
                {onlineFee || "Available"}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="font-sans text-xs text-light-ash font-medium">
              {item.duration ? `Duration: ${item.duration}` : "Online & In Person"}
            </span>
            <LinkButton href={linkHref} variant="accent">
              Learn More
            </LinkButton>
          </div>
        </div>
      </div>
    </div>
  );
}
