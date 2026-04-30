import { type ServiceCardVariant } from "@/features/services/components/service-card";

export interface ServiceItem {
  slug: string;
  title: string;
  features: string[];
  duration: string;
  fees: string;
  variant: ServiceCardVariant;
}

export const SERVICES: ServiceItem[] = [
  {
    slug: "psychometric-assessment",
    title: "Psychometric Assessment",
    features: [
      "Standardized evaluation tools",
      "Psychological screening",
      "Treatment planning support",
    ],
    duration: "30 mins",
    fees: "300 BDT",
    variant: "primary",
  },
  {
    slug: "individual-therapy",
    title: "Individual Therapy",
    features: [
      "One-on-one support",
      "Emotional well-being focus",
      "Personalized coping strategies",
    ],
    duration: "60 mins",
    fees: "1000 BDT",
    variant: "secondary",
  },
  {
    slug: "child-therapy",
    title: "Child Therapy",
    features: [
      "Child-centered techniques",
      "Emotional development support",
      "Parent-guided intervention",
    ],
    duration: "90 mins",
    fees: "1500 BDT",
    variant: "secondary",
  },
  {
    slug: "family-therapy",
    title: "Family Therapy",
    features: [
      "Improved family communication",
      "Conflict resolution support",
      "Identify family dynamics",
    ],
    duration: "90 mins",
    fees: "3000 BDT",
    variant: "secondary",
  },
  {
    slug: "couple-therapy",
    title: "Couple Therapy",
    features: [
      "Relationship conflict support",
      "Communication improvement",
      "Emotional connection building",
    ],
    duration: "90 mins",
    fees: "1500 BDT",
    variant: "secondary",
  },
  {
    slug: "iq-test",
    title: "IQ Test",
    features: [
      "Cognitive ability assessment",
      "Standardized intelligence testing",
      "Professional interpretation report",
    ],
    duration: "90 mins",
    fees: "3000 BDT",
    variant: "secondary",
  },
];
