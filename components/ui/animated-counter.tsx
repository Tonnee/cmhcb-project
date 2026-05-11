"use client";

import * as React from "react";
import { useEffect, useState, useRef } from "react";

interface AnimatedCounterProps {
  end: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  start?: boolean;
}

export function AnimatedCounter({
  end,
  duration = 2500,
  suffix = "",
  prefix = "",
  start,
}: AnimatedCounterProps): React.JSX.Element {
  const [count, setCount] = useState(0);
  const hasAnimated = useRef(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    // If a start trigger is explicitly provided, we use parent control
    if (start !== undefined) {
      if (start && !hasAnimated.current) {
        hasAnimated.current = true;
        let startTimestamp: number | null = null;
        
        const step = (timestamp: number) => {
          if (!startTimestamp) startTimestamp = timestamp;
          const progress = Math.min((timestamp - startTimestamp) / duration, 1);
          
          const easeProgress = 1 - Math.pow(1 - progress, 4);
          setCount(Math.floor(easeProgress * end));
          
          if (progress < 1) {
            window.requestAnimationFrame(step);
          } else {
            setCount(end);
          }
        };
        
        window.requestAnimationFrame(step);
      }
      return;
    }

    // Default: Internal IntersectionObserver
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          observer.disconnect();
          
          let startTimestamp: number | null = null;
          
          const step = (timestamp: number) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            
            const easeProgress = 1 - Math.pow(1 - progress, 4);
            setCount(Math.floor(easeProgress * end));
            
            if (progress < 1) {
              window.requestAnimationFrame(step);
            } else {
              setCount(end);
            }
          };
          
          window.requestAnimationFrame(step);
        }
      },
      { threshold: 0.5, rootMargin: "0px 0px -100px 0px" } // Prevent triggering from layout shifts
    );

    // Small delay to allow Next.js hydration layout to settle
    const timeoutId = setTimeout(() => {
      observer.observe(element);
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, [end, duration, start]);

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}{count}
      {suffix && <span className="text-secondary ml-2">{suffix}</span>}
    </span>
  );
}
