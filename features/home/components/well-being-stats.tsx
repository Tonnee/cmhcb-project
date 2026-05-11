"use client";

import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { AnimatedCounter } from "@/components/ui/animated-counter";

interface StatItem {
  id: string;
  value: number;
  suffix: string;
  title: string;
  description: string;
}

interface WellBeingStatsProps {
  stats: StatItem[];
}

export function WellBeingStats({ stats }: WellBeingStatsProps): React.JSX.Element {
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2, rootMargin: "0px 0px -100px 0px" }
    );

    const timeoutId = setTimeout(() => {
      observer.observe(element);
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={ref} className="grid grid-cols-2 gap-x-5 gap-y-16">
      {stats.map((stat) => (
        <div key={stat.id} className="flex flex-col">
          <div className="font-sans font-medium text-4xl md:text-5xl lg:text-[56px] text-white mb-5 tracking-tight flex items-baseline">
            <AnimatedCounter end={stat.value} suffix={stat.suffix} start={inView} />
          </div>
          <h3 className="font-sans text-base md:text-lg text-white/90 mb-1 leading-snug">
            {stat.title}
          </h3>
          <p className="font-sans text-sm text-white/60 leading-relaxed">
            {stat.description}
          </p>
        </div>
      ))}
    </div>
  );
}
