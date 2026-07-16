import * as React from "react";
import { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { TrainingRegistrationForm } from "@/features/training/components/training-registration-form";
import prisma from "@/lib/prisma";
import { HiUserGroup, HiBookOpen, HiSparkles } from "react-icons/hi2";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Register for Training | CMHCB",
  description: "Register for professional mental health training programs at the Center for Mental Health and Care, Bangladesh.",
};

interface JoinTrainingPageProps {
  searchParams: Promise<{ training?: string }>;
}

export default async function JoinTrainingPage({
  searchParams,
}: JoinTrainingPageProps): Promise<React.JSX.Element> {
  const resolvedParams = await searchParams;
  const initialTrainingSlug = resolvedParams.training;

  const trainings = await prisma.training.findMany({
    orderBy: { order: "asc" },
    select: {
      slug: true,
      title: true,
    },
  });

  return (
    <main className="flex-1 bg-page-bg py-16 lg:py-24">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-start">
          {/* Left Side: Upcoming Batch Information */}
          <div className="lg:col-span-5 lg:sticky lg:top-32">
            <SectionHeading
              level="h1"
              subtitle="Get Started"
              title="Join Training Batch"
              align="left"
              className="mb-6"
            />
            <p className="font-sans text-lg text-light-ash leading-relaxed max-w-lg mb-10">
              Take the next step in your professional development or advocacy journey. Register for one of our specialised training cohorts.
            </p>

            <div className="space-y-6">
              <div className="flex gap-6 items-center">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <HiUserGroup className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-marcellus text-lg text-dark">Expert Facilitators</h4>
                  <p className="font-sans text-sm text-light-ash">
                    Learn from qualified psychiatrists, psychologists, and facilitators.
                  </p>
                </div>
              </div>

              <div className="flex gap-6 items-center">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <HiBookOpen className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-marcellus text-lg text-dark">Interactive Curriculum</h4>
                  <p className="font-sans text-sm text-light-ash">
                    Practical training with real-world case discussions and worksheets.
                  </p>
                </div>
              </div>

              <div className="flex gap-6 items-center">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 text-primary">
                  <HiSparkles className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-marcellus text-lg text-dark">Official Certification</h4>
                  <p className="font-sans text-sm text-light-ash">
                    Receive a certificate of participation awarded by CMHCB.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Form */}
          <div className="lg:col-span-7">
            <TrainingRegistrationForm
              trainings={trainings}
              initialTrainingSlug={initialTrainingSlug}
            />
          </div>
        </div>
      </Container>
    </main>
  );
}
