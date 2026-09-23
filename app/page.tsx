import * as React from "react";
import prisma from "@/lib/prisma";
import { Hero } from "@/features/home/components/hero";
import About from "@/features/home/components/about";
import Guide from "@/features/home/components/guide";
import Services from "@/features/home/components/services";
import WellBeing from "@/features/home/components/well-being";
import Training from "@/features/home/components/training";
import Therapists from "@/features/home/components/therapists";
import { UpcomingEvents } from "@/features/home/components/upcoming-events";
import { ScheduleAppointment } from "@/features/home/components/schedule-appointment";
import { Review } from "@/features/home/components/review";
import { getRequiredAdminSession } from "@/app/(admin)/admin/admin-management";
import { Container } from "@/components/layout/container";
import { JsonLd } from "@/components/shared/json-ld";

// Force dynamic page rendering so queries run on every request
export const revalidate = 60;

export default async function Page(): Promise<React.JSX.Element> {
  let isAdmin = false;
  try {
    await getRequiredAdminSession();
    isAdmin = true;
  } catch {
    isAdmin = false;
  }

  let landingContent = null;
  let dbTestimonials: any[] = [];
  let dbFeaturedWorkshops: any[] = [];
  let dbServices: any[] = [];
  let dbTherapists: any[] = [];
  let latestWorkshop = null;

  try {
    const res = await Promise.all([
      prisma.landingPageContent.findFirst(),
      prisma.testimonial.findMany({
        where: { isFeatured: true },
        orderBy: [{ order: "asc" } as any, { createdAt: "desc" }],
        take: 10,
      }),
      prisma.workshop.findMany({
        where: { isFeatured: true },
        orderBy: [{ isLatest: "desc" }, { isFeatured: "desc" }, { order: "asc" } as any, { createdAt: "desc" }],
        take: 4,
      }),
      prisma.service.findMany({
        where: { isFeatured: true },
        orderBy: { order: "asc" } as any,
        take: 6,
      }),
      prisma.workshop.findFirst({
        where: { isLatest: true },
      }),
    ]);
    landingContent = res[0];
    dbTestimonials = res[1] || [];
    dbFeaturedWorkshops = res[2] || [];
    dbServices = res[3] || [];
    latestWorkshop = res[4];
  } catch (err) {
    console.error("Error fetching homepage database content:", err);
  }

  try {
    dbTherapists = await prisma.therapist.findMany({
      orderBy: [{ order: "asc" } as any, { createdAt: "asc" }],
    });
  } catch {
    dbTherapists = await prisma.therapist.findMany().catch(() => []);
  }

  const defaultContent = {
    heroHeadline: "Empowering Your <span class=\"text-accent\">Mind</span>, Transforming Your <span class=\"text-primary\">Life</span>",
    heroSubtitle: "At CMHC,B, we believe every individual deserves a supportive space to heal, grow, and thrive. Connect with the right therapist, right when you need it.",
    heroBgImage: "/hero-image/hero-bg.png",
    heroFigureImage: "/hero-image/hero-figure.png",
    wellbeingHeadline: "Our Commitment to Your <span class=\"text-accent\">Well-Being</span>",
    wellbeingSubtitle: "At CMHC,B, we are committed to delivering compassionate and effective mental health care. Explore how we've supported individuals on their path to emotional well-being and resilience.",
    wellbeingImage: null,
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
    reviewCard1Title: "Real Experiences, Real Impact",
    reviewCard1Description: "Discover how our clients' lives have changed through therapy, training, and mental health support at CMHC,B.",
    reviewCard2Title: "Voices That Inspire Hope",
    reviewCard2Description: "Our clients share their journeys of transformation—honest reflections on the care and support they received at CMHC,B.",
    reviewPhoto1Image: "/home-review/bangladeshi-woman-mental-health-therapy-client.png",
    reviewPhoto1Alt: "Happy Bangladeshi woman sharing her positive therapy experience and emotional recovery at CMHCB",
    reviewPhoto2Image: "/home-review/bangladeshi-man-mental-health-therapy-client.png",
    reviewPhoto2Alt: "Confident Bangladeshi male client reflecting on successful mental health counseling sessions at CMHCB",
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
  };
  const content = {
    ...defaultContent,
    ...(landingContent || {}),
  };

  const statsData = [
    {
      id: "experience",
      value: content.experienceCount,
      suffix: content.stat1Suffix || "+",
      title: content.stat1Title || "Years of Experience",
      description: content.stat1Description || "Helping individuals navigate life's",
    },
    {
      id: "clients",
      value: content.happyClientsCount,
      suffix: content.stat2Suffix || "+",
      title: content.stat2Title || "Happy Clients",
      description: content.stat2Description || "Empowered through counseling and therapy",
    },
    {
      id: "sessions",
      value: content.sessionsCount,
      suffix: content.stat3Suffix || "+",
      title: content.stat3Title || "Sessions Conducted",
      description: content.stat3Description || "Providing guidance and support every day",
    },
    {
      id: "satisfaction",
      value: content.satisfactionRate,
      suffix: content.stat4Suffix || "%",
      title: content.stat4Title || "Satisfaction Positive",
      description: content.stat4Description || "outcomes and improved well-being",
    },
  ];

  const trainingItems = [
    {
      title: content.trainingItem1Title || "Basic Counseling Skills Training",
      description: content.trainingItem1Description || "Learn foundational techniques for effective, empathetic, and ethical communication in mental health settings.",
    },
    {
      title: content.trainingItem2Title || "Child & Adolescent Mental Health",
      description: content.trainingItem2Description || "Understand psychological development, behavior management, and therapeutic strategies for young individuals.",
    },
    {
      title: content.trainingItem3Title || "Trauma-Informed Care",
      description: content.trainingItem3Description || "Equip yourself with the knowledge and tools to support individuals dealing with trauma and PTSD.",
    },
    ...(content.trainingItem4Title && content.trainingItem4Description ? [{
      title: content.trainingItem4Title,
      description: content.trainingItem4Description,
    }] : []),
  ];

  // 2. Testimonials list fallback
  const fallbackTestimonials = [
    {
      id: "fallback-1",
      name: "John Doe",
      role: "HR Manager",
      avatar: "/home-review/mental-health-therapy-client-woman.png",
      quote: "CMHC,B gave me a safe space to express myself without judgment. My therapist truly understood what I was going through.",
    },
    {
      id: "fallback-2",
      name: "Jane Smith",
      role: "Teacher",
      avatar: "/home-review/mental-health-therapy-client-man.png",
      quote: "The training programs at CMHC,B transformed my understanding of mental health. Highly recommended.",
    },
  ];
  const testimonials = dbTestimonials.length > 0 ? dbTestimonials : fallbackTestimonials;

  // 3. Workshops list for Upcoming Events (4 featured cards)
  let gridWorkshops = dbFeaturedWorkshops;
  if (gridWorkshops.length === 0) {
    // If no workshops marked as isFeatured, query upcoming ones as fallback
    gridWorkshops = await prisma.workshop.findMany({
      orderBy: { date: "asc" },
      take: 4,
    });
  }

  // Featured hero event above the 4 cards
  let featuredWorkshop = latestWorkshop;
  if (!featuredWorkshop) {
    featuredWorkshop = gridWorkshops.length > 0 ? gridWorkshops[0] : (await prisma.workshop.findFirst({ orderBy: { date: "asc" } }));
  }

  // 4. Services list fallback
  const fallbackServices = [
    {
      title: "Psychometric Assessment",
      slug: "psychometric-assessment",
      shortDescription: "understand personality, emotional functioning, and mental health needs",
    },
    {
      title: "Individual Therapy",
      slug: "individual-therapy",
      shortDescription: "one-on-one therapy sessions providing a safe, confidential space",
    },
    {
      title: "Child Therapy",
      slug: "child-therapy",
      shortDescription: "Specialized, child-centered therapeutic techniques help children navigate emotional challenges",
    },
  ];
  const featuredServices = dbServices.length > 0 ? dbServices : fallbackServices;

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://cmhcbd.com/#website",
    url: "https://cmhcbd.com",
    name: "Center for Mental Health and Care, Bangladesh",
    description: "Leading mental health organization providing therapy, counseling, and training services in Bangladesh.",
    publisher: {
      "@id": "https://cmhcbd.com/#organization",
    },
  };

  return (
    <main>
      <JsonLd data={websiteJsonLd} />
      {isAdmin && (
        <div className="bg-primary/10 border-b border-primary/20 py-3 text-center text-sm">
          <Container className="flex items-center justify-between">
            <span className="font-medium text-primary-dark font-sans">
              You are logged in as an Administrator.
            </span>
            <a
              href="/admin/landing-page"
              className="px-4 py-1.5 bg-primary-dark hover:bg-primary-dark/90 text-white rounded-lg font-semibold transition-all text-xs font-sans"
            >
              Edit Page Content
            </a>
          </Container>
        </div>
      )}
      {/* 1. Dynamic Hero text and images */}
      <Hero
        headline={content.heroHeadline}
        subtitle={content.heroSubtitle}
        heroBgImage={content.heroBgImage}
        heroFigureImage={content.heroFigureImage}
      />
      
      <About />
      <Guide />
      <Services services={featuredServices} />
      
      {/* 2. Dynamic WellBeing text and stats counts */}
      <WellBeing
        headline={content.wellbeingHeadline}
        subtitle={content.wellbeingSubtitle}
        stats={statsData}
        image={content.wellbeingImage}
      />
      
      <Training
        headline={content.trainingHeadline}
        subtitle={content.trainingSubtitle}
        image={content.trainingImage}
        items={trainingItems}
      />
      <Therapists therapists={dbTherapists} />
      <ScheduleAppointment
        headline={content.appointmentHeadline}
        subtitle={content.appointmentSubtitle}
        buttonText={content.appointmentButtonText}
        buttonLink={content.appointmentButtonLink}
      />
      
      {/* 3. Dynamic Upcoming Events */}
      <UpcomingEvents
        featuredWorkshop={featuredWorkshop}
        gridWorkshops={gridWorkshops}
      />
      
      {/* 4. Dynamic Review testimonials & highlights */}
      <Review
        testimonials={testimonials}
        reviewHighlights={{
          card1Title: content.reviewCard1Title,
          card1Description: content.reviewCard1Description,
          card2Title: content.reviewCard2Title,
          card2Description: content.reviewCard2Description,
          photo1Image: content.reviewPhoto1Image,
          photo1Alt: content.reviewPhoto1Alt,
          photo2Image: content.reviewPhoto2Image,
          photo2Alt: content.reviewPhoto2Alt,
        }}
      />
    </main>
  );
}
