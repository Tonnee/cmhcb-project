import * as React from "react";
import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { PageFeatureHero } from "@/components/shared/page-feature-hero";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/shared/section-heading";
import { HiCheckCircle, HiUserGroup, HiGlobeAlt, HiStar } from "react-icons/hi2";

export const metadata: Metadata = {
  title: "Affiliation Program | CMHCB",
  description: "Join our affiliation program and become a partner with the Center for Mental Health and Care Bangladesh.",
};

export default function AffiliationPage(): React.JSX.Element {
  return (
    <main>
      <PageFeatureHero
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Affiliation", href: "/affiliation" },
        ]}
        title="Partner with CMHCB"
        description="Join our network of professionals and organizations dedicated to advancing mental health care in Bangladesh. Together, we can make a greater impact by expanding access to quality psychological support."
        image={{
          src: "/hero-image/psychotherapy-counseling-session.png",
          alt: "Partnership and Collaboration",
        }}
        ctas={[
          {
            label: "Become a Partner",
            variant: "primary",
            href: "#partner-cta",
            className: "bg-primary-dark hover:bg-primary-dark/90 border-primary-dark",
          },
        ]}
      />

      {/* 1. Our Network (Moved up) */}
      <section className="py-24 bg-white">
        <Container>
          <SectionHeading
            subtitle="Our Network"
            title={<>Trusted by <span className="text-primary-dark">Partners</span></>}
            className="mb-16"
          />
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
              <div 
                key={num}
                className="bg-gray-50 rounded-3xl border border-gray-100 h-32 flex items-center justify-center p-6 transition-all hover:shadow-md hover:border-accent"
              >
                <span className="font-marcellus text-xl text-light-ash text-center">Partner Logo {num}</span>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* 2. Why Affiliate with Us (Without image) */}
      <section className="py-24 bg-page-bg">
        <Container>
          <div className="max-w-5xl mx-auto">
            <SectionHeading
              align="center"
              subtitle="Benefits"
              title={<>Why Affiliate <span className="text-primary-dark">with Us?</span></>}
              className="mb-16"
            />
            
            <div className="grid md:grid-cols-2 gap-6">
              {[
                "Access to a vast network of leading mental health professionals.",
                "Collaborative opportunities in clinical research and community outreach.",
                "Exclusive training, specialized workshops, and professional development.",
                "Mutual referral programs to better serve our diverse client base.",
                "Enhanced brand credibility through partnership with a trusted institution.",
                "Dedicated support to ensure a seamless and successful collaboration."
              ].map((item, idx) => (
                <div key={idx} className="bg-white p-8 rounded-3xl border border-gray-100 flex gap-5 items-start transition-all hover:border-accent hover:shadow-md">
                  <HiCheckCircle className="w-8 h-8 text-primary shrink-0 mt-0.5" />
                  <p className="font-sans text-lg text-dark leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* 3. Company Strength */}
      <section className="py-24 bg-white">
        <Container>
          <SectionHeading
            align="center"
            subtitle="Our Impact"
            title={<>Our <span className="text-primary-dark">Strength</span></>}
            className="mb-16"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { icon: <HiUserGroup />, stat: "50+", label: "Expert Professionals" },
              { icon: <HiStar />, stat: "10,000+", label: "Lives Impacted" },
              { icon: <HiGlobeAlt />, stat: "25+", label: "Partners & Affiliates" },
            ].map((strength, idx) => (
              <div key={idx} className="bg-gray-50 p-10 rounded-3xl border border-gray-100 text-center flex flex-col items-center transition-all hover:shadow-md">
                <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6 text-3xl">
                  {strength.icon}
                </div>
                <h3 className="font-marcellus text-4xl text-dark mb-2">{strength.stat}</h3>
                <p className="font-sans text-lg text-light-ash">{strength.label}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* 4. Contact for Partnership CTA */}
      <section id="partner-cta" className="py-24 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 rounded-[40px] transform -rotate-2 scale-105" />
        <Container className="relative z-10">
          <div className="max-w-4xl mx-auto text-center bg-white p-12 md:p-20 rounded-[32px] shadow-sm border border-gray-100">
            <h2 className="font-marcellus text-4xl md:text-[48px] leading-tight text-dark mb-6">
              Become a <span className="text-primary-dark">Partner</span>
            </h2>
            <p className="font-sans text-lg text-light-ash mb-12 max-w-2xl mx-auto leading-relaxed">
              Whether you are an independent practitioner, an educational institution, or a corporate organization, we welcome you to join our mission of building a healthier society.
            </p>
            <Button href="/contact" variant="primary" className="text-lg px-10 py-5">
              Contact for Partnership
            </Button>
          </div>
        </Container>
      </section>
    </main>
  );
}
