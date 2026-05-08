import { type SplitBlockContent } from "@/components/shared/split-content-block";

export const TRAINING_INFO_BLOCKS: SplitBlockContent[] = [
  {
    heading: "Why Choose CMHCB Training Programs",
    items: [
      "Professional trainers with clinical and academic credentials",
      "Evidence-based, internationally aligned curricula",
      "Interactive, practical, and culturally sensitive delivery",
      "Affordable and accessible training for all backgrounds",
    ],
    cta: { label: "Enquire Now", href: "/contact" },
    image: {
      src: "/compassionate-mental-health-professional.png",
      alt: "Professionals in a CMHCB training session",
    },
  },
  {
    heading: "Who Can Apply",
    items: [
      "Working professionals and executives",
      "Students and recent graduates",
      "Corporates, schools, and institutions (as groups)",
      "Anyone interested in personal development and mental health",
    ],
    cta: { label: "Register Interest", href: "/contact" },
    image: {
      src: "/compassionate-mental-health-professional.png",
      alt: "Diverse participants at a mental health training",
    },
  },
  {
    heading: "Training Methodology",
    items: [
      "Theory-led sessions with live demonstrations",
      "Group activities and role play exercises",
      "Case studies and real-world scenario analysis",
      "Take-home resources and certificates",
    ],
    cta: { label: "View Calendar", href: "/events" },
    image: {
      src: "/compassionate-mental-health-professional.png",
      alt: "Interactive workshop activity at CMHCB",
    },
  },
  {
    heading: "Certification",
    items: [
      "Certificate of participation for all completed trainings",
      "Recognised by CMHCB and partnering institutions",
      "Supports CPD and professional development portfolios",
      "Digital and physical certificate options available",
    ],
    cta: { label: "Learn More", href: "/contact" },
    image: {
      src: "/compassionate-mental-health-professional.png",
      alt: "A CMHCB training certificate being awarded",
    },
  },
];
