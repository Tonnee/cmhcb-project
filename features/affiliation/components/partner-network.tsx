import * as React from "react";
import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/shared/section-heading";

interface Partner {
  name: string;
  type: string;
  abbr: string;
}

const PARTNERS: Partner[] = [
  { name: "University of Dhaka", type: "Academic & Research Partner", abbr: "DU" },
  { name: "Bangladesh Psychological Association", type: "Professional Association", abbr: "BPA" },
  { name: "National Institute of Mental Health", type: "Clinical & Policy Affiliate", abbr: "NIMH" },
  { name: "Sajida Foundation", type: "Community Care Partner", abbr: "SF" },
  { name: "BRAC Institute of Educational Development", type: "Educational Research", abbr: "BRAC" },
  { name: "icddr,b", type: "Health Research Collaborator", abbr: "ICDDR" },
  { name: "National Trauma Counseling Centre", type: "Clinical Care Partner", abbr: "NTCC" },
  { name: "Moner Bandhu", type: "Mental Health Support Partner", abbr: "MB" },
];

export default function PartnerNetwork(): React.JSX.Element {
  return (
    <section className="py-20 md:py-24 bg-white">
      <Container>
        <SectionHeading
          subtitle="Our Network"
          title={<>Trusted by Leading <span className="text-primary-dark">Partners</span></>}
          className="mb-16"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PARTNERS.map((partner) => (
            <div
              key={partner.name}
              className="relative flex items-center gap-4 bg-white rounded-3xl p-5 border border-muted/30 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:border-primary-dark/40 hover:-translate-y-1 group overflow-hidden"
            >
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center font-marcellus text-lg font-bold text-primary-dark group-hover:bg-primary group-hover:text-white transition-all duration-300 shrink-0 select-none">
                {partner.abbr}
              </div>
              <div className="flex flex-col">
                <h3 className="font-marcellus text-base md:text-lg text-dark leading-snug group-hover:text-primary-dark transition-colors duration-300">
                  {partner.name}
                </h3>
                <span className="font-sans text-xs text-light-ash/70 mt-1">
                  {partner.type}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
