import * as React from "react";
import { HiHeart, HiStar, HiShieldCheck, HiUsers } from "react-icons/hi2";
import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/shared/section-heading";

const VALUES = [
  {
    title: "Compassion",
    description: "We approach every individual with deep empathy, creating a safe, non-judgmental space for healing and personal growth.",
    icon: <HiHeart className="w-7 h-7" />,
  },
  {
    title: "Excellence",
    description: "We are committed to providing the highest standard of evidence-based psychological care and continuous professional development.",
    icon: <HiStar className="w-7 h-7" />,
  },
  {
    title: "Integrity",
    description: "We uphold strict ethical standards, ensuring absolute confidentiality, honesty, and transparency in all our therapeutic relationships.",
    icon: <HiShieldCheck className="w-7 h-7" />,
  },
  {
    title: "Inclusivity",
    description: "We respect and celebrate diversity, ensuring our services are accessible and welcoming to people from all walks of life.",
    icon: <HiUsers className="w-7 h-7" />,
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
                <div className="w-14 h-14 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
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
