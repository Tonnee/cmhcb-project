import * as React from "react";
import type { Metadata } from "next";
import prisma from "@/lib/prisma";
import EditLandingPageForm from "@/features/admin/components/edit-landing-page-form";
import { DEFAULT_FOOTER_SOCIALS, CONTACT_INFO } from "@/data/footer";

export const metadata: Metadata = {
  title: "Customize Landing Page | Admin Portal | CMHCB",
  description: "Dynamic landing page settings, statistics counters, and background image customizations.",
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminLandingPage(): Promise<React.JSX.Element> {
  // Query dynamic database content
  const landingContent = await prisma.landingPageContent.findFirst();

  // Fallbacks if database not seeded
  const defaultContent = {
    id: "landing-content",
    heroHeadline: "Empowering Your <span class=\"text-accent\">Mind</span>, Transforming Your <span class=\"text-primary\">Life</span>",
    heroSubtitle: "At CMHC,B, we believe every individual deserves a supportive space to heal, grow, and thrive. Connect with the right therapist, right when you need it.",
    heroBgImage: "/hero-image/hero-bg.png",
    heroFigureImage: "/hero-image/hero-figure.png",
    aboutStatement: "We connect licensed therapists [therapist], mental health programs [brain], and personalized care [heart] services, ensuring clients [client] receive the support they need to thrive [chart] wherever they feel safe.",
    aboutTherapistImage: "/home-about-image/licensed-mental-health-therapist.png",
    aboutClientImage: "/home-about-image/mental-health-therapy-client.png",
    aboutBrainIcon: "/home-about-image/mental-health-brain-icon.png",
    aboutHeartIcon: "/home-about-image/personalized-care-heart-icon.png",
    aboutChartIcon: "/home-about-image/mental-health-progress-chart-icon.png",
    wellbeingHeadline: "Our Commitment to Your <span class=\"text-accent\">Well-Being</span>",
    wellbeingSubtitle: "At CMHC,B, we are committed to delivering compassionate and effective mental health care. Explore how we've supported individuals on their path to emotional well-being and resilience.",
    wellbeingImage: null,
    experienceCount: 20,
    stat1Suffix: "+",
    stat1Title: "Years of Experience",
    stat1Description: "Helping individuals navigate life's",
    happyClientsCount: 1500,
    stat2Suffix: "+",
    stat2Title: "Happy Clients",
    stat2Description: "Empowered through counseling and therapy",
    sessionsCount: 2800,
    stat3Suffix: "+",
    stat3Title: "Sessions Conducted",
    stat3Description: "Providing guidance and support every day",
    satisfactionRate: 94,
    stat4Suffix: "%",
    stat4Title: "Satisfaction Positive",
    stat4Description: "outcomes and improved well-being",
    trainingHeadline: "Want to Make a <span class=\"text-primary-dark\">Difference</span> in <span class=\"text-accent\">Mental Health</span>?",
    trainingSubtitle: "Our specialized trainings equip professionals, educators, and caregivers with the tools needed to foster mental well-being in their communities.",
    trainingImage: "/mental-health-training-program.png",
    trainingItem1Title: "Basic Counseling Skills Training",
    trainingItem1Description: "Learn foundational techniques for effective, empathetic, and ethical communication in mental health settings.",
    trainingItem2Title: "Child & Adolescent Mental Health",
    trainingItem2Description: "Understand psychological development, behavior management, and therapeutic strategies for young individuals.",
    trainingItem3Title: "Trauma-Informed Care",
    trainingItem3Description: "Equip yourself with the knowledge and tools to support individuals dealing with trauma and PTSD.",
    trainingItem4Title: "",
    trainingItem4Description: "",
    appointmentHeadline: "Take The Next Step - Schedule Your <span class=\"text-white\">Appointment</span>",
    appointmentSubtitle: "Your path to healing, growth, and inner peace starts with a single step. Whether you are navigating life's transitions, seeking emotional support, or striving for balance, our compassionate professionals are here to walk with you in a safe, supportive space.",
    appointmentButtonText: "Book an Appointment",
    appointmentButtonLink: "/appointment",
    eventsBottomText: "Stay informed and engaged with CMHC,B's year-round programs, workshops, and awareness events. Our annual event calendar highlights key training sessions, mental health awareness days, and community initiatives designed to educate, support, and empower individuals across all age groups.",
    eventsButtonText: "Explore all Events & Workshops",
    eventsButtonLink: "/events-workshops",
    reviewCard1Title: "Real Experiences, Real Impact",
    reviewCard1Description: "Discover how our clients' lives have changed through therapy, training, and mental health support at CMHC,B.",
    reviewCard2Title: "Voices That Inspire Hope",
    reviewCard2Description: "Our clients share their journeys of transformation—honest reflections on the care and support they received at CMHC,B.",
    reviewPhoto1Image: "/home-review/bangladeshi-woman-mental-health-therapy-client.png",
    reviewPhoto1Alt: "Happy Bangladeshi woman sharing her positive therapy experience and emotional recovery at CMHCB",
    reviewPhoto2Image: "/home-review/bangladeshi-man-mental-health-therapy-client.png",
    reviewPhoto2Alt: "Confident Bangladeshi male client reflecting on successful mental health counseling sessions at CMHCB",
    footerSocials: JSON.stringify(DEFAULT_FOOTER_SOCIALS),
    footerPhone: CONTACT_INFO.phone,
    footerEmail: CONTACT_INFO.email,
    footerAddressLine1: CONTACT_INFO.address[0] || "",
    footerAddressLine2: CONTACT_INFO.address[1] || "",
    footerAddressLine3: CONTACT_INFO.address[2] || "",
  };

  const content = {
    ...defaultContent,
    ...(landingContent || {}),
    aboutStatement: landingContent?.aboutStatement ?? defaultContent.aboutStatement,
    aboutTherapistImage: landingContent?.aboutTherapistImage ?? defaultContent.aboutTherapistImage,
    aboutClientImage: landingContent?.aboutClientImage ?? defaultContent.aboutClientImage,
    aboutBrainIcon: landingContent?.aboutBrainIcon ?? defaultContent.aboutBrainIcon,
    aboutHeartIcon: landingContent?.aboutHeartIcon ?? defaultContent.aboutHeartIcon,
    aboutChartIcon: landingContent?.aboutChartIcon ?? defaultContent.aboutChartIcon,
    wellbeingImage: landingContent?.wellbeingImage ?? defaultContent.wellbeingImage,
    stat1Suffix: landingContent?.stat1Suffix ?? defaultContent.stat1Suffix,
    stat1Title: landingContent?.stat1Title ?? defaultContent.stat1Title,
    stat1Description: landingContent?.stat1Description ?? defaultContent.stat1Description,
    stat2Suffix: landingContent?.stat2Suffix ?? defaultContent.stat2Suffix,
    stat2Title: landingContent?.stat2Title ?? defaultContent.stat2Title,
    stat2Description: landingContent?.stat2Description ?? defaultContent.stat2Description,
    stat3Suffix: landingContent?.stat3Suffix ?? defaultContent.stat3Suffix,
    stat3Title: landingContent?.stat3Title ?? defaultContent.stat3Title,
    stat3Description: landingContent?.stat3Description ?? defaultContent.stat3Description,
    stat4Suffix: landingContent?.stat4Suffix ?? defaultContent.stat4Suffix,
    stat4Title: landingContent?.stat4Title ?? defaultContent.stat4Title,
    stat4Description: landingContent?.stat4Description ?? defaultContent.stat4Description,
    trainingItem1Title: landingContent?.trainingItem1Title ?? defaultContent.trainingItem1Title,
    trainingItem1Description: landingContent?.trainingItem1Description ?? defaultContent.trainingItem1Description,
    trainingItem2Title: landingContent?.trainingItem2Title ?? defaultContent.trainingItem2Title,
    trainingItem2Description: landingContent?.trainingItem2Description ?? defaultContent.trainingItem2Description,
    trainingItem3Title: landingContent?.trainingItem3Title ?? defaultContent.trainingItem3Title,
    trainingItem3Description: landingContent?.trainingItem3Description ?? defaultContent.trainingItem3Description,
    trainingItem4Title: landingContent?.trainingItem4Title ?? defaultContent.trainingItem4Title,
    trainingItem4Description: landingContent?.trainingItem4Description ?? defaultContent.trainingItem4Description,
    appointmentHeadline: landingContent?.appointmentHeadline ?? defaultContent.appointmentHeadline,
    appointmentSubtitle: landingContent?.appointmentSubtitle ?? defaultContent.appointmentSubtitle,
    appointmentButtonText: landingContent?.appointmentButtonText ?? defaultContent.appointmentButtonText,
    appointmentButtonLink: landingContent?.appointmentButtonLink ?? defaultContent.appointmentButtonLink,
    eventsBottomText: landingContent?.eventsBottomText ?? defaultContent.eventsBottomText,
    eventsButtonText: landingContent?.eventsButtonText ?? defaultContent.eventsButtonText,
    eventsButtonLink: landingContent?.eventsButtonLink ?? defaultContent.eventsButtonLink,
    reviewCard1Title: landingContent?.reviewCard1Title ?? defaultContent.reviewCard1Title,
    reviewCard1Description: landingContent?.reviewCard1Description ?? defaultContent.reviewCard1Description,
    reviewCard2Title: landingContent?.reviewCard2Title ?? defaultContent.reviewCard2Title,
    reviewCard2Description: landingContent?.reviewCard2Description ?? defaultContent.reviewCard2Description,
    reviewPhoto1Image: landingContent?.reviewPhoto1Image ?? defaultContent.reviewPhoto1Image,
    reviewPhoto1Alt: landingContent?.reviewPhoto1Alt ?? defaultContent.reviewPhoto1Alt,
    reviewPhoto2Image: landingContent?.reviewPhoto2Image ?? defaultContent.reviewPhoto2Image,
    reviewPhoto2Alt: landingContent?.reviewPhoto2Alt ?? defaultContent.reviewPhoto2Alt,
    footerPhone: landingContent?.footerPhone || defaultContent.footerPhone,
    footerEmail: landingContent?.footerEmail || defaultContent.footerEmail,
    footerAddressLine1: landingContent?.footerAddressLine1 ?? defaultContent.footerAddressLine1,
    footerAddressLine2: landingContent?.footerAddressLine2 ?? defaultContent.footerAddressLine2,
    footerAddressLine3: landingContent?.footerAddressLine3 ?? defaultContent.footerAddressLine3,
    footerSocials: landingContent?.footerSocials || defaultContent.footerSocials,
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Welcome header */}
      <div className="flex flex-col gap-1">
        <h1 className="font-marcellus text-3xl font-bold text-dark-green">
          Customize Landing Page
        </h1>
        <p className="font-sans text-sm text-light-ash">
          Manage layout headings, paragraph summaries, background banners, and statistics values.
        </p>
      </div>

      <EditLandingPageForm initialContent={content} />
    </div>
  );
}
