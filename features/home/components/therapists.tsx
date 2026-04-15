import * as React from "react";
import { Container } from "@/components/layout/container";
import { TherapistCarousel, Therapist } from "@/features/home/components/therapist-carousel";

const THERAPISTS_DATA: Therapist[] = [
  { 
    id: "t1", 
    image: "/home-therapist/therapist-ruma-khondaker-1.png", 
    name: "Ruma Khondaker", 
    role: "Psychiatrist", 
    showOverlay: true 
  },
  { 
    id: "t2", 
    image: "/home-therapist/therapist-ruma-khondaker-2.png", 
    name: "Ruma Khondaker", 
    role: "Psychiatrist" 
  },
  { 
    id: "t3", 
    image: "/home-therapist/therapist-ruma-khondaker-3.png", 
    name: "Ruma Khondaker", 
    role: "Psychiatrist" 
  },
  { 
    id: "t4", 
    image: "/home-therapist/therapist-ruma-khondaker-4.png", 
    name: "Ruma Khondaker", 
    role: "Psychiatrist" 
  },
  { 
    id: "t5", 
    image: "/home-therapist/therapist-ruma-khondaker-1.png", 
    name: "Dr. Nadia", 
    role: "Clinical Psychologist" 
  },
  { 
    id: "t6", 
    image: "/home-therapist/therapist-ruma-khondaker-2.png", 
    name: "Dr. Hasan", 
    role: "Child Therapist" 
  },
  { 
    id: "t7", 
    image: "/home-therapist/therapist-ruma-khondaker-3.png", 
    name: "Dr. Rahman", 
    role: "Psychiatrist" 
  },
  { 
    id: "t8", 
    image: "/home-therapist/therapist-ruma-khondaker-4.png", 
    name: "Dr. Sarah", 
    role: "Mental Health Counselor" 
  },
];

export default function Therapists(): React.JSX.Element {
  return (
    <section className="bg-white py-20 lg:py-24">
      <Container>
        {/* Global Component Header Context */}
        <div className="text-center mb-14 max-w-2xl mx-auto px-4">
          <p className="font-sans font-medium text-base text-accent mb-3 tracking-wide">
            Our Therapist
          </p>
          <h2 className="font-marcellus text-3xl md:text-4xl lg:text-[36px] leading-[1.3] text-dark">
            Personalized &amp; Professional <span className="text-primary-dark">Therapy</span> to Guide
            <br className="hidden md:block" />
            You Toward <span className="text-accent">Healing</span>
          </h2>
        </div>

        {/* Dynamic Interactive Leaf Component Mounting Block */}
        <TherapistCarousel therapists={THERAPISTS_DATA} />

      </Container>
    </section>
  );
}
