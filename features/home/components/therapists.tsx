import * as React from "react";
import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { TherapistCarousel } from "@/features/home/components/therapist-carousel";

import { THERAPISTS_DATA } from "@/features/therapists/data/therapists";

interface TherapistsProps {
  therapists?: any[];
}

export default function Therapists({ therapists }: TherapistsProps): React.JSX.Element {
  let displayTherapists = THERAPISTS_DATA;

  if (therapists && therapists.length > 0) {
    const sortedTherapists = [...therapists].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    displayTherapists = sortedTherapists.map((t) => {
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
  }

  return (
    <section className="py-20 lg:py-24">
      <Container>
        <SectionHeading 
          subtitle="Our Therapist"
          title={<>Personalized & Professional <span className="text-primary-dark">Therapy</span> to Guide<br className="hidden md:block" /> You Toward <span className="text-accent">Healing</span></>}
          className="mb-14"
        />

        {/* Dynamic Interactive Leaf Component Mounting Block */}
        <TherapistCarousel therapists={displayTherapists} />

      </Container>
    </section>
  );
}
