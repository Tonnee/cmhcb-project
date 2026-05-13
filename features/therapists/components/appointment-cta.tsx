import * as React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export function AppointmentCta(): React.JSX.Element {
  return (
    <section className="relative w-full py-28 md:py-36 overflow-hidden flex items-center">
      {/* Background image */}
      <Image
        src="/pages-hero-background/1.png"
        alt="Make an appointment background"
        fill
        sizes="100vw"
        className="object-cover object-center"
      />

      {/* Dark overlay */}
      <div
        className="absolute inset-0"
        style={{ backgroundColor: "rgba(1, 30, 0, 0.73)" }}
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-10 w-full flex flex-col items-center justify-center px-6 text-center">
        <h2 className="font-marcellus text-4xl md:text-5xl leading-tight text-white max-w-3xl mb-6">
          Take The Next Step - Schedule Your <span className="text-white">Appointment</span>
        </h2>
        
        <p className="font-sans text-base leading-normal text-white max-w-2xl mb-10">
          We&apos;re here to support you, let&apos;s work together to create a path toward healing, growth, and balance.
        </p>

        <Button href="/book" variant="white">
          Book an Appointment
        </Button>
      </div>
    </section>
  );
}
