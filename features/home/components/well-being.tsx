import * as React from "react";
import Image from "next/image";
import { Container } from "@/components/layout/container";
import { WellBeingStats } from "./well-being-stats";

interface StatItem {
  id: string;
  value: number;
  suffix: string;
  title: string;
  description: string;
}

interface WellBeingProps {
  headline: string;
  subtitle: string;
  stats: StatItem[];
  image?: string | null;
}

export default function WellBeing({ headline, subtitle, stats, image }: WellBeingProps): React.JSX.Element {
  return (
    <section className="bg-dark-green py-20 lg:py-28 relative overflow-hidden">
      {/* Background Image Layer if configured */}
      {image && (
        <div className="absolute inset-0 pointer-events-none">
          <Image
            src={image}
            alt="Well-Being section background"
            fill
            className="object-cover opacity-20 mix-blend-overlay"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-dark-green/95 via-dark-green/85 to-dark-green/90" />
        </div>
      )}

      {/* Abstract Node Network Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <pattern id="network-pattern" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
            <circle cx="30" cy="30" r="4" fill="currentColor" />
            <circle cx="90" cy="90" r="4" fill="currentColor" />
            <circle cx="30" cy="90" r="2" fill="currentColor" />
            <circle cx="90" cy="30" r="2" fill="currentColor" />
            <path d="M30,30 L90,90 M30,90 L90,30 L30,30" stroke="currentColor" strokeWidth="1" />
          </pattern>
          <rect x="0" y="0" width="100%" height="100%" fill="url(#network-pattern)" className="text-white" />
        </svg>
      </div>

      <Container className="relative z-10">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-center">
          {/* Left Text Block */}
          <div className="xl:col-span-5 flex flex-col gap-6 pr-0 xl:pr-8">
            <h2
              className="font-marcellus text-4xl lg:text-5xl text-white leading-tight"
              dangerouslySetInnerHTML={{ __html: headline }}
            />
            <p className="font-sans text-base lg:text-lg text-white/80 leading-relaxed max-w-lg mt-2">
              {subtitle}
            </p>
          </div>

          {/* Right Stats Grid */}
          <div className="xl:col-span-6 xl:col-start-7">
            <WellBeingStats stats={stats} />
          </div>
        </div>
      </Container>
    </section>
  );
}
