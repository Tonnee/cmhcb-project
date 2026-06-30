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

// Force dynamic page rendering so queries run on every request
export const dynamic = "force-dynamic";

export default async function Page(): Promise<React.JSX.Element> {
  const now = new Date().toISOString();

  // Parallel database fetch for dynamic content
  const [landingContent, dbTestimonials, dbWorkshops, dbServices] = await Promise.all([
    prisma.landingPageContent.findFirst(),
    prisma.testimonial.findMany({
      where: { isFeatured: true },
      take: 10,
    }),
    prisma.workshop.findMany({
      where: {
        date: {
          gte: now, // Future workshops only
        },
      },
      orderBy: { date: "asc" },
      take: 4,
    }),
    prisma.service.findMany({
      where: { isFeatured: true },
      take: 6,
    }),
  ]);

  const defaultContent = {
    heroHeadline: "Empowering Your <span class=\"text-accent\">Mind</span>, Transforming Your <span class=\"text-primary\">Life</span>",
    heroSubtitle: "At CMHC,B, we believe every individual deserves a supportive space to heal, grow, and thrive. Connect with the right therapist, right when you need it.",
    heroBgImage: "/hero-image/hero-bg.png",
    heroFigureImage: "/hero-image/hero-figure.png",
    wellbeingHeadline: "Our Commitment to Your <span class=\"text-accent\">Well-Being</span>",
    wellbeingSubtitle: "At CMHC,B, we are committed to delivering compassionate and effective mental health care. Explore how we've supported individuals on their path to emotional well-being and resilience.",
    trainingHeadline: "Want to Make a <span class=\"text-primary-dark\">Difference</span> in <span class=\"text-accent\">Mental Health</span>?",
    trainingSubtitle: "Our specialized trainings equip professionals, educators, and caregivers with the tools needed to foster mental well-being in their communities.",
    trainingImage: "/mental-health-training-program.png",
    experienceCount: 20,
    happyClientsCount: 1500,
    sessionsCount: 2800,
    satisfactionRate: 94,
  };
  const content = landingContent || defaultContent;

  const statsData = [
    {
      id: "experience",
      value: content.experienceCount,
      suffix: "+",
      title: "Years of Experience",
      description: "Helping individuals navigate life's",
    },
    {
      id: "clients",
      value: content.happyClientsCount,
      suffix: "+",
      title: "Happy Clients",
      description: "Empowered through counseling and therapy",
    },
    {
      id: "sessions",
      value: content.sessionsCount,
      suffix: "+",
      title: "Sessions Conducted",
      description: "Providing guidance and support every day",
    },
    {
      id: "satisfaction",
      value: content.satisfactionRate,
      suffix: "%",
      title: "Satisfaction Positive",
      description: "outcomes and improved well-being",
    },
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

  // 3. Workshops list fallback
  let workshops = dbWorkshops;
  if (workshops.length === 0) {
    // If no future workshops exist, pull past ones to avoid empty grid
    workshops = await prisma.workshop.findMany({
      orderBy: { date: "desc" },
      take: 4,
    });
  }

  const featuredWorkshop = workshops.length > 0 ? workshops[0] : null;
  const gridWorkshops = workshops.slice(1);

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

  return (
    <main>
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
      />
      
      <Training
        headline={content.trainingHeadline}
        subtitle={content.trainingSubtitle}
        image={content.trainingImage}
      />
      <Therapists />
      <ScheduleAppointment />
      
      {/* 3. Dynamic Upcoming Events */}
      <UpcomingEvents
        featuredWorkshop={featuredWorkshop}
        gridWorkshops={gridWorkshops}
      />
      
      {/* 4. Dynamic Review testimonials */}
      <Review testimonials={testimonials} />
    </main>
  );
}
