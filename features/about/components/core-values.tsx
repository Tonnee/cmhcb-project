import * as React from "react";
import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/shared/section-heading";

const VALUES = [
  {
    title: "Compassion",
    description: "We approach every individual with deep empathy, creating a safe, non-judgmental space for healing and personal growth.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
      </svg>
    ),
  },
  {
    title: "Excellence",
    description: "We are committed to providing the highest standard of evidence-based psychological care and continuous professional development.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
  },
  {
    title: "Integrity",
    description: "We uphold strict ethical standards, ensuring absolute confidentiality, honesty, and transparency in all our therapeutic relationships.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
  },
  {
    title: "Inclusivity",
    description: "We respect and celebrate diversity, ensuring our services are accessible and welcoming to people from all walks of life.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
];

export function CoreValues(): React.JSX.Element {
  return (
    <section className="py-16 md:py-24 bg-page-bg">
      <Container>
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-center">
          {/* Left Text */}
          <div className="w-full lg:w-1/3">
            <SectionHeading
              align="left"
              title={<>Our Core <span className="text-primary-dark">Values</span></>}
              subtitle="What Drives Us"
              className="mb-8"
            />
            <p className="font-sans text-light-ash text-lg leading-relaxed mb-8">
              At CMHCB, our philosophy is deeply rooted in the belief that everyone deserves access to quality mental health care. These fundamental principles guide every decision we make and every therapy session we conduct.
            </p>
          </div>

          {/* Right Grid */}
          <div className="w-full lg:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-5">
            {VALUES.map((value, idx) => (
              <div key={idx} className="bg-white p-8 rounded-3xl border border-muted/50 hover:border-accent hover:shadow-md transition-all group">
                <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                  {value.icon}
                </div>
                <h3 className="font-marcellus text-2xl text-dark mb-4">{value.title}</h3>
                <p className="font-sans text-light-ash leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
