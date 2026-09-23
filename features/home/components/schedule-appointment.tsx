import * as React from "react";
import { Button } from "@/components/ui/button";

interface ScheduleAppointmentProps {
  headline?: string | null;
  subtitle?: string | null;
  buttonText?: string | null;
  buttonLink?: string | null;
}

const DEFAULT_HEADLINE = "Take The Next Step - Schedule Your <span class=\"text-white\">Appointment</span>";
const DEFAULT_SUBTITLE = "Your path to healing, growth, and inner peace starts with a single step. Whether you are navigating life's transitions, seeking emotional support, or striving for balance, our compassionate professionals are here to walk with you in a safe, supportive space.";
const DEFAULT_BUTTON_TEXT = "Book an Appointment";
const DEFAULT_BUTTON_LINK = "/appointment";

export function ScheduleAppointment({
  headline = DEFAULT_HEADLINE,
  subtitle = DEFAULT_SUBTITLE,
  buttonText = DEFAULT_BUTTON_TEXT,
  buttonLink = DEFAULT_BUTTON_LINK,
}: ScheduleAppointmentProps = {}): React.JSX.Element {
  return (
    <section className="bg-accent py-24 mb-10">
      <div className="container">
        <div className="flex flex-col items-center gap-12">
          {/* Heading */}
          <h2
            className="font-marcellus text-4xl md:text-5xl leading-tight text-center text-black"
            dangerouslySetInnerHTML={{ __html: headline || DEFAULT_HEADLINE }}
          />

          {/* Subtitle */}
          <p className="font-sans text-lg leading-relaxed text-center text-black mx-auto max-w-4xl">
            {subtitle || DEFAULT_SUBTITLE}
          </p>

          {/* CTA Button */}
          <Button href={buttonLink || DEFAULT_BUTTON_LINK} variant="white">
            {buttonText || DEFAULT_BUTTON_TEXT}
          </Button>
        </div>
      </div>
    </section>
  );
}
