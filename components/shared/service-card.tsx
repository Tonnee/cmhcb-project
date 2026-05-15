import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { type ServiceItem } from "@/features/services/data/services";
import { RightArrowIcon } from "@/components/ui/icons";

export function ServiceCard({ item }: { item: ServiceItem }): React.JSX.Element {
  const iconBgClass = item.iconVariant === "primary" ? "bg-primary" : "bg-accent";

  return (
    <div className="rounded-[16px] bg-white border border-muted/50 flex flex-col items-center pb-6 transition-all hover:border-accent hover:shadow-md">
      {/* Image Block */}
      <div className="relative w-full px-5 pt-5 shrink-0">
        <div className="relative h-[220px] w-full rounded-[10px] overflow-hidden bg-gray-100">
          <Image
            src={item.image}
            alt={item.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
          />
        </div>

        {/* Floating Icon */}
        <div
          className={`absolute left-1/2 -translate-x-1/2 -bottom-[42px] w-[85px] h-[85px] rounded-full flex items-center justify-center border-4 border-white shadow-sm z-10 ${iconBgClass}`}
        >
          <div className="relative w-[44px] h-[44px]">
            <Image
              src={item.icon}
              alt=""
              fill
              sizes="44px"
              className="object-contain"
            />
          </div>
        </div>
      </div>

      {/* Content Block */}
      <div className="flex flex-col items-center text-center px-5 pt-[56px] flex-1 w-full">
        <h3 className="font-marcellus text-xl text-dark mb-2.5">
          <Link href={`/services/${item.slug}`} className="transition-colors hover:text-accent">
            {item.title}
          </Link>
        </h3>
        <p className="font-sans text-sm text-light-ash max-w-[332px] mb-[18px] leading-relaxed">
          {item.shortDescription}
        </p>

        <div className="mt-auto">
          <Link
            href={`/services/${item.slug}`}
            className="group inline-flex items-center gap-0 font-marcellus text-sm text-primary-dark transition-colors hover:text-dark-green hover:underline"
          >
            Learn More
            <span className="transition-transform group-hover:translate-x-1">
              <RightArrowIcon className="inline-block ml-1" width="12" height="12" />
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
