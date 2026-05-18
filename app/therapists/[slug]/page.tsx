import * as React from "react";
import {
  HiAcademicCap,
  HiArrowSmallRight,
  HiBriefcase,
  HiCheckBadge,
  HiCurrencyDollar,
  HiSparkles,
  HiStar,
} from "react-icons/hi2";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { THERAPISTS_DATA } from "@/features/therapists/data/therapists";
import { SERVICES } from "@/features/services/data/services";
import { BLOG_POSTS } from "@/features/blog/data/blogs";
import { BlogCard } from "@/features/blog/components/blog-card";
import { ServiceCard } from "@/components/shared/service-card";
import { BookAppointmentButton } from "@/components/shared/book-appointment-button";

/* ------------------------------------------------------------------ */
/* Small reusable sub-components                                        */
/* ------------------------------------------------------------------ */

function ProfileTag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 font-sans text-sm font-medium text-primary">
      {children}
    </span>
  );
}

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
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
          <Icon className="w-5 h-5" />
        </div>
        <h3 className="font-marcellus text-xl text-dark">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-col gap-2.5">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2.5">
          <HiCheckBadge className="w-4 h-4 text-primary shrink-0 mt-0.5" />
          <span className="font-sans text-[15px] text-light-ash leading-relaxed">{item}</span>
        </li>
      ))}
    </ul>
  );
}

function ExperienceStat({ label }: { label: string }) {
  // Try to extract a number/metric from the beginning of the label
  const match = label.match(/^(\d[\d+,]*\+?)\s*(.*)/);
  if (match) {
    return (
      <div className="flex flex-col items-center text-center p-5 rounded-2xl bg-primary/5 border border-primary/10">
        <span className="font-marcellus text-3xl text-primary mb-1">{match[1]}</span>
        <span className="font-sans text-sm text-light-ash leading-snug">{match[2]}</span>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-2.5 p-4 rounded-2xl bg-primary/5 border border-primary/10">
      <HiStar className="w-5 h-5 text-primary shrink-0" />
      <span className="font-sans text-[15px] text-dark font-medium leading-snug">{label}</span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                 */
/* ------------------------------------------------------------------ */

export function generateStaticParams() {
  return THERAPISTS_DATA.map((t) => ({ slug: t.id }));
}

export default async function TherapistProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<React.JSX.Element> {
  const { slug } = await params;
  const therapist = THERAPISTS_DATA.find((t) => t.id === slug);

  if (!therapist) {
    notFound();
  }

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

  return (
    <main className="pt-24 pb-24">
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <Container>
        <div className="flex flex-col lg:flex-row items-start gap-y-12 gap-x-12 xl:gap-x-20">
          {/* Left: Content */}
          <div className="flex flex-col flex-1 w-full">
            <p className="font-sans text-accent font-medium text-sm mb-3 tracking-widest uppercase">
              {therapist.role}
            </p>

            <h1 className="font-marcellus text-4xl lg:text-[48px] text-dark leading-[1.15] mb-6">
              {therapist.name}
            </h1>

            {therapist.expertise && therapist.expertise.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {therapist.expertise.slice(0, 3).map((exp, i) => (
                  <ProfileTag key={i}>{exp}</ProfileTag>
                ))}
              </div>
            )}

            <p className="font-sans text-[16px] text-light-ash leading-[1.8] max-w-[600px] mb-10">
              {therapist.bio ?? "Detailed biography coming soon."}
            </p>

            {/* Experience Stats */}
            {hasExperience && (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 mb-10">
                {therapist.experience!.map((exp, i) => (
                  <ExperienceStat key={i} label={exp} />
                ))}
              </div>
            )}

            <div className="self-start">
              <BookAppointmentButton therapistId={therapist.id} />
            </div>
          </div>

          {/* Right: Image */}
          <div className="shrink-0 w-full lg:w-[430px]">
            <div className="relative rounded-3xl overflow-hidden aspect-3/4 lg:h-[600px] lg:w-[430px] bg-gray-100 shadow-sm">
              <Image
                src={therapist.image}
                alt={therapist.name}
                fill
                sizes="(max-width: 1024px) 100vw, 430px"
                className="object-cover object-top"
                priority
              />
            </div>
          </div>
        </div>

        {/* ── Profile Detail Cards ──────────────────────────────────── */}
        {(hasEducation || hasTraining || hasExpertise) && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-16">
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
                <BulletList items={therapist.expertise!} />
              </SectionCard>
            )}
          </div>
        )}

        {/* ── Rates & Fees ──────────────────────────────────────────── */}
        {hasFees && (
          <div className="mt-16">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <HiCurrencyDollar className="w-5 h-5" />
              </div>
              <h2 className="font-marcellus text-2xl text-dark">Rates &amp; Fees</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {therapist.fees!.map((feeCategory, ci) => (
                <div
                  key={ci}
                  className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
                >
                  <h3 className="font-marcellus text-lg text-dark mb-4 pb-3 border-b border-gray-100">
                    {feeCategory.category}
                  </h3>
                  <div className="flex flex-col gap-3">
                    {feeCategory.items.map((item, ii) => (
                      <div key={ii} className="flex items-start justify-between gap-6">
                        <div className="flex flex-col">
                          <span className="font-sans text-[14px] text-light-ash">{item.label}</span>
                          {item.note && (
                            <span className="font-sans text-[12px] text-light-ash/70 italic mt-0.5">
                              {item.note}
                            </span>
                          )}
                        </div>
                        <span className="font-marcellus text-[15px] text-primary font-semibold whitespace-nowrap">
                          {item.amount}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex justify-center">
              <BookAppointmentButton therapistId={therapist.id} />
            </div>
          </div>
        )}
      </Container>

      {/* ── Services Section ─────────────────────────────────────────── */}
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

      {/* ── Therapist Blogs Section ──────────────────────────────────── */}
      {therapistBlogs.length > 0 && (
        <Container className="mb-24">
          <div className="flex items-end justify-between mb-10">
            <SectionHeading
              subtitle="Insights & Articles"
              title={<>Latest Articles by <span className="text-primary-dark">{therapist.name}</span></>}
              align="left"
              className="mb-0"
            />
            <Link
              href="/blog"
              className="font-sans text-primary font-semibold hover:underline flex items-center gap-2 mb-2"
            >
              View all blogs <HiArrowSmallRight className="w-4 h-4" />
            </Link>
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
