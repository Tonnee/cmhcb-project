import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Event } from "@/features/events/data/events";

interface EventCardProps {
  event: Event;
  className?: string;
}

export function EventCard({ event, className = "" }: EventCardProps): React.JSX.Element {
  return (
    <Link 
      href={`/events/${event.slug}`} 
      className={`group flex flex-col bg-white rounded-3xl overflow-hidden border border-gray-100 ${className}`}
    >
      <div className="relative w-full h-[240px] overflow-hidden shrink-0">
        <Image
          src={event.image}
          alt={event.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="p-6 flex flex-col flex-1">
        <div className="flex flex-wrap gap-2 mb-4">
          {event.tags.map(tag => (
            <span key={tag} className="px-3 py-1 bg-primary/10 text-primary rounded-full font-sans text-xs font-medium">
              {tag}
            </span>
          ))}
        </div>
        <h3 className="font-marcellus text-xl text-dark mb-3 leading-snug group-hover:text-primary transition-colors">
          {event.title}
        </h3>
        <p className="font-sans text-sm text-light-ash leading-relaxed mb-6 flex-1 line-clamp-3">
          {event.description}
        </p>
        <div className="mt-auto flex flex-col gap-2 border-t border-gray-100 pt-4">
          <div className="flex items-center gap-2 text-xs text-light-ash">
            <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-light-ash">
              <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{event.time}</span>
            </div>
            <span className="font-sans font-semibold text-primary text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
              {new Date(event.date).getTime() >= new Date().getTime() ? "Register" : "Read More"} <span aria-hidden="true">&rarr;</span>
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
