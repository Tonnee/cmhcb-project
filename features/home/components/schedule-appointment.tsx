import * as React from "react";
import { Button } from "@/components/ui/button";

export function ScheduleAppointment(): React.JSX.Element {
  return (
    <section className="bg-accent py-20">
      <div className="container">
        <div className="flex flex-col items-center gap-12">
          {/* Heading */}
          <h2 className="font-marcellus text-4xl md:text-5xl leading-tight text-center text-white max-w-3xl">
            Take The Next Step - Schedule Your{" "}
            <span className="text-dark">Appointment</span>
          </h2>

          {/* Subtitle */}
          <div className="max-w-3xl">
            <p className="font-sans text-base leading-normal text-center text-white">
              We&apos;re here to support you, let&apos;s work together to create a path toward healing, growth, and balance
            </p>
          </div>

          {/* CTA Button */}
          <Button href="/contact" variant="white">
            Explore More
          </Button>
        </div>
      </div>
    </section>
  );
}
