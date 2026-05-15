import * as React from "react";
import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/shared/section-heading";

interface EmergencyContact {
  title: string;
  description: string;
  phone: string;
  hours: string;
  isPrimary?: boolean;
}

const EMERGENCY_CONTACTS: EmergencyContact[] = [
  {
    title: "National Emergency Service",
    description: "For immediate life-threatening medical emergencies or if you or someone else is in immediate danger.",
    phone: "999",
    hours: "Available 24/7",
  },
  {
    title: "CMHCB Crisis Helpline",
    description: "Speak directly with one of our trained mental health crisis counsellors for immediate support and guidance.",
    phone: "+880 1974-349569",
    hours: "Available 24/7",
    isPrimary: true,
  },
];

export function EmergencySupport(): React.JSX.Element {
  return (
    <section className="py-16 md:py-24 bg-page-bg">
      <Container>
        <SectionHeading
          title="Emergency Contacts"
          subtitle="Get Immediate Help"
          align="center"
        />

        <div className="grid md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
          {EMERGENCY_CONTACTS.map((contact) => (
            <div
              key={contact.title}
              className={`rounded-[20px] p-8 md:p-10 transition-all ${contact.isPrimary
                ? "bg-accent text-black"
                : "bg-white text-dark hover:shadow-sm"
                }`}
            >
              <h3 className="font-marcellus text-2xl md:text-3xl mb-3">
                {contact.title}
              </h3>
              <p
                className={`font-sans text-sm md:text-base leading-relaxed mb-6 ${contact.isPrimary ? "text-black/80" : "text-light-ash"
                  }`}
              >
                {contact.description}
              </p>

              <div className="space-y-1.5 mt-auto">
                <div className="flex items-center gap-3">
                  <span
                    className={`font-sans font-bold text-2xl ${contact.isPrimary ? "text-black" : "text-primary-dark"
                      }`}
                  >
                    {contact.phone}
                  </span>
                </div>
                <p
                  className={`font-sans text-xs uppercase tracking-wider font-medium ${contact.isPrimary ? "text-black/70" : "text-light-ash/70"
                    }`}
                >
                  {contact.hours}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
