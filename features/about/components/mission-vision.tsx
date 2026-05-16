import * as React from "react";
import { HiShieldCheck, HiGlobeAlt } from "react-icons/hi2";
import Image from "next/image";
import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/shared/section-heading";

export function MissionVision(): React.JSX.Element {
  return (
    <section className="py-16 md:py-24 bg-white">
      <Container>
        <SectionHeading
          title="Our Mission & Vision"
          subtitle="Purpose Driven Care"
          align="center"
          className="mb-16"
        />

        {/* Mission - Image Left, Content Right */}
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20 mb-20 md:mb-24">
          <div className="w-full lg:w-1/2">
            <div className="relative w-full h-[350px] lg:h-[450px] rounded-3xl overflow-hidden bg-gray-100 shadow-sm group">
              <Image
                src="/hero-image/group-therapy-support-circle.png"
                alt="Therapists engaged in a group therapy session"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
          </div>
          <div className="w-full lg:w-1/2 flex flex-col items-start text-left">
            <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
              <HiShieldCheck className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-marcellus text-3xl md:text-4xl text-dark mb-6">Our Mission</h3>
            <p className="font-sans text-light-ash text-lg leading-relaxed">
              To empower individuals to overcome mental health challenges through compassionate, evidence-based therapy. We strive to create a safe, inclusive environment where healing begins, resilience is built, and lasting emotional well-being is achieved.
            </p>
          </div>
        </div>

        {/* Vision - Image Right, Content Left */}
        <div className="flex flex-col lg:flex-row-reverse items-center gap-12 lg:gap-20">
          <div className="w-full lg:w-1/2">
            <div className="relative w-full h-[350px] lg:h-[450px] rounded-3xl overflow-hidden bg-gray-100 shadow-sm group">
              <Image
                src="/home-about-image/mental-health-therapy-client.png"
                alt="Client in a mental health therapy session"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
          </div>
          <div className="w-full lg:w-1/2 flex flex-col items-start text-left">
            <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
              <HiGlobeAlt className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-marcellus text-3xl md:text-4xl text-dark mb-6">Our Vision</h3>
            <p className="font-sans text-light-ash text-lg leading-relaxed">
              To be the leading center for psychological care and advocacy in Bangladesh, fostering a society where mental health is prioritized, stigma is eradicated, and everyone has access to the support they need to thrive.
            </p>
          </div>
        </div>

      </Container>
    </section>
  );
}
