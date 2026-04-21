import * as React from "react";
import Image from "next/image";
import { Container } from "@/components/layout/container";

export function Hero(): React.JSX.Element {
  return (
    <section className="bg-white py-12">
      <Container>
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-12">
          {/* Left Column - Text Content */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            <p className="font-sans text-sm text-light-ash/80 mb-6">
              Center for Mental Health and Care, Bangladesh
            </p>
            <h1 className="font-marcellus text-4xl lg:text-hero-heading leading-tight mb-8">
              <span className="text-dark">Empowering Your</span>
              <br />
              <span className="text-accent">Mind</span>
              <span className="text-dark">, Transforming Your</span>
              <br />
              <span className="text-primary">Life</span>
            </h1>
          </div>

          {/* Right Column - Main Image with Overlay */}
          <div className="lg:col-span-6 relative rounded-3xl overflow-hidden h-hero-image">
            <Image
              src="/hero-image/psychotherapy-counseling-session.png"
              alt="Woman receiving professional psychotherapy counseling in a clinical setting"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority
            />
            <div className="absolute bottom-0 left-0 w-full bg-dark-green-overlay p-8">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-marcellus text-xl text-accent">
                  Find Your Therapist
                </h3>
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </div>
              <p className="font-sans text-sm text-white/75">
                Connect with the right help, right when you need it.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Section - Three Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-5 gap-y-6">
          {/* Left Card - Group Therapy Image */}
          <div className="relative rounded-3xl overflow-hidden h-60">
            <Image
              src="/hero-image/group-therapy-support-circle.png"
              alt="Group therapy support circle with participants seated together"
              fill
              className="object-cover"
            />
          </div>

          {/* Center Card - WHO Quote */}
          <div className="bg-dark-green rounded-3xl p-8 flex flex-col justify-center">
            <p className="font-sans text-xl text-white leading-8 mb-4">
              1 in 4 people will be affected by a mental or neurological
              disorder at some point in their lives.
            </p>
            <p className="font-sans italic text-sm text-white/75">
              – World Health Organization (WHO)
            </p>
          </div>

          {/* Right Card - Family Therapy Image */}
          <div className="relative rounded-3xl overflow-hidden h-60">
            <Image
              src="/hero-image/family-therapy-psychologist-office.png"
              alt="Family attending a therapy session in a psychologist office"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
