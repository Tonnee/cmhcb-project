import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { TherapistList } from "@/features/therapists/components/therapist-list";
import { Faq } from "@/components/shared/faq";
import { THERAPIST_FAQS } from "@/features/therapists/data/faqs";
import { AppointmentCta } from "@/features/therapists/components/appointment-cta";

export const metadata: Metadata = {
  title: "Our Therapists | Center for Mental Health and Care, Bangladesh",
  description: "Meet our team of experienced therapists, psychologists, and counselors dedicated to supporting your mental health journey.",
};

export default function TherapistsPage() {
  return (
    <main className="pt-32 pb-0">
      <Container className="mb-24">
        <SectionHeading title="Meet Our Therapists" className="mb-14" />
        <TherapistList />
      </Container>
      <AppointmentCta />
      <Faq items={THERAPIST_FAQS} heading="Frequently Asked Questions" className="mb-24" />
    </main>
  );
}
