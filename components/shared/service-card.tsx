import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { type ServiceItem } from "@/features/services/data/services";
import { RightArrowIcon } from "@/components/ui/icons";

interface ServiceCardProps {
  item: ServiceItem;
  className?: string;
}

export function ServiceCard({ item, className = "" }: ServiceCardProps): React.JSX.Element {
  return (
    <Link 
      href={`/services/${item.slug}`}
      className={`group flex flex-col bg-white rounded-3xl overflow-hidden border border-gray-100 transition-all hover:shadow-md ${className}`}
    >
      {/* Image Block */}
      <div className="relative w-full h-[240px] overflow-hidden shrink-0 bg-gray-100">
        <Image
          src={item.image}
          alt={item.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* Content Block */}
      <div className="p-6 flex flex-col flex-1">
        <h3 className="font-marcellus text-xl text-dark mb-3 leading-snug transition-colors group-hover:text-primary">
          {item.title}
        </h3>
        <p className="font-sans text-sm text-light-ash leading-relaxed mb-6 flex-1 line-clamp-3">
          {item.shortDescription}
        </p>

        <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-4">
          <span className="font-sans text-xs text-light-ash font-medium">
            {item.duration} • {item.fees}
          </span>
          <span className="font-sans font-semibold text-primary text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
            Learn More
            <RightArrowIcon width="12" height="12" />
          </span>
        </div>
      </div>
    </Link>
  );
}
