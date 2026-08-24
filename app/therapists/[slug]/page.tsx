import * as React from "react";
import { Metadata } from "next";
import {
  HiAcademicCap,
  HiBriefcase,
  HiSparkles,
} from "react-icons/hi2";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { THERAPISTS_DATA } from "@/features/therapists/data/therapists";
import { SERVICES } from "@/features/services/data/services";
import { BLOG_POSTS } from "@/features/blog/data/blogs";
import { BlogCard } from "@/features/blog/components/blog-card";
import { ServiceCard } from "@/components/shared/service-card";
import { BookAppointmentButton } from "@/components/shared/book-appointment-button";
import { Tag } from "@/components/ui/tag";
import { Button } from "@/components/ui/button";
import { JsonLd } from "@/components/shared/json-ld";

/* ------------------------------------------------------------------ */
/* Small reusable sub-components                                        */
/* ------------------------------------------------------------------ */

function SectionCard({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="group relative rounded-3xl border border-muted/30 bg-white p-8 hover:border-primary-dark/60 transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex flex-col">
      {/* Top Accent Line */}
      <div className="w-8 h-1 bg-accent/40 group-hover:w-16 group-hover:bg-primary-dark transition-all duration-300 mb-6 rounded-full" />
      
      <div className="flex items-center gap-3 mb-6">
        <Icon className="w-5 h-5 text-primary-dark shrink-0" />
        <h3 className="font-marcellus text-xl text-dark tracking-wide">{title}</h3>
      </div>
      <div className="flex-1">{children}</div>
    </div>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-col gap-3.5">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-3">
          <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0 mt-2.5" aria-hidden="true" />
          <span className="font-sans text-sm md:text-base text-light-ash/80 leading-relaxed">{item}</span>
        </li>
      ))}
    </ul>
  );
}

import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

/* ------------------------------------------------------------------ */
/* Page                                                                 */
/* ------------------------------------------------------------------ */

export async function generateStaticParams() {
  const therapists = await prisma.therapist.findMany({ select: { id: true } });
  if (therapists.length > 0) {
    return therapists.map((t) => ({ slug: t.id }));
  }
  return THERAPISTS_DATA.map((t) => ({ slug: t.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  try {
    const { slug } = await params;
    const dbTherapist = await prisma.therapist.findUnique({ where: { id: slug } }).catch(() => null);
    const therapist = dbTherapist || THERAPISTS_DATA.find((t) => t.id === slug);
    if (!therapist) return {};

    const url = `https://cmhcbd.com/therapists/${therapist.id}`;
    const imageUrl = therapist.image?.startsWith("http")
      ? therapist.image
      : `https://cmhcbd.com${therapist.image?.startsWith("/") ? "" : "/"}${therapist.image || "pages-hero-background/therapist-default.png"}`;

    return {
      title: `${therapist.name} | ${therapist.role}`,
      description: therapist.bio || `Consult with ${therapist.name}, clinical psychologist at CMHCB.`,
      alternates: {
        canonical: url,
      },
      openGraph: {
        type: "profile",
        title: `${therapist.name} - ${therapist.role}`,
        description: therapist.bio || `Clinical psychologist at CMHCB.`,
        url: url,
        images: [
          {
            url: imageUrl,
            alt: therapist.name,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: therapist.name,
        description: therapist.bio || `Clinical psychologist at CMHCB.`,
        images: [imageUrl],
      },
    };
  } catch (error) {
    console.error("Error generating metadata for therapist detail page:", error);
    return {
      title: "Therapist Profile | CMHCB",
    };
  }
}

export default async function TherapistProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<React.JSX.Element> {
  const { slug } = await params;
  const dbTherapist = await prisma.therapist.findUnique({ where: { id: slug } }).catch(() => null);
  const staticTherapist = THERAPISTS_DATA.find((t) => t.id === slug);

  if (!dbTherapist && !staticTherapist) {
    notFound();
  }

  let education: string[] = staticTherapist?.education || [];
  let training: string[] = staticTherapist?.training || [];
  let expertise: string[] = staticTherapist?.expertise || [];
  let experience: string[] = staticTherapist?.experience || [];
  let services: string[] = staticTherapist?.services || [];
  let activities: string[] = staticTherapist?.activities || [];
  let fees: any = staticTherapist?.fees || null;

  if (dbTherapist) {
    try { if (dbTherapist.education) education = JSON.parse(dbTherapist.education); } catch {}
    try { if (dbTherapist.training) training = JSON.parse(dbTherapist.training); } catch {}
    try { if (dbTherapist.expertise) expertise = JSON.parse(dbTherapist.expertise); } catch {}
    try { if (dbTherapist.experience) experience = JSON.parse(dbTherapist.experience); } catch {}
    try { if (dbTherapist.services) services = JSON.parse(dbTherapist.services); } catch {}
    try { if (dbTherapist.activities) activities = JSON.parse(dbTherapist.activities); } catch {}
    try { if (dbTherapist.fees) fees = JSON.parse(dbTherapist.fees); } catch {}
  }

  const therapist = {
    id: dbTherapist?.id || staticTherapist!.id,
    name: dbTherapist?.name || staticTherapist!.name,
    role: dbTherapist?.role || staticTherapist!.role,
    image: dbTherapist?.image || staticTherapist!.image,
    bio: dbTherapist?.bio || staticTherapist!.bio,
    education,
    training,
    expertise,
    experience,
    services,
    activities,
    fees,
  };

  const therapistBlogs = BLOG_POSTS.filter(
    (post) =>
      post.author.toLowerCase().includes(therapist.name.toLowerCase()) ||
      therapist.name.toLowerCase().includes(post.author.toLowerCase())
  );

  const hasEducation = therapist.education && therapist.education.length > 0;
  const hasTraining = therapist.training && therapist.training.length > 0;
  const hasExpertise = therapist.expertise && therapist.expertise.length > 0;
  const hasExperience = therapist.experience && therapist.experience.length > 0;
  const hasFees = therapist.fees && therapist.fees.length > 0;

  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `https://cmhcbd.com/therapists/${therapist.id}#person`,
    name: therapist.name,
    jobTitle: therapist.role,
    description: therapist.bio,
    image: `https://cmhcbd.com${therapist.image.startsWith("/") ? "" : "/"}${therapist.image}`,
    worksFor: {
      "@id": "https://cmhcbd.com/#organization",
    },
    knowsAbout: therapist.expertise || ["Psychotherapy", "Counseling", "Mental Health"],
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
        name: "Therapists",
        item: "https://cmhcbd.com/therapists",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: therapist.name,
        item: `https://cmhcbd.com/therapists/${therapist.id}`,
      },
    ],
  };

  return (
    <main className="pt-24 pb-24 bg-page-bg">
      <JsonLd data={[personJsonLd, breadcrumbJsonLd]} />
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-12 items-start">
          
          {/* Column 1: Portrait (Sticky) */}
          <div className="lg:col-span-4 flex flex-col lg:sticky lg:top-32">
            <div className="relative rounded-4xl overflow-hidden aspect-3/4 w-full">
              <Image
                src={therapist.image}
                alt={therapist.name}
                fill
                sizes="(max-width: 1024px) 100vw, 400px"
                className="object-cover object-top"
                priority
              />
            </div>
          </div>

          {/* Column 2: Bio & Profile Details */}
          <div className="lg:col-span-5 flex flex-col gap-10">
            <div>
              <p className="font-sans text-accent font-medium text-xs mb-2 tracking-widest capitalize">
                {therapist.role}
              </p>
              <h1 className="font-marcellus text-4xl lg:text-5xl text-primary-dark leading-[1.1] mb-6">
                {therapist.name}
              </h1>
              {therapist.expertise && therapist.expertise.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-8">
                  {therapist.expertise.slice(0, 3).map((exp, i) => (
                    <Tag key={i} variant="outline">{exp}</Tag>
                  ))}
                </div>
              )}

              <h2 className="font-marcellus text-2xl text-dark mb-4 tracking-wide mt-8">Biography</h2>
              <p className="font-sans text-[16px] text-light-ash leading-[1.8] w-full">
                {therapist.bio ?? "Detailed biography coming soon."}
              </p>
            </div>

            {/* Experience Stats */}
            {hasExperience && (
              <div className="pt-6 border-t border-muted/20">
                <BulletList items={therapist.experience!} />
              </div>
            )}

            {/* Profile Detail Cards (stacked vertically) */}
            {(hasEducation || hasTraining || hasExpertise) && (
              <div className="flex flex-col gap-6 mt-4">
                {hasEducation && (
                  <SectionCard icon={HiAcademicCap} title="Education">
                    <BulletList items={therapist.education!} />
                  </SectionCard>
                )}
                {hasTraining && (
                  <SectionCard icon={HiSparkles} title="Training">
                    <BulletList items={therapist.training!} />
                  </SectionCard>
                )}
                {hasExpertise && (
                  <SectionCard icon={HiBriefcase} title="Areas of Expertise">
                    <div className="flex flex-wrap gap-2">
                      {therapist.expertise!.map((exp, i) => (
                        <Tag key={i} variant="primary">{exp}</Tag>
                      ))}
                    </div>
                  </SectionCard>
                )}
              </div>
            )}
          </div>

          {/* Column 3: Rates, Fees & Appointment CTA (Sticky) */}
          <div className="lg:col-span-3 flex flex-col gap-8 lg:sticky lg:top-32 bg-primary-dark rounded-3xl p-6 shadow-[0_8px_30px_rgba(3,83,0,0.15)] text-white border border-primary-dark">
            {hasFees ? (
              <>
                <div className="flex items-center gap-3 pb-4 border-b border-white/20">
                  <h2 className="font-marcellus text-xl text-white tracking-wide font-semibold">Fees</h2>
                </div>
                <div className="flex flex-col gap-6">
                  {therapist.fees!.map((feeCategory: { category: string; items: { label: string; amount: string; note?: string }[] }, ci: number) => (
                    <div key={ci} className="flex flex-col">
                      <h3 className="font-sans font-bold text-xs tracking-wider text-white/60 uppercase mb-3">
                        {feeCategory.category}
                      </h3>
                      <div className="flex flex-col gap-3">
                        {feeCategory.items.map((item: { label: string; amount: string; note?: string }, ii: number) => (
                          <div key={ii} className="flex flex-col gap-1">
                            <div className="flex items-start justify-between gap-4">
                              <span className="font-sans text-[13px] font-medium text-white/90">{item.label}</span>
                              <span className="font-marcellus text-[14px] text-accent font-semibold whitespace-nowrap">
                                {item.amount}
                              </span>
                            </div>
                            {item.note && (
                              <span className="font-sans text-[11px] text-white/70 italic">
                                {item.note}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-6 text-white/70">
                Rates and fees info not available.
              </div>
            )}
            
            <BookAppointmentButton therapistId={therapist.id} variant="white" className="w-full justify-center" />
          </div>

        </div>
      </Container>

      {/* Services Section */}
      {therapist.services && therapist.services.length > 0 && (
        <Container className="mb-24 mt-24">
          <SectionHeading
            subtitle="Areas of Expertise"
            title={<>Services Provided by <span className="text-primary-dark">{therapist.name}</span></>}
            className="mb-14"
          />

          <div className="flex flex-wrap justify-center gap-6 lg:gap-6">
            {therapist.services
              .map((s) => SERVICES.find((svc) => svc.slug === s))
              .filter(Boolean)
              .map((service) => (
                <div key={service!.slug} className="w-full md:w-[calc(50%-1.25rem)] lg:w-[calc(33.333%-2rem)] max-w-md">
                  <ServiceCard item={service!} />
                </div>
              ))}
          </div>
        </Container>
      )}

      {/* Therapist Blogs Section */}
      {therapistBlogs.length > 0 && (
        <Container className="mb-24">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-10">
            <SectionHeading
              subtitle="Insights & Articles"
              title={<>Latest Articles by <span className="text-primary-dark">{therapist.name}</span></>}
              align="left"
              className="mb-0"
            />
            <Button href="/blog" variant="primary-dark" className="w-full sm:w-auto">
              View all blogs
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {therapistBlogs.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        </Container>
      )}
    </main>
  );
}
