import * as React from "react";
import { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { TrainingRegistrationForm } from "@/features/training/components/training-registration-form";
import prisma from "@/lib/prisma";
import { getRequiredAdminSession } from "@/app/(admin)/admin/admin-management";
import { PhoneIcon } from "@/components/layout/footer-icons";
import {
  HiUserGroup,
  HiBookOpen,
  HiSparkles,
  HiAcademicCap,
  HiShieldCheck,
  HiClock,
  HiHeart,
} from "react-icons/hi2";

import { TRAININGS } from "@/features/training/data/trainings";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Register for Training | CMHCB",
  description: "Register for professional mental health training programs at the Center for Mental Health and Care, Bangladesh.",
};

interface JoinTrainingPageProps {
  searchParams: Promise<{ training?: string }>;
}

function TrainingFeatureIcon({ iconName }: { iconName?: string }) {
  switch (iconName) {
    case "HiBookOpen":
    case "book":
      return <HiBookOpen className="w-6 h-6 text-primary" />;
    case "HiSparkles":
    case "sparkles":
      return <HiSparkles className="w-6 h-6 text-primary" />;
    case "HiAcademicCap":
    case "academic":
      return <HiAcademicCap className="w-6 h-6 text-primary" />;
    case "HiShieldCheck":
    case "shield":
      return <HiShieldCheck className="w-6 h-6 text-primary" />;
    case "HiClock":
    case "clock":
      return <HiClock className="w-6 h-6 text-primary" />;
    case "HiHeart":
    case "heart":
      return <HiHeart className="w-6 h-6 text-primary" />;
    case "PhoneIcon":
    case "phone":
      return <PhoneIcon className="w-6 h-6 text-primary" />;
    case "HiUserGroup":
    case "user-group":
    default:
      return <HiUserGroup className="w-6 h-6 text-primary" />;
  }
}

export default async function JoinTrainingPage({
  searchParams,
}: JoinTrainingPageProps): Promise<React.JSX.Element> {
  const resolvedParams = await searchParams;
  const initialTrainingSlug = resolvedParams.training;

  let isAdmin = false;
  try {
    await getRequiredAdminSession();
    isAdmin = true;
  } catch {
    isAdmin = false;
  }

  const dbContent = await (prisma as any).joinTrainingPageContent.findFirst().catch(() => null);

  const subtitle = dbContent?.subtitle || "Get Started";
  const title = dbContent?.title || "Join Training Batch";
  const description =
    dbContent?.description ||
    "Take the next step in your professional development or advocacy journey. Register for one of our specialised training cohorts.";

  let features: Array<{ title: string; description: string; iconName?: string }> = [
    {
      title: "Expert Facilitators",
      description: "Learn from qualified psychiatrists, psychologists, and facilitators.",
      iconName: "HiUserGroup",
    },
    {
      title: "Interactive Curriculum",
      description: "Practical training with real-world case discussions and worksheets.",
      iconName: "HiBookOpen",
    },
    {
      title: "Official Certification",
      description: "Receive a certificate of participation awarded by CMHCB.",
      iconName: "HiSparkles",
    },
  ];

  if (dbContent?.features) {
    try {
      const parsed = JSON.parse(dbContent.features);
      if (Array.isArray(parsed) && parsed.length > 0) {
        features = parsed;
      }
    } catch (e) {
      console.error("Error parsing join training page features:", e);
    }
  }

  let trainings: { slug: string; title: string }[] = [];
  try {
    const dbTrainings = await prisma.training.findMany({
      orderBy: { order: "asc" },
      select: {
        slug: true,
        title: true,
      },
    });
    if (dbTrainings.length > 0) {
      trainings = dbTrainings;
    }
  } catch (error) {
    console.error("Error fetching trainings in join-training page:", error);
  }

  if (trainings.length === 0) {
    trainings = TRAININGS.map((t) => ({ slug: t.slug, title: t.title }));
  }

  return (
    <main className="flex-1 bg-page-bg py-16 lg:py-24">
      <Container>
        {isAdmin && (
          <div className="mb-8 p-3.5 bg-primary/10 border border-primary/20 rounded-xl flex items-center justify-between text-xs text-primary-dark font-sans">
            <span className="font-medium">
              Administrator Quick Access: You can edit this page&apos;s title, description, and benefit pillars in the Admin Panel.
            </span>
            <a
              href="/admin/training-requests"
              className="font-bold underline hover:text-primary transition-colors cursor-pointer"
            >
              Edit Join Training Page Content &rarr;
            </a>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-start">
          {/* Left Side: Upcoming Batch Information */}
          <div className="lg:col-span-5 lg:sticky lg:top-32">
            <SectionHeading
              level="h1"
              subtitle={subtitle}
              title={title}
              align="left"
              className="mb-6"
            />
            <p className="font-sans text-lg text-light-ash leading-relaxed max-w-lg mb-10">
              {description}
            </p>

            <div className="space-y-6">
              {features.map((feature, idx) => (
                <div key={idx} className="flex gap-6 items-center">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <TrainingFeatureIcon iconName={feature.iconName} />
                  </div>
                  <div>
                    <h4 className="font-marcellus text-lg text-dark">{feature.title}</h4>
                    <p className="font-sans text-sm text-light-ash">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
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

