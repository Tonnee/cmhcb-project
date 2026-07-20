import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Event } from "@/features/events/data/events";
import { HiCalendarDays, HiClock } from "react-icons/hi2";
import { Tag } from "@/components/ui/tag";
import { LinkButton } from "@/components/ui/link-button";

interface WorkshopCardProps {
  workshop: Event;
  className?: string;
}

export default function WorkshopCard({ workshop, className = "" }: WorkshopCardProps): React.JSX.Element {
  const isUpcoming = new Date(workshop.date).getTime() >= new Date().getTime();

  return (
    <Link
      href={`/workshops/${workshop.slug}`}
      className={`group flex flex-col bg-white rounded-3xl overflow-hidden border border-gray-100 ${className}`}
    >
      <div className="relative w-full h-60 overflow-hidden shrink-0">
        <Image
          src={workshop.image}
          alt={workshop.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="p-6 flex flex-col flex-1">
        <div className="flex flex-wrap gap-2 mb-4">
          {workshop.tags.map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </div>
        <h3 className="font-marcellus text-xl text-dark mb-3 leading-snug group-hover:text-primary transition-colors">
          {workshop.title}
        </h3>
        <p className="font-sans text-sm text-light-ash leading-relaxed mb-6 flex-1 line-clamp-3">
          {workshop.description}
        </p>
        <div className="mt-auto flex flex-col gap-2 border-t border-gray-100 pt-4">
          <div className="flex items-center gap-2 text-xs text-light-ash">
            <HiCalendarDays className="w-4 h-4 text-accent" />
            <span>
              {new Date(workshop.date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-light-ash">
              <HiClock className="w-4 h-4 text-accent" />
              <span>{workshop.time}</span>
            </div>
            <LinkButton variant="accent">
              {isUpcoming ? "Register" : "Read More"}
            </LinkButton>
          </div>
        </div>
      </div>
    </Link>
  );
}
