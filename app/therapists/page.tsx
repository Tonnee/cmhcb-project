import type { Metadata } from "next";
import prisma from "@/lib/prisma";
import { Container } from "@/components/layout/container";
import { PageHero } from "@/components/shared/page-hero";
import { TherapistList } from "@/features/therapists/components/therapist-list";
import { Faq } from "@/components/shared/faq";
import { THERAPIST_FAQS } from "@/features/therapists/data/faqs";
import { AppointmentCta } from "@/features/therapists/components/appointment-cta";

export const metadata: Metadata = {
  title: "Our Therapists | Center for Mental Health and Care, Bangladesh",
  description:
    "Meet our team of experienced clinical psychologists and counselors dedicated to supporting your mental health journey with evidence-based care.",
};

export const dynamic = "force-dynamic";

export default async function TherapistsPage() {
  // Query all therapists dynamically from the database
  const dbTherapists = await prisma.therapist.findMany({
    orderBy: { name: "asc" }
  });

  const therapists = dbTherapists.map((t) => {
    let parsedEducation: string[] = [];
    let parsedTraining: string[] = [];
    let parsedExpertise: string[] = [];
    let parsedExperience: string[] = [];
    let parsedServices: string[] = [];
    let parsedActivities: string[] = [];
    let parsedFees: any = null;

    try { parsedEducation = JSON.parse(t.education || "[]"); } catch { }
    try { parsedTraining = JSON.parse(t.training || "[]"); } catch { }
    try { parsedExpertise = JSON.parse(t.expertise || "[]"); } catch { }
    try { parsedExperience = JSON.parse(t.experience || "[]"); } catch { }
    try { parsedServices = JSON.parse(t.services || "[]"); } catch { }
    try { parsedActivities = JSON.parse(t.activities || "[]"); } catch { }
    try { parsedFees = JSON.parse(t.fees || "null"); } catch { }

    return {
      id: t.id,
      image: t.image,
      name: t.name,
      role: t.role,
      bio: t.bio,
      education: parsedEducation,
      training: parsedTraining,
      expertise: parsedExpertise,
      experience: parsedExperience,
      fees: parsedFees,
      services: parsedServices,
      activities: parsedActivities,
    };
  });

  const totalSessions = therapists.reduce((sum, t) => {
    const sessionEntry = t.experience?.find((e) => e.toLowerCase().includes("session"));
    if (!sessionEntry) return sum;
    const match = sessionEntry.match(/([\d,]+)\+?/);
    return sum + (match ? parseInt(match[1].replace(/,/g, ""), 10) : 0);
  }, 0);

  const totalYears = therapists.reduce((sum, t) => {
    const yearsEntry = t.experience?.find((e) => e.toLowerCase().includes("year"));
    if (!yearsEntry) return sum;
    const match = yearsEntry.match(/(\d+)\+?/);
    return sum + (match ? parseInt(match[1], 10) : 0);
  }, 0);

  const stats = [
    { value: `${therapists.length}`, label: "Specialist Therapists" },
    { value: `${totalYears}+`, label: "Combined Years of Experience" },
    { value: `${(totalSessions / 1000).toFixed(0)}K+`, label: "Therapy Sessions Conducted" },
  ];

  return (
    <main className="pb-0">
      <PageHero
        breadcrumbs={[{ label: "Home", href: "/" }]}
        currentPage="Therapists"
        title="Meet Our Therapists"
        description="Our multidisciplinary team of clinical psychologists and counselors brings decades of combined experience in evidence-based care — from CBT and DBT to systemic family therapy and trauma-focused interventions."
        imageSrc="/experienced-mental-health-therapists.png"
        imageAlt="Experienced mental health therapists and counselors team - CMHCB"
        ctaLabel="Book an Appointment"
        ctaHref="/appointment"
      >
        {/* Stats as modern editorial counters */}
        <div className="grid grid-cols-3 gap-6 md:gap-8 pt-6">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col gap-1">
              <span className="font-marcellus text-2xl md:text-3xl text-white leading-none font-medium">
                {stat.value}
              </span>
              <span className="font-sans text-[9px] md:text-xs font-semibold tracking-wider text-white/60 uppercase">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </PageHero>

      <Container className="py-20">
        {/* Therapist Grid with filter */}
        <TherapistList therapists={therapists} />
      </Container>

      <AppointmentCta />
      <Faq items={THERAPIST_FAQS} heading="Frequently Asked Questions" className="mb-24" />
    </main>
  );
}
