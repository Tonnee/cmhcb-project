import { type SplitBlockContent } from "@/components/shared/split-content-block";

export const SERVICE_INFO_BLOCKS: SplitBlockContent[] = [
  {
    heading: "Who Can Benefit",
    items: [
      "Individuals seeking emotional support",
      "Families and couples",
      "Students and working professionals",
      "Organizations and institutions",
    ],
    cta: { label: "Book Appointment", href: "/appointment" },
    image: {
      src: "/couple-therapy-counselor-session.jpg",
      alt: "Couple in a therapy session discussing mental health with a counselor at CMHCB",
    },
  },
  {
    heading: "Why Choose CMHC,B",
    items: [
      "Qualified and experienced professionals",
      "Ethical practice and confidentiality",
      "Personalized care plans",
      "Trusted mental health center in Bangladesh",
    ],
    cta: { label: "Schedule a Session", href: "/appointment" },
    image: {
      src: "/family-psychotherapy-consultation.jpg",
      alt: "Family participating in a psychotherapy consultation session",
    },
  },
];
