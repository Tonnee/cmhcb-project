import * as React from "react";
import Image from "next/image";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";

export default function Guide(): React.JSX.Element {
  return (
    <section className="bg-white py-16 lg:py-24">
      <Container>
        <div className="flex flex-col lg:flex-row items-center gap-y-12 gap-x-5">
          {/* Left: Image */}
          <div className="flex-shrink-0 w-full lg:w-[470px]">
            <div className="relative rounded-[24px] overflow-hidden aspect-[4/5] lg:h-[572px] lg:w-[470px] shadow-sm">
              <Image
                src="/compassionate-mental-health-professional.png"
                alt="Woman at desk supporting mental well-being"
                fill
                sizes="(max-width: 1024px) 100vw, 470px"
                className="object-cover"
              />
            </div>
          </div>

          {/* Right: Content */}
          <div className="flex flex-col flex-1">
            <h2 className="font-marcellus text-4xl md:text-5xl leading-tight text-dark">
              Guiding You Toward <br className="hidden lg:block" />
              Mental Well-Being
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
              href="/contact"
            >
              Book Appointment
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
