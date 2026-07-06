import * as React from "react";
import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/shared/section-heading";
import {
  HiUserGroup,
  HiGlobeAlt,
  HiAcademicCap,
  HiArrowPath,
  HiShieldCheck,
  HiChatBubbleLeftRight,
} from "react-icons/hi2";

const iconMap: Record<string, React.ReactNode> = {
  UserGroup: <HiUserGroup />,
  GlobeAlt: <HiGlobeAlt />,
  AcademicCap: <HiAcademicCap />,
  ArrowPath: <HiArrowPath />,
  ShieldCheck: <HiShieldCheck />,
  ChatBubble: <HiChatBubbleLeftRight />,
};

const DEFAULT_BENEFITS = [
  {
    title: "Professional Network",
    description: "Gain access to a vast, multi-disciplinary network of leading psychiatrists, clinical psychologists, and therapists across Bangladesh.",
    icon: "UserGroup",
  },
  {
    title: "Research & Outreach",
    description: "Participate in clinical research, community advocacy programs, and large-scale mental health awareness campaigns.",
    icon: "GlobeAlt",
  },
  {
    title: "Continuous Learning",
    description: "Receive priority access to CMHCB's specialized workshops, masterclasses, and ongoing professional development training.",
    icon: "AcademicCap",
  },
  {
    title: "Referral Ecosystem",
    description: "Leverage mutual client referral pathways designed to connect individuals with the most appropriate expert care.",
    icon: "ArrowPath",
  },
  {
    title: "Brand Credibility",
    description: "Elevate your organization or private practice's visibility by aligning with a highly-regarded and trusted institution.",
    icon: "ShieldCheck",
  },
  {
    title: "Partner Support",
    description: "Get dedicated operational and administrative assistance to ensure smooth collaborations and streamline communications.",
    icon: "ChatBubble",
  },
];

interface BenefitItem {
  title: string;
  description: string;
  icon: string;
}

interface AffiliationBenefitsProps {
  benefits?: BenefitItem[];
}

export default function AffiliationBenefits({ benefits }: AffiliationBenefitsProps): React.JSX.Element {
  const displayBenefits = benefits && benefits.length > 0 ? benefits : DEFAULT_BENEFITS;

  return (
    <section className="py-20 md:py-24 bg-page-bg">
      <Container>
        <SectionHeading
          subtitle="Partnership Benefits"
          title={<>Why Affiliate <span className="text-primary-dark">with Us?</span></>}
          className="mb-16"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayBenefits.map((benefit) => (
            <div
              key={benefit.title}
              className="bg-white rounded-[24px] p-8 border border-muted/20 hover:border-accent/50 hover:shadow-[0_12px_40px_rgba(0,12,0,0.03)] transition-all duration-300 flex flex-col items-start group"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 text-2xl text-primary-dark group-hover:bg-primary group-hover:text-white transition-all duration-300">
                {iconMap[benefit.icon] || <HiUserGroup />}
              </div>
              <h3 className="font-marcellus text-xl text-dark mb-3 leading-snug tracking-wide group-hover:text-primary-dark transition-colors duration-300">
                {benefit.title}
              </h3>
              <p className="font-sans text-sm md:text-base text-light-ash/90 leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
