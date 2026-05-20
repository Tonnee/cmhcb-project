import * as React from "react";
import Image from "next/image";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";

export default function Guide(): React.JSX.Element {
  return (
    <section className="py-16 lg:py-24">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-6">
          {/* Left: Image */}
          <div className="lg:col-span-5">
            <div className="relative rounded-[24px] overflow-hidden aspect-4/5 lg:h-[572px]">
              <Image
                src="/compassionate-mental-health-professional.png"
                alt="Woman at desk supporting mental well-being"
                fill
                sizes="(max-width: 1024px) 100vw, (max-width: 1280px) 40vw, 470px"
                className="object-cover"
              />
            </div>
          </div>

          {/* Right: Content */}
          <div className="flex flex-col lg:col-span-6 lg:col-start-7">
            <h2 className="font-marcellus text-3xl md:text-5xl leading-tight text-dark">
              Guiding You Toward
              <span className="block">
                <span className="text-accent mr-2">Mental</span>
                <span className="text-primary-dark">Well-Being</span>
              </span>
            </h2>

            <p className="font-sans text-lg md:text-xl leading-relaxed text-dark mt-8 max-w-xl">
              At CMHC,B, we believe every individual deserves a supportive space
              to heal, grow, and thrive. Our dedicated team of licensed mental
              health professionals provides compassionate, evidence-based care
              tailored to your unique journey.
            </p>

            <Button
              variant="primary"
              className="mt-10 self-start"
              href="/appointment"
            >
              Book Appointment
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
