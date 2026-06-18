import * as React from "react";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { HiCheck } from "react-icons/hi2";

export default function PartnerCta(): React.JSX.Element {
  return (
    <section id="partner-cta" className="py-12 md:py-16 bg-white relative overflow-hidden">
      <Container>
        <div className="relative bg-dark-green text-white rounded-[32px] p-8 md:p-16 lg:p-20 shadow-xl overflow-hidden">
          {/* Subtle Decorative Gradient Glows */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-secondary/15 rounded-full blur-3xl pointer-events-none" />

          <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-center relative z-10">
            {/* Left Column - Copy & Promises */}
            <div className="lg:col-span-7 flex flex-col text-left">
              <span className="font-sans font-bold text-xs tracking-widest text-accent uppercase mb-4">
                Collaborative Impact
              </span>
              <h2 className="font-marcellus text-3xl md:text-4xl lg:text-5xl leading-tight text-white mb-6">
                {"Let's shape the future of mental health together"}
              </h2>
              <p className="font-sans text-base md:text-lg text-white/80 leading-relaxed mb-8">
                Join hands with CMHCB to foster clinical excellence, expand counseling accessibility, and build a stronger mental health support ecosystem across Bangladesh.
              </p>

              {/* Key Promises */}
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  "Standardized clinical referral protocols",
                  "Shared mental health resources & research",
                  "Joint training programs & events",
                  "Co-branded advocacy & campaign visibility",
                ].map((promise, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-accent/25 border border-accent/40 flex items-center justify-center shrink-0 mt-0.5">
                      <HiCheck className="w-3.5 h-3.5 text-accent" />
                    </div>
                    <span className="font-sans text-sm md:text-base text-white/95 leading-tight">
                      {promise}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column - Action Box */}
            <div className="lg:col-span-5 w-full">
              <div className="bg-white text-dark rounded-2xl p-8 shadow-2xl border border-white/10 flex flex-col text-center items-center">
                <h3 className="font-marcellus text-xl md:text-2xl text-primary-dark mb-3">
                  Become a Partner
                </h3>
                <p className="font-sans text-sm text-light-ash/80 mb-6 leading-relaxed">
                  Submit an inquiry today. Our operations and clinical coordination team will connect with you within 2 working days.
                </p>

                <Button
                  href="/contact"
                  variant="primary-dark"
                  className="w-full h-12 text-base rounded-xl shadow-md hover:shadow-lg transition-all"
                >
                  Initiate Partnership
                </Button>

                <div className="mt-6 pt-5 border-t border-muted/30 w-full">
                  <p className="font-sans text-xs text-light-ash/60">
                    Or send a formal proposal directly to:
                  </p>
                  <a
                    href="mailto:partnership@cmhcbd.com"
                    className="font-sans text-xs font-semibold text-primary hover:text-primary-dark transition-colors mt-1 inline-block"
                  >
                    partnership@cmhcbd.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

