import * as React from "react";
import { HiAcademicCap, HiClock, HiTrophy } from "react-icons/hi2";
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

function EducationIcon({ className = "" }: { className?: string }): React.JSX.Element {
  return <HiAcademicCap className={className} />;
}

function AwardIcon({ className = "" }: { className?: string }): React.JSX.Element {
  return <HiTrophy className={className} />;
}

function ClockIcon({ className = "" }: { className?: string }): React.JSX.Element {
  return <HiClock className={className} />;
}

function TherapistDetailItem({ 
  title, 
  description, 
  icon: Icon 
}: { 
  title: string; 
  description: string;
  icon: React.ElementType;
}): React.JSX.Element {
  return (
    <div className="flex gap-4 items-center">
      <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
        <Icon className="w-6 h-6" />
      </div>
      <div className="flex flex-col">
        <h4 className="font-marcellus text-lg text-dark">
          {title}
        </h4>
        <p className="font-sans text-[15px] text-light-ash leading-relaxed max-w-lg">
          {description}
        </p>
      </div>
    </div>
  );
}

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

  const therapistBlogs = BLOG_POSTS.filter(post => 
    post.author.toLowerCase().includes(therapist.name.toLowerCase()) ||
    therapist.name.toLowerCase().includes(post.author.toLowerCase())
  );

  return (
    <main className="pt-24 pb-24">
      <Container>
        <div className="flex flex-col lg:flex-row items-center gap-y-12 gap-x-5">
          {/* Left: Content */}
          <div className="flex flex-col flex-1 w-full lg:pr-10 xl:pr-16">
            <p className="font-sans text-accent font-medium text-base mb-3 tracking-wide uppercase">
              {therapist.role}
            </p>

            <h1 className="font-marcellus text-4xl lg:text-[42px] text-dark leading-[1.2] mb-8">
              {therapist.name}
            </h1>

            <p className="font-sans text-base text-light-ash leading-relaxed max-w-[568px] mb-10">
              {therapist.bio || "Detailed biography coming soon."}
            </p>

            <div className="flex flex-col gap-8 mb-12">
              <TherapistDetailItem
                icon={EducationIcon}
                title="Education"
                description="MBBS from Dhaka Medical College, followed by specialized fellowship and FCPS in Psychiatry."
              />
              <TherapistDetailItem
                icon={AwardIcon}
                title="Training"
                description="Advanced certification in Cognitive Behavioral Therapy (CBT) and Trauma-Informed Care."
              />
              <TherapistDetailItem
                icon={ClockIcon}
                title="Service Hours"
                description="Available for appointments Sunday to Thursday from 10:00 AM to 6:00 PM."
              />
            </div>

            <div className="self-start">
              <BookAppointmentButton therapistId={therapist.id} />
            </div>
          </div>

          {/* Right: Image */}
          <div className="shrink-0 w-full lg:w-[470px]">
            <div className="relative rounded-3xl overflow-hidden aspect-3/4 lg:h-[664px] lg:w-[470px] bg-gray-100 shadow-sm">
              <Image
                src={therapist.image}
                alt={therapist.name}
                fill
                sizes="(max-width: 1024px) 100vw, 470px"
                className="object-cover object-top"
                priority
              />
            </div>
          </div>
        </div>
      </Container>

      {/* Services Section */}
      {therapist.services && therapist.services.length > 0 && (
        <Container className="mb-24 mt-40">
          <SectionHeading 
            subtitle="Areas of Expertise"
            title={<>Services Provided by <span className="text-primary-dark">{therapist.name}</span></>}
            className="mb-14"
          />

          <div className="flex flex-wrap justify-center gap-5 lg:gap-8">
            {therapist.services
              .map(slug => SERVICES.find(s => s.slug === slug))
              .filter(Boolean)
              .map((service) => (
                <div key={service!.slug} className="w-full md:w-[calc(50%-1.25rem)] lg:w-[calc(33.333%-2rem)] max-w-md">
                  <ServiceCard item={service!} />
                </div>
              ))
            }
          </div>
        </Container>
      )}

      {/* Therapist Blogs Section */}
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {therapistBlogs.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        </Container>
      )}
    </main>
  );
}
