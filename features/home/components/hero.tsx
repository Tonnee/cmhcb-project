import * as React from "react";
import Image from "next/image";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";

export function Hero(): React.JSX.Element {
  return (
    <div className="flex flex-col">
      {/* Hero Banner Section */}
      <section className="relative overflow-hidden min-h-[600px] lg:min-h-[680px] flex items-center py-16 lg:py-24">
        {/* Background Image */}
        <div className="absolute inset-0 -z-10">
          <Image
            src="/hero-image/hero-main.png"
            alt="Empowering Your Mind, Transforming Your Life background"
            fill
            priority
            className="object-cover object-right"
          />
        </div>
        <Container className="relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column - Text Content */}
            <div className="lg:col-span-7 xl:col-span-6 flex flex-col justify-center bg-page-bg/85 backdrop-blur-md p-6 sm:p-8 rounded-3xl shadow-lg border border-primary/10 lg:bg-transparent lg:backdrop-blur-none lg:p-0 lg:shadow-none lg:border-none">
              <p className="font-sans text-sm font-semibold tracking-wider text-light-ash/80 mb-4 uppercase">
                Center for Mental Health and Care, Bangladesh
              </p>
              <h1 className="font-marcellus font-bold text-4xl lg:text-hero-heading leading-tight mb-6">
                <span className="text-dark">Empowering Your</span>
                <br />
                <span className="text-accent">Mind</span>
                <span className="text-dark">, Transforming <br /> Your</span>
                <span className="text-primary"> Life</span>
              </h1>
              <p className="font-sans text-base lg:text-lg text-light-ash mb-8 leading-relaxed max-w-xl">
                At CMHC,B, we believe every individual deserves a supportive
                space to heal, grow, and thrive. Connect with the right
                therapist, right when you need it.
              </p>
              <div>
                <Button 
                  href="/appointment" 
                  variant="dark-green" 
                  className="rounded-full px-8 py-3 h-12 font-sans font-medium text-base transition-transform duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-md shadow-dark-green/10 hover:shadow-lg hover:shadow-dark-green/20"
                >
                  Find Your Therapist
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Bottom Cards Section */}
      <section className="py-16 bg-page-bg">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left Card - Group Therapy Image */}
            <div className="relative rounded-3xl overflow-hidden h-60 md:h-full group min-h-[240px]">
              <Image
                src="/hero-image/group-therapy-support-circle.png"
                alt="Group therapy support circle with participants seated together"
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, 33vw"
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
            <div className="relative rounded-3xl overflow-hidden h-60 md:h-full group min-h-[240px]">
              <Image
                src="/hero-image/family-therapy-psychologist-office.png"
                alt="Family attending a therapy session in a psychologist office"
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
