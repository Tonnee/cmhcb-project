import * as React from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import prisma from "@/lib/prisma";
import { PageHero } from "@/components/shared/page-hero";
import { Container } from "@/components/layout/container";
import { ServiceProfessionals } from "@/features/services/components/service-professionals";
import { Faq, type FaqItem } from "@/components/shared/faq";
import { JsonLd } from "@/components/shared/json-ld";

interface ServiceDetailPageProps {
  params: Promise<{ slug: string }>;
}

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  const services = await prisma.service.findMany({
    select: { slug: true }
  });
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({
  params,
}: ServiceDetailPageProps): Promise<Metadata> {
  try {
    const { slug } = await params;
    const service = await prisma.service.findUnique({
      where: { slug },
    });
    if (!service) return {};

    const url = `https://cmhcbd.com/services/${service.slug}`;
    const image = service.bgImage || "/pages-hero-background/1.png";
    const imageUrl = image.startsWith("http")
      ? image
      : `https://cmhcbd.com${image.startsWith("/") ? "" : "/"}${image}`;

    return {
      title: `${service.title} | Mental Health Services`,
      description: service.shortDescription,
      alternates: {
        canonical: url,
      },
      openGraph: {
        type: "website",
        title: `${service.title} | Mental Health Care`,
        description: service.shortDescription,
        url: url,
        images: [
          {
            url: imageUrl,
            alt: service.title,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: service.title,
        description: service.shortDescription,
        images: [imageUrl],
      },
    };
  } catch (error) {
    console.error("Error generating metadata for service detail page:", error);
    return {
      title: "Services | CMHCB",
    };
  }
}

export default async function ServiceDetailPage({
  params,
}: ServiceDetailPageProps): Promise<React.JSX.Element> {
  const { slug } = await params;

  // Retrieve service details from database
  let service = null;
  try {
    service = await prisma.service.findUnique({
      where: { slug },
    });
  } catch (error) {
    console.error("Failed to load service detail from DB:", error);
  }

  if (!service) {
    notFound();
  }

  // Retrieve and filter dynamic therapists specializing in this service slug
  const dbTherapists = await prisma.therapist.findMany({
    orderBy: { name: "asc" },
  });

  const serviceTherapists = dbTherapists.map((t) => {
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
  }).filter((therapist) => {
    return therapist.services?.includes(slug);
  }).slice(0, 2);

  // Split newline fields into bullet point lists
  const whoIsItForPoints: string[] = service.whoIsItFor
    ? service.whoIsItFor.split(/\r?\n/).map((p: string) => p.trim()).filter(Boolean)
    : [];
  const approachPoints: string[] = service.approach
    ? service.approach.split(/\r?\n/).map((p: string) => p.trim()).filter(Boolean)
    : [];
  let faqItems: FaqItem[] = [];
  if (service.faqs) {
    try {
      faqItems = JSON.parse(service.faqs);
    } catch (e) {
      console.error("Failed to parse service FAQs:", e);
    }
  }

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `https://cmhcbd.com/services/${service.slug}#service`,
    name: service.title,
    description: service.shortDescription,
    provider: {
      "@id": "https://cmhcbd.com/#organization",
    },
    areaServed: {
      "@type": "Country",
      name: "Bangladesh",
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://cmhcbd.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Services",
        item: "https://cmhcbd.com/services",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: service.title,
        item: `https://cmhcbd.com/services/${service.slug}`,
      },
    ],
  };

  const jsonLdSchemas: any[] = [serviceJsonLd, breadcrumbJsonLd];

  if (faqItems.length > 0) {
    jsonLdSchemas.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqItems.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer,
        },
      })),
    });
  }

  return (
    <main className="bg-[#FAFDF9]">
      <JsonLd data={jsonLdSchemas} />
      <PageHero
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Services", href: "/services" },
        ]}
        currentPage={service.title}
        title={service.title}
        description={service.shortDescription}
        imageSrc={service.bgImage || "/pages-hero-background/1.png"}
        imageAlt={`${service.title} - CMHCB`}
        ctaLabel="Book an Appointment"
        ctaHref={`/appointment?service=${slug}`}
        duration={service.duration ?? undefined}
        fees={service.fees ?? undefined}
      />

      {/* Main Content Sections - Clean single-column layout */}
      <section className="py-20">
        <Container>
          <div className="flex flex-col gap-12">
            {/* 1. What Is [Service]? */}
            <div className="flex flex-col gap-4">
              <h2 className="font-marcellus text-3xl font-bold text-dark leading-snug">
                What Is {service.title}?
              </h2>
              <div
                className="font-sans text-[17px] text-light-ash/90 leading-relaxed whitespace-pre-wrap flex flex-col gap-6"
                dangerouslySetInnerHTML={{ __html: service.longDescription }}
              />
            </div>

            {/* 2. Who Is It For? */}
            {whoIsItForPoints.length > 0 && (
              <div className="flex flex-col gap-4">
                <h2 className="font-marcellus text-3xl font-bold text-dark leading-snug">
                  Who Is It For?
                </h2>
                <ul className="flex flex-col gap-3 pl-1">
                  {whoIsItForPoints.map((point: string, index: number) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="mt-2.5 w-1.5 h-1.5 rounded-full bg-light-ash/60 shrink-0" />
                      <span className="font-sans text-[17px] text-light-ash/90 leading-relaxed">
                        {point}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* 3. Our Therapeutic Approach */}
            {approachPoints.length > 0 && (
              <div className="flex flex-col gap-4">
                <h2 className="font-marcellus text-3xl font-bold text-dark leading-snug">
                  Our Therapeutic Approach
                </h2>
                <ul className="flex flex-col gap-3 pl-1">
                  {approachPoints.map((point: string, index: number) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="mt-2.5 w-1.5 h-1.5 rounded-full bg-light-ash/60 shrink-0" />
                      <span className="font-sans text-[17px] text-light-ash/90 leading-relaxed">
                        {point}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* 4. Session Details (Orange bullets) */}
            <div className="flex flex-col gap-4">
              <h2 className="font-marcellus text-3xl font-bold text-accent leading-snug">
                Session Details
              </h2>
              <ul className="flex flex-col gap-3 pl-1">
                {service.duration && (
                  <li className="flex items-start gap-3">
                    <span className="mt-2.5 w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                    <span className="font-sans text-[17px] text-light-ash/95 leading-relaxed">
                      <strong className="font-semibold text-dark">Duration:</strong> {service.duration}
                    </span>
                  </li>
                )}
                {service.fees && (
                  <li className="flex items-start gap-3">
                    <span className="mt-2.5 w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                    <span className="font-sans text-[17px] text-light-ash/95 leading-relaxed">
                      <strong className="font-semibold text-dark">Fee:</strong> {service.fees}
                    </span>
                  </li>
                )}
                {service.format && (
                  <li className="flex items-start gap-3">
                    <span className="mt-2.5 w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                    <span className="font-sans text-[17px] text-light-ash/95 leading-relaxed">
                      <strong className="font-semibold text-dark">Format:</strong> {service.format}
                    </span>
                  </li>
                )}
                {service.language && (
                  <li className="flex items-start gap-3">
                    <span className="mt-2.5 w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                    <span className="font-sans text-[17px] text-light-ash/95 leading-relaxed">
                      <strong className="font-semibold text-dark">Language:</strong> {service.language}
                    </span>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      {/* 5. Our Professionals */}
      {serviceTherapists.length > 0 && (
        <div className="bg-white py-16 border-t border-muted/20">
          <ServiceProfessionals therapists={serviceTherapists} />
        </div>
      )}

      {/* 6. FAQ Accordion Section */}
      {faqItems.length > 0 && (
        <div className="bg-[#FAFDF9] border-t border-muted/20">
          <Faq
            label="FAQ"
            heading={`Frequently Asked Questions – ${service.title}`}
            items={faqItems}
          />
        </div>
      )}
    </main>
  );
}