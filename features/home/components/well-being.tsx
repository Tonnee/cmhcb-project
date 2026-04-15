import * as React from "react";
import { Container } from "@/components/layout/container";
import { AnimatedCounter } from "@/components/ui/animated-counter";

interface StatItem {
  id: string;
  value: number;
  suffix: string;
  title: string;
  description: string;
}

const STATS_DATA: StatItem[] = [
  {
    id: "experience",
    value: 20,
    suffix: "+",
    title: "Years of Experience",
    description: "Helping individuals navigate life's",
  },
  {
    id: "clients",
    value: 1500,
    suffix: "+",
    title: "Happy Clients",
    description: "Empowered through counseling and therapy",
  },
  {
    id: "sessions",
    value: 2800,
    suffix: "+",
    title: "Sessions Conducted",
    description: "Providing guidance and support every day",
  },
  {
    id: "satisfaction",
    value: 94,
    suffix: "%",
    title: "Satisfaction Positive",
    description: "outcomes and improved well-being",
  },
];

export default function WellBeing(): React.JSX.Element {
  return (
    <section className="bg-dark-green py-20 lg:py-28 relative overflow-hidden">
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
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-center">
          {/* Left Text Block */}
          <div className="xl:col-span-5 flex flex-col gap-5 pr-0 xl:pr-8">
            <h2 className="font-marcellus text-4xl lg:text-5xl text-white leading-tight">
              Our Commitment to <br className="hidden md:block" />
              Your <span className="text-accent">Well-Being</span>
            </h2>
            <p className="font-sans text-base lg:text-lg text-white/80 leading-relaxed max-w-lg mt-2">
              At CMHC,B, we are committed to delivering compassionate and
              effective mental health care. Explore how we've supported
              individuals on their path to emotional well-being and resilience.
            </p>
          </div>

          {/* Right Stats Grid */}
          <div className="xl:col-span-6 xl:col-start-7">
            <div className="grid grid-cols-2 gap-x-5 gap-y-16">
              {STATS_DATA.map((stat) => (
                <div key={stat.id} className="flex flex-col">
                  <div className="font-sans font-medium text-4xl md:text-5xl lg:text-[56px] text-white mb-5 tracking-tight flex items-baseline">
                    <AnimatedCounter end={stat.value} suffix={stat.suffix} />
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
          </div>
        </div>
      </Container>
    </section>
  );
}
