import * as React from "react";
import { Container } from "@/components/layout/container";
import { SimplePageHeader } from "@/components/shared/simple-page-header";
import { Button } from "@/components/ui/button";
import { Tag } from "@/components/ui/tag";
import {
  HiGlobeAlt,
  HiUserGroup,
  HiAcademicCap,
  HiShieldCheck,
  HiCheck,
  HiSparkles,
  HiScale,
  HiInboxArrowDown,
} from "react-icons/hi2";

// Define pillars structure
interface PillarItem {
  icon: React.ReactNode;
  title: string;
  description: string;
  badge: string;
}

const OUTREACH_PILLARS: PillarItem[] = [
  {
    icon: <HiUserGroup className="w-6 h-6 text-accent" />,
    title: "Pro-Bono Clinic Services",
    description: "Providing free individual psychological counseling and assessment sessions to marginalized or low-income communities who lack access to mental health facilities.",
    badge: "Clinical Care",
  },
  {
    icon: <HiAcademicCap className="w-6 h-6 text-accent" />,
    title: "School Mental Health Programs",
    description: "Partnering with schools and educational institutions to offer free teacher workshops on identifying student distress and classroom emotional support.",
    badge: "Education",
  },
  {
    icon: <HiGlobeAlt className="w-6 h-6 text-accent" />,
    title: "Community Open Circles",
    description: "Hosting free public workshops, mental health awareness seminars, and support circles in both urban and rural areas of Bangladesh to combat social stigma.",
    badge: "Awareness",
  },
  {
    icon: <HiShieldCheck className="w-6 h-6 text-accent" />,
    title: "Frontline & Crisis Training",
    description: "Equipping disaster relief groups, community leaders, and volunteer healthcare workers with basic Psychological First Aid (PFA) and coping toolkits.",
    badge: "Crisis Support",
  },
];

export interface CommunityServicePageContent {
  id: string;
  heroTitle: string;
  heroSubtitle: string;
  heroDescription: string;
  introTitle: string;
  introDescription1: string;
  introDescription2: string;
  stats: string;
  pillars: string;
  eligibilityTitle: string;
  eligibilityDescription: string;
  eligibilityItems: string;
  guidelinesTitle: string;
  guidelinesDescription: string;
  guidelinesItems: string;
  ctaTitle: string;
  ctaDescription: string;
  ctaEmail: string;
}

interface CommunityServiceProps {
  data?: CommunityServicePageContent;
}

function getIconComponent(iconName: string): React.ReactNode {
  switch (iconName) {
    case "userGroup":
      return <HiUserGroup className="w-6 h-6 text-accent" />;
    case "academicCap":
      return <HiAcademicCap className="w-6 h-6 text-accent" />;
    case "globe":
      return <HiGlobeAlt className="w-6 h-6 text-accent" />;
    case "shield":
      return <HiShieldCheck className="w-6 h-6 text-accent" />;
    default:
      return <HiGlobeAlt className="w-6 h-6 text-accent" />;
  }
}

export function CommunityService({ data }: CommunityServiceProps): React.JSX.Element {
  const heroTitle = data?.heroTitle || "Community Service Policy & Outreach";
  const heroSubtitle = data?.heroSubtitle || "Last Updated: May 2026";
  const heroDescription = data?.heroDescription || "At the Center for Mental Health and Care Bangladesh (CMHCB), we believe mental health support is a human right. Explore our structured community-oriented programs and the ethical guidelines that define our outreach initiatives.";
  
  const introTitle = data?.introTitle || "Our Commitment to Bangladesh's Communities";
  const introDescription1 = data?.introDescription1 || "CMHCB dedicates a portion of its resources and clinical hours to pro-bono work, local community workshops, and disaster response. Through structured partnerships, we aim to bridge the mental health service gap in Bangladesh.";
  const introDescription2 = data?.introDescription2 || "Our practitioners actively volunteer to implement community support initiatives, adhering to the same high ethical standards, confidentiality, and professional competence required in our standard clinical practices.";

  const statsList = React.useMemo(() => {
    if (!data?.stats) {
      return [
        { value: "15%", title: "Clinical Hours Allocation", description: "Dedicated to free community and pro-bono care" },
        { value: "2,500+", title: "Beneficiaries Reached", description: "Through awareness campaigns and workshops" },
        { value: "40+", title: "Institutional Partners", description: "Schools, NGOs, and voluntary local networks" }
      ];
    }
    try {
      return JSON.parse(data.stats);
    } catch {
      return [];
    }
  }, [data?.stats]);

  const pillarsList = React.useMemo(() => {
    if (!data?.pillars) {
      return OUTREACH_PILLARS.map((p) => ({
        badge: p.badge,
        title: p.title,
        description: p.description,
        iconComponent: p.icon
      }));
    }
    try {
      const parsed = JSON.parse(data.pillars) as Array<{ badge: string; title: string; description: string; iconName: string }>;
      return parsed.map(p => ({
        badge: p.badge,
        title: p.title,
        description: p.description,
        iconComponent: getIconComponent(p.iconName)
      }));
    } catch {
      return [];
    }
  }, [data?.pillars]);

  const eligibilityTitle = data?.eligibilityTitle || "Eligibility & Verification";
  const eligibilityDescription = data?.eligibilityDescription || "To ensure that our community and pro-bono services reach the individuals who need them most, we maintain a clear verification framework. Services are allocated based on these parameters:";
  
  const eligibilityList = React.useMemo(() => {
    if (!data?.eligibilityItems) {
      return [
        { title: "Economic Assessment", description: "Priority is given to clients verified by local council representatives or recognized NGOs as financially disadvantaged." },
        { title: "Referrals from Public Facilities", description: "Cases referred directly from government hospitals, community clinics, or educational boards." },
        { title: "Emergency Outreach Triage", description: "Immediate temporary counseling access for groups impacted by localized environmental disasters or sudden trauma." }
      ];
    }
    try {
      return JSON.parse(data.eligibilityItems);
    } catch {
      return [];
    }
  }, [data?.eligibilityItems]);

  const guidelinesTitle = data?.guidelinesTitle || "Operational Guidelines";
  const guidelinesDescription = data?.guidelinesDescription || "CMHCB maintains strong professional boundaries in its volunteer and outreach services to guarantee safety, quality, and clinical ethics.";
  
  const guidelinesList = React.useMemo(() => {
    if (!data?.guidelinesItems) {
      return [
        { title: "1. Scope of Care Limitations", description: "Our community programs do not replace specialized medical procedures or full-scale emergency crisis lines. Severe clinical conditions requiring hospitalization are referred to government psychiatric departments." },
        { title: "2. Supervision and Accountability", description: "All volunteer psychologists and counseling facilitators operate under the clinical supervision of senior licensed clinical psychologists to monitor session quality." },
        { title: "3. Strict Consent and Privacy", description: "No clinical information or media captured during outreach operations will be published or shared without prior written consent from participants." }
      ];
    }
    try {
      return JSON.parse(data.guidelinesItems);
    } catch {
      return [];
    }
  }, [data?.guidelinesItems]);

  const ctaTitle = data?.ctaTitle || "Request a Community Outreach Session";
  const ctaDescription = data?.ctaDescription || "Are you an NGO, school, university, or local community leader looking to partner with CMHCB for mental health awareness training or counseling camps? Write to our coordinator today.";
  const ctaEmail = data?.ctaEmail || "outreach@cmhcbd.com";

  return (
    <main className="bg-page-bg">
      {/* Page Header */}
      <SimplePageHeader
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Legal", href: "/legal/community-service" },
          { label: "Community Service", href: "/legal/community-service" },
        ]}
        title={heroTitle}
        subtitle={heroSubtitle}
        description={heroDescription}
      />

      {/* Intro Stats section */}
      <section className="py-12 md:py-16">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 flex flex-col justify-center">
              <h2 className="font-marcellus text-3xl text-dark mb-6">
                {introTitle}
              </h2>
              <p className="font-sans text-base leading-relaxed text-light-ash mb-4">
                {introDescription1}
              </p>
              <p className="font-sans text-base leading-relaxed text-light-ash">
                {introDescription2}
              </p>
            </div>

            <div className="bg-white border border-gray-100 rounded-3xl p-8 flex flex-col justify-center gap-6 shadow-sm shadow-gray-200/50">
              {statsList.map((stat: any, idx: number) => (
                <div
                  key={idx}
                  className={`flex items-center gap-4 ${idx < statsList.length - 1 ? "border-b border-gray-50 pb-4" : ""}`}
                >
                  <span className="text-3xl font-marcellus text-primary font-bold shrink-0">{stat.value}</span>
                  <div>
                    <h4 className="font-bold text-dark text-sm">{stat.title}</h4>
                    <p className="text-xs text-light-ash">{stat.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Grid of Outreach Pillars */}
      <section className="py-16 md:py-24 bg-white border-y border-black/5">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Tag variant="primary" className="mb-4">Outreach Programs</Tag>
            <h2 className="font-marcellus text-3xl md:text-4xl text-dark mb-4">
              Pillars of Our Social Impact
            </h2>
            <p className="font-sans text-base text-light-ash">
              We operate across multiple domains to integrate therapeutic interventions directly into the daily lives of the public.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {pillarsList.map((pillar: any, idx: number) => (
              <div
                key={idx}
                className="group p-8 rounded-3xl border border-gray-100 bg-page-bg transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-gray-200/50 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary text-primary">
                      {pillar.iconComponent}
                    </span>
                    <span className="text-xs font-semibold text-primary-dark font-sans uppercase tracking-wider bg-primary/5 px-3 py-1 rounded-full">
                      {pillar.badge}
                    </span>
                  </div>
                  <h3 className="font-marcellus text-xl text-primary-dark mb-4">
                    {pillar.title}
                  </h3>
                  <p className="font-sans text-sm text-light-ash leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Guidelines and Eligibility Column Sections */}
      <section className="py-16 md:py-24">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Left Column: Eligibility */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className="p-2 bg-primary/10 rounded-lg text-primary">
                  <HiSparkles className="w-6 h-6" />
                </span>
                <h2 className="font-marcellus text-2xl md:text-3xl text-dark">
                  {eligibilityTitle}
                </h2>
              </div>
              <p className="font-sans text-base text-light-ash mb-8 leading-relaxed">
                {eligibilityDescription}
              </p>

              <ul className="space-y-4">
                {eligibilityList.map((item: any, idx: number) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 text-primary shrink-0 mt-1">
                      <HiCheck className="w-3.5 h-3.5" />
                    </span>
                    <div>
                      <h4 className="font-sans font-semibold text-dark text-base">{item.title}</h4>
                      <p className="font-sans text-sm text-light-ash leading-relaxed mt-0.5">
                        {item.description}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right Column: Policies */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className="p-2 bg-primary/10 rounded-lg text-primary">
                  <HiScale className="w-6 h-6" />
                </span>
                <h2 className="font-marcellus text-2xl md:text-3xl text-dark">
                  {guidelinesTitle}
                </h2>
              </div>
              <p className="font-sans text-base text-light-ash mb-8 leading-relaxed">
                {guidelinesDescription}
              </p>

              <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-6">
                {guidelinesList.map((item: any, idx: number) => (
                  <div key={idx}>
                    <h4 className="font-sans font-semibold text-dark text-base mb-1 font-sans">
                      {item.title}
                    </h4>
                    <p className="font-sans text-sm text-light-ash leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Split CTA Block */}
      <section className="py-20 bg-dark-green text-white border-t border-black/10 relative overflow-hidden">
        {/* Glow gradients */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full bg-secondary/5 blur-[80px] pointer-events-none" />

        <Container className="relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 flex flex-col gap-6">
              <span className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white/10 text-accent">
                <HiInboxArrowDown className="w-6 h-6" />
              </span>
              <h2 className="font-marcellus text-[32px] lg:text-[40px] leading-tight text-white">
                {ctaTitle.split(" ").map((w: string, i: number, arr: string[]) => 
                  i === arr.length - 2 || i === arr.length - 1 ? (
                    <span key={i} className="text-secondary">{i === arr.length - 2 ? " " + w : " " + w}</span>
                  ) : i === 0 ? w : " " + w
                )}
              </h2>
              <p className="font-sans text-lg text-white/85 leading-relaxed max-w-xl">
                {ctaDescription}
              </p>
              <div className="flex flex-wrap gap-4 items-center text-sm font-sans text-white/80">
                <span className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                  No coordination fees
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                  Response within 3 working days
                </span>
              </div>
            </div>

            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <div className="bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10 w-full max-w-md">
                <h3 className="font-marcellus text-xl text-white mb-4">
                  Partner with Us
                </h3>
                <p className="font-sans text-sm text-white/80 leading-relaxed mb-6">
                  Email our clinical community program coordinators directly with details of your target group, location, and requested services.
                </p>
                <div className="flex flex-col gap-3">
                  <Button
                    href={`mailto:${ctaEmail}`}
                    variant="accent"
                    className="w-full justify-center h-12"
                  >
                    {ctaEmail}
                  </Button>
                  <Button
                    href="/contact"
                    variant="outline"
                    className="w-full justify-center h-12 text-white border-white/20 hover:bg-white/10"
                  >
                    Contact Support
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}

export default CommunityService;
