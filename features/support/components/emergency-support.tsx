import * as React from "react";
import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { HiPhone, HiExclamationTriangle, HiShieldCheck } from "react-icons/hi2";

const iconMap: Record<string, React.ElementType> = {
  phone: HiPhone,
  warning: HiExclamationTriangle,
  shield: HiShieldCheck,
};

interface EmergencyContact {
  title: string;
  description: string;
  phone: string;
  hours: string;
  icon: React.ElementType;
  isPrimary?: boolean;
}

const EMERGENCY_CONTACTS: EmergencyContact[] = [
  {
    title: "CMHCB Crisis Helpline",
    description: "Speak directly with our trained psychological first-aid team for immediate mental health support, emotional guidance, crisis interventions, and safety planning.",
    phone: "+880 1974-349569",
    hours: "Available 24/7",
    icon: HiPhone,
    isPrimary: true,
  },
  {
    title: "National Emergency Service",
    description: "Call immediately for urgent, life-threatening medical emergencies, police assistance, ambulance dispatch, or physical safety threats.",
    phone: "999",
    hours: "Available 24/7",
    icon: HiExclamationTriangle,
  },
  {
    title: "National Child Helpline",
    description: "Toll-free national emergency helpline dedicated to children and youth in distress, offering immediate protection, support, and counseling.",
    phone: "1098",
    hours: "Available 24/7",
    icon: HiShieldCheck,
  },
];

interface ContactInput {
  title: string;
  description: string;
  phone: string;
  hours: string;
  iconName: string;
  isPrimary?: boolean;
}

interface EmergencySupportProps {
  initialContacts?: string;
  initialAdvisoryText?: string;
}

export function EmergencySupport({
  initialContacts,
  initialAdvisoryText,
}: EmergencySupportProps): React.JSX.Element {
  const contactsList = React.useMemo(() => {
    if (initialContacts) {
      try {
        const parsed = JSON.parse(initialContacts);
        if (Array.isArray(parsed)) {
          return parsed.map((c: ContactInput) => ({
            title: c.title,
            description: c.description,
            phone: c.phone,
            hours: c.hours,
            icon: iconMap[c.iconName] || HiPhone,
            isPrimary: !!c.isPrimary,
          }));
        }
      } catch (e) {
        console.error("Failed to parse initialContacts:", e);
      }
    }
    return EMERGENCY_CONTACTS;
  }, [initialContacts]);

  const advisory = initialAdvisoryText || "Important Advisory: CMHCB and associated emotional helper helplines provide psychological support, mental health counseling, and crisis triage. If you or someone you know is in immediate physical danger, experiencing a severe drug/medical emergency, or threatened by active self-harm, please dial the National Emergency Hotline (999) or proceed immediately to the nearest hospital emergency department.";
  return (
    <section className="py-20 md:py-28 bg-page-bg">
      <Container>
        <SectionHeading
          title="Emergency Helplines"
          subtitle="Immediate Assistance"
          align="center"
          className="mb-16"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch max-w-6xl mx-auto">
          {contactsList.map((contact) => {
            const Icon = contact.icon;
            if (contact.isPrimary) {
              return (
                <div
                  key={contact.title}
                  className="bg-primary-dark text-white rounded-4xl p-8 md:p-10 flex flex-col justify-between w-full h-full border border-primary-dark shadow-[0_12px_40px_rgba(3,83,0,0.12)] hover:shadow-[0_16px_48px_rgba(3,83,0,0.18)] transition-all duration-300"
                >
                  <div>
                    <div className="w-14 h-14 rounded-2xl bg-white/10 text-accent flex items-center justify-center mb-8 shrink-0">
                      <Icon className="w-8 h-8" />
                    </div>
                    <h3 className="font-marcellus text-3xl mb-4 tracking-wide text-white font-medium">
                      {contact.title}
                    </h3>
                    <p className="font-sans text-[15px] leading-relaxed text-white/80 mb-8">
                      {contact.description}
                    </p>
                  </div>

                  <div className="pt-8 border-t border-white/10 mt-auto">
                    <a
                      href={`tel:${contact.phone.replace(/[\s+-]/g, "")}`}
                      className="font-sans font-bold text-2xl text-accent hover:text-white transition-colors duration-300 block mb-2"
                    >
                      {contact.phone}
                    </a>
                    <p className="font-sans text-xs uppercase tracking-wider font-semibold text-white/50">
                      {contact.hours}
                    </p>
                  </div>
                </div>
              );
            }

            return (
              <div
                key={contact.title}
                className="bg-white rounded-4xl p-8 md:p-10 border border-muted/30 hover:border-primary-dark/30 transition-all duration-300 hover:shadow-[0_12px_40px_rgba(0,0,0,0.04)] flex flex-col justify-between w-full h-full"
              >
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-8 shrink-0">
                    <Icon className="w-8 h-8" />
                  </div>
                  <h3 className="font-marcellus text-3xl mb-4 tracking-wide text-dark font-medium">
                    {contact.title}
                  </h3>
                  <p className="font-sans text-[15px] leading-relaxed text-light-ash/90 mb-8">
                    {contact.description}
                  </p>
                </div>

                <div className="pt-8 border-t border-muted/20 mt-auto">
                  <a
                    href={`tel:${contact.phone.replace(/[\s+-]/g, "")}`}
                    className="font-sans font-bold text-2xl text-primary hover:text-primary-dark transition-colors duration-300 block mb-2"
                  >
                    {contact.phone}
                  </a>
                  <p className="font-sans text-xs uppercase tracking-wider font-semibold text-light-ash/60">
                    {contact.hours}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Advisory Disclaimer */}
        <div className="mt-20 text-center max-w-3xl mx-auto px-4">
          <p className="font-sans text-sm text-light-ash/80 leading-relaxed border-t border-muted/20 pt-10">
            {advisory}
          </p>
        </div>
      </Container>
    </section>
  );
}
