import * as React from "react";
import { Button } from "@/components/ui/button";

export function ScheduleAppointment(): React.JSX.Element {
  return (
    <section className="bg-accent py-24">
      <div className="container">
        <div className="flex flex-col items-center gap-12">
          {/* Heading */}
          <h2 className="font-marcellus text-4xl md:text-5xl leading-tight text-center text-white">
            Take The Next Step - Schedule Your{" "}
            <span className="text-dark">Appointment</span>
          </h2>

          {/* Subtitle */}
            <p className="font-sans text-lg leading-relaxed text-center text-white max-w-3xl mx-auto">
              Your path to healing, growth, and inner peace starts with a single step. Whether you are navigating life&apos;s transitions, seeking emotional support, or striving for balance, our compassionate professionals are here to walk with you in a safe, supportive space.
            </p>

          {/* CTA Button */}
          <Button href="/appointment" variant="white">
            Book an Appointment
          </Button>
        </div>
      </div>
    </section>
  );
}
