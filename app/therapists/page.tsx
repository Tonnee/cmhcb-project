import type { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { TherapistList } from "@/features/therapists/components/therapist-list";
import { Faq } from "@/components/shared/faq";
import { THERAPIST_FAQS } from "@/features/therapists/data/faqs";
import { AppointmentCta } from "@/features/therapists/components/appointment-cta";
import { THERAPISTS_DATA } from "@/features/therapists/data/therapists";

export const metadata: Metadata = {
  title: "Our Therapists | Center for Mental Health and Care, Bangladesh",
  description:
    "Meet our team of experienced clinical psychologists and counselors dedicated to supporting your mental health journey with evidence-based care.",
};

export default function TherapistsPage() {
  const totalSessions = THERAPISTS_DATA.reduce((sum, t) => {
    const sessionEntry = t.experience?.find((e) => e.toLowerCase().includes("session"));
    if (!sessionEntry) return sum;
    const match = sessionEntry.match(/([\d,]+)\+?/);
    return sum + (match ? parseInt(match[1].replace(/,/g, ""), 10) : 0);
  }, 0);

  const totalYears = THERAPISTS_DATA.reduce((sum, t) => {
    const yearsEntry = t.experience?.find((e) => e.toLowerCase().includes("year"));
    if (!yearsEntry) return sum;
    const match = yearsEntry.match(/(\d+)\+?/);
    return sum + (match ? parseInt(match[1], 10) : 0);
  }, 0);

  const stats = [
    { value: `${THERAPISTS_DATA.length}`, label: "Specialist Therapists" },
    { value: `${totalYears}+`, label: "Combined Years of Experience" },
    { value: `${(totalSessions / 1000).toFixed(0)}K+`, label: "Therapy Sessions Conducted" },
  ];

  return (
    <main className="pt-20 pb-0">
      {/* ── Page Header ──────────────────────────────────────────────── */}
      <Container className="mb-40">
        <div className="flex flex-col lg:flex-row items-stretch gap-12 lg:gap-20 mb-24">
          {/* Left: Content */}
          <div className="flex flex-col flex-1 w-full lg:pr-10 xl:pr-16">
            <SectionHeading
              subtitle="Our Team"
              title={<>Meet Our <span className="text-primary-dark">Therapists</span></>}
              align="left"
              level="h1"
              className="mb-8"
            />

            <p className="font-sans text-base text-light-ash leading-relaxed max-w-[568px] mb-10">
              Our multidisciplinary team of clinical psychologists and counselors brings
              decades of combined experience in evidence-based care — from CBT and DBT to
              systemic family therapy and trauma-focused interventions.
            </p>

            {/* Stats as modern editorial counters */}
            <div className="grid grid-cols-3 gap-6 md:gap-8 pt-8 border-t border-muted/20">
              {stats.map((stat) => (
                <div key={stat.label} className="flex flex-col gap-1">
                  <span className="font-marcellus text-3xl md:text-4xl text-primary-dark leading-none font-medium">
                    {stat.value}
                  </span>
                  <span className="font-sans text-[10px] md:text-xs font-semibold tracking-wider text-light-ash/60 uppercase">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Image */}
          <div className="shrink-0 w-full lg:w-[470px] flex">
            <div className="relative rounded-[32px] overflow-hidden aspect-3/4 lg:aspect-auto w-full lg:h-full min-h-[350px] lg:min-h-0 bg-gray-50 flex-1">
              <Image
                src="/compassionate-mental-health-professional.png"
                alt="Our therapists team"
                fill
                sizes="(max-width: 1024px) 100vw, 470px"
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>

        {/* Therapist Grid with filter */}
        <TherapistList />
      </Container>
    
      <AppointmentCta />
      <Faq items={THERAPIST_FAQS} heading="Frequently Asked Questions" className="mb-24" />
    </main>
  );
}
