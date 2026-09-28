import { Metadata } from "next";
import prisma from "@/lib/prisma";
import { getRequiredAdminSession } from "@/app/(admin)/admin/admin-management";
import { safeJsonParse } from "@/lib/json";
import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { AppointmentForm } from "@/features/appointment/components/appointment-form";
import { PhoneIcon } from "@/components/layout/footer-icons";
import {
  HiUserGroup,
  HiClock,
  HiShieldCheck,
  HiHeart,
  HiSparkles,
  HiAcademicCap,
} from "react-icons/hi2";

export const metadata: Metadata = {
  title: "Book an Appointment | CMHCB",
  description: "Take the first step toward better mental well-being. Book an appointment with our expert therapists at the Center for Mental Health and Care, Bangladesh.",
};

export const dynamic = "force-dynamic";

function FeatureIcon({ iconName }: { iconName?: string }) {
  switch (iconName) {
    case "HiClock":
    case "clock":
      return <HiClock className="w-6 h-6 text-primary" />;
    case "PhoneIcon":
    case "phone":
    case "HiPhone":
      return <PhoneIcon className="w-6 h-6" />;
    case "HiShieldCheck":
    case "shield":
      return <HiShieldCheck className="w-6 h-6 text-primary" />;
    case "HiHeart":
    case "heart":
      return <HiHeart className="w-6 h-6 text-primary" />;
    case "HiSparkles":
    case "sparkles":
      return <HiSparkles className="w-6 h-6 text-primary" />;
    case "HiAcademicCap":
    case "academic":
      return <HiAcademicCap className="w-6 h-6 text-primary" />;
    case "HiUserGroup":
    case "user-group":
    default:
      return <HiUserGroup className="w-6 h-6 text-primary" />;
  }
}

export default async function AppointmentPage() {
  let isAdmin = false;
  try {
    await getRequiredAdminSession();
    isAdmin = true;
  } catch {
    isAdmin = false;
  }

  const dbContent = await (prisma as any).appointmentPageContent.findFirst().catch(() => null);

  const subtitle = dbContent?.subtitle || "Get Started";
  const title = dbContent?.title || "Book an Appointment";
  const description =
    dbContent?.description ||
    "Take the first step toward better mental well-being. Choose your preferred therapist, service, and time. Our team is here to support you every step of the way.";

  let features: Array<{ title: string; description: string; iconName?: string }> = [
    {
      title: "Expert Care",
      description: "Connect with highly qualified mental health professionals.",
      iconName: "HiUserGroup",
    },
    {
      title: "Flexible Timing",
      description: "Choose a time that works best for your schedule.",
      iconName: "HiClock",
    },
    {
      title: "Private & Confidential",
      description: "Your sessions are held in strict professional confidence.",
      iconName: "PhoneIcon",
    },
  ];

  if (dbContent?.features) {
    try {
      const parsed = JSON.parse(dbContent.features);
      if (Array.isArray(parsed) && parsed.length > 0) {
        features = parsed;
      }
    } catch {
      // fallback to defaults
    }
  }

  const formFields = dbContent?.formFields
    ? safeJsonParse<import("@/types/form-fields").FormFieldConfig[] | null>(dbContent.formFields, null)
    : null;

  return (
    <main className="flex-1 bg-page-bg py-16 lg:py-24">
      {isAdmin && (
        <div className="bg-primary/10 border-b border-primary/20 py-3 text-center text-sm mb-8 -mt-8">
          <Container className="flex items-center justify-between">
            <span className="font-medium text-primary-dark font-sans text-xs sm:text-sm">
              You are logged in as an Administrator.
            </span>
            <a
              href="/admin/appointments"
              className="px-4 py-1.5 bg-primary-dark hover:bg-primary-dark/90 text-white rounded-lg font-semibold transition-all text-xs font-sans"
            >
              Edit Page Content & Form Fields
            </a>
          </Container>
        </div>
      )}

      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-6 items-start">
          {/* Left Side: Content */}
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
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 text-primary">
                    <FeatureIcon iconName={feature.iconName} />
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
            <AppointmentForm formFields={formFields} />
          </div>
        </div>
      </Container>
    </main>
  );
}
