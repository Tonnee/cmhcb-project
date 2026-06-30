import * as React from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import prisma from "@/lib/prisma";
import { PageHero } from "@/components/shared/page-hero";
import { Container } from "@/components/layout/container";
import { ServiceProfessionals } from "@/features/services/components/service-professionals";

interface ServiceDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const services = await prisma.service.findMany({
    select: { slug: true }
  });
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({
  params,
}: ServiceDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = await prisma.service.findUnique({
    where: { slug },
  });
  if (!service) return {};
  return {
    title: `${service.title} | Services | CMHCB`,
    description: service.shortDescription,
  };
}

export default async function ServiceDetailPage({
  params,
}: ServiceDetailPageProps): Promise<React.JSX.Element> {
  const { slug } = await params;

  // Retrieve service details from database
  const service = await prisma.service.findUnique({
    where: { slug },
  });

  if (!service) {
    notFound();
  }

  // Retrieve and filter dynamic therapists specializing in this service slug
  const dbTherapists = await prisma.therapist.findMany({
    orderBy: { name: "asc" },
  });

  const serviceTherapists = dbTherapists.map((t) => {
    // Parse complex JSON arrays to make them compatible with components props
    let parsedEducation: string[] = [];
    let parsedTraining: string[] = [];
    let parsedExpertise: string[] = [];
    let parsedExperience: string[] = [];
    let parsedServices: string[] = [];
    let parsedActivities: string[] = [];
    let parsedFees: any = null;

    try { parsedEducation = JSON.parse(t.education || "[]"); } catch {}
    try { parsedTraining = JSON.parse(t.training || "[]"); } catch {}
    try { parsedExpertise = JSON.parse(t.expertise || "[]"); } catch {}
    try { parsedExperience = JSON.parse(t.experience || "[]"); } catch {}
    try { parsedServices = JSON.parse(t.services || "[]"); } catch {}
    try { parsedActivities = JSON.parse(t.activities || "[]"); } catch {}
    try { parsedFees = JSON.parse(t.fees || "null"); } catch {}

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
  }).filter((therapist) => {
    return therapist.services?.includes(slug);
  });

  return (
    <main>
      <PageHero
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Services", href: "/services" },
        ]}
        currentPage={service.title}
        title={service.title}
        description={service.shortDescription}
        imageSrc="/pages-hero-background/1.png"
        imageAlt="Professional psychotherapy in Dhaka - CMHCB"
        ctaLabel="Book an Appointment"
        ctaHref={`/appointment?service=${slug}`}
      />

      {/* Dynamic details & approach content blocks */}
      <section className="py-20 bg-white">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left Column: Detailed Service Outline */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              <h2 className="font-marcellus text-3xl font-bold text-dark-green leading-snug">
                About the Service
              </h2>
              <div 
                className="font-sans text-base text-light-ash leading-relaxed whitespace-pre-wrap flex flex-col gap-4"
                dangerouslySetInnerHTML={{ __html: service.longDescription }}
              />
            </div>
            
            {/* Right Column: Therapeutic Approach */}
            <div className="lg:col-span-5 bg-light/10 border border-muted p-8 rounded-3xl flex flex-col gap-6 self-start">
              <h3 className="font-marcellus text-2xl font-bold text-primary-dark leading-snug">
                Our Therapeutic Approach
              </h3>
              <div 
                className="font-sans text-sm text-light-ash leading-relaxed whitespace-pre-wrap flex flex-col gap-4"
                dangerouslySetInnerHTML={{ __html: service.approach }}
              />
            </div>
          </div>
        </Container>
      </section>

      {/* Related Therapists */}
      <ServiceProfessionals therapists={serviceTherapists} />
    </main>
  );
}