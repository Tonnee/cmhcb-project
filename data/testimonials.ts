export interface Testimonial {
  id: string;
  name: string;
  role: string;
  avatar: string;
  quote: string;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "testimonial-1",
    name: "Jhon Doe",
    role: "HR Manager",
    avatar: "/home-review/mental-health-therapy-client-woman.png",
    quote:
      "CMHC,B gave me a safe space to express myself without judgment. My therapist truly understood what I was going through. I feel stronger and more in control of my life now.",
  },
  {
    id: "testimonial-2",
    name: "Jane Smith",
    role: "Teacher",
    avatar: "/home-review/mental-health-therapy-client-man.png",
    quote:
      "The training programs at CMHC,B transformed my understanding of mental health. I now support my students with greater empathy and confidence every single day.",
  },
  {
    id: "testimonial-3",
    name: "Sarah Johnson",
    role: "Software Engineer",
    avatar: "/home-review/mental-health-therapy-client-woman.png",
    quote:
      "I was hesitant at first, but the supportive environment at CMHC,B made all the difference. My therapist helped me develop coping strategies that truly changed my daily life.",
  },
];
