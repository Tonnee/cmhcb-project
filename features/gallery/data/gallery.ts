export interface GalleryItem {
  id: string;
  type: "image" | "video";
  src: string;
  thumbnailSrc?: string;
  alt: string;
  caption: string;
  category: string;
}

export const GALLERY_DATA: GalleryItem[] = [
  {
    id: "g1",
    type: "image",
    src: "/hero-image/group-therapy-support-circle.png",
    alt: "Group Therapy Session",
    caption: "A supportive environment during our weekly group counseling session.",
    category: "event",
  },
  {
    id: "g2",
    type: "image",
    src: "/hero-image/psychotherapy-counseling-session.png",
    alt: "Psychotherapy Session",
    caption: "One-on-one psychological support provided by our clinical team.",
    category: "activity",
  },
  {
    id: "g3",
    type: "image",
    src: "/understanding-anxiety-workshop-event.png",
    alt: "Anxiety Coping Workshop",
    caption: "Interactive learning during the Understanding Anxiety workshop.",
    category: "workshop",
  },
  {
    id: "g4",
    type: "image",
    src: "/mental-health-training-program.png",
    alt: "Mental Health Advocacy Training",
    caption: "Participants sharing experiences in the psychological advocacy workshop.",
    category: "workshop",
  },
  {
    id: "g5",
    type: "image",
    src: "/compassionate-mental-health-professional.png",
    alt: "Compassionate Counseling",
    caption: "Our counselors discussing community mental health strategies.",
    category: "activity",
  },
  {
    id: "g6",
    type: "image",
    src: "/cmhcb-mental-health-care.png",
    alt: "Art Therapy Session",
    caption: "Art and creative therapy used as tools for emotional regulation.",
    category: "activity",
  },
  {
    id: "g7",
    type: "image",
    src: "/cmhcb-mental-health-care-bw.png",
    alt: "Inauguration Ceremony",
    caption: "Reflecting on the milestone inauguration of CMHCB in Dhaka.",
    category: "occasion",
  },
  {
    id: "g8",
    type: "image",
    src: "/hero-image/family-therapy-psychologist-office.png",
    alt: "Annual Caregivers Day",
    caption: "Interactive counselor sessions during the annual caregivers meet.",
    category: "occasion",
  },
  {
    id: "g9",
    type: "video",
    src: "https://assets.mixkit.co/videos/preview/mixkit-therapist-talking-to-a-patient-41804-large.mp4",
    alt: "Therapist Patient Consultation",
    caption: "CMHCB Video Feature: A simulation showcasing patient-centric clinical consultation.",
    category: "event",
  },
];
