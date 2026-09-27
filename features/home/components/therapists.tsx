import * as React from "react";
import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { TherapistCarousel } from "@/features/home/components/therapist-carousel";

import { THERAPISTS_DATA } from "@/features/therapists/data/therapists";

export interface TherapistsProps {
  therapists?: any[];
  subtitle?: string | null;
  title?: string | null;
}

export const DEFAULT_THERAPISTS_SUBTITLE = "Our Therapist";
export const DEFAULT_THERAPISTS_TITLE =
  "Personalized & Professional <span class=\"text-primary-dark\">Therapy</span> to Guide<br class=\"hidden md:block\" /> You Toward <span class=\"text-accent\">Healing</span>";

export default function Therapists({
  therapists,
  subtitle = DEFAULT_THERAPISTS_SUBTITLE,
  title = DEFAULT_THERAPISTS_TITLE,
}: TherapistsProps): React.JSX.Element {
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
          subtitle={subtitle || DEFAULT_THERAPISTS_SUBTITLE}
          title={<span dangerouslySetInnerHTML={{ __html: title || DEFAULT_THERAPISTS_TITLE }} />}
          className="mb-14"
        />

        {/* Dynamic Interactive Leaf Component Mounting Block */}
        <TherapistCarousel therapists={displayTherapists} />

      </Container>
    </section>
  );
}
