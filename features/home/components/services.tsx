import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/layout/container";

interface ServiceItem {
  id: string;
  image: string;
  icon: string;
  iconVariant: "primary" | "accent";
  title: string;
  description: string;
  href: string;
}

const SERVICES_DATA: ServiceItem[] = [
  {
    id: "psychometric-assessment",
    image: "/home-service-images/psychometric-assessment.png",
    icon: "/home-service-images/psychometric-assessment-icon.png",
    iconVariant: "primary",
    title: "Psychometric Assessment",
    description: "understand personality, emotional functioning, and mental health needs",
    href: "/services/psychometric-assessment",
  },
  {
    id: "individual-therapy",
    image: "/home-service-images/individual-therapy.png",
    icon: "/home-service-images/individual-therapy-icon.png",
    iconVariant: "accent",
    title: "Individual Therapy",
    description: "understand personality, emotional functioning, and mental health needs",
    href: "/services/individual-therapy",
  },
  {
    id: "child-therapy",
    image: "/home-service-images/child-therapy.png",
    icon: "/home-service-images/child-therapy-icon.png",
    iconVariant: "primary",
    title: "Child Therapy",
    description: "understand personality, emotional functioning, and mental health needs",
    href: "/services/child-therapy",
  },
  {
    id: "family-therapy",
    image: "/home-service-images/family-therapy.png",
    icon: "/home-service-images/family-therapy-icon.png",
    iconVariant: "accent",
    title: "Family Therapy",
    description: "understand personality, emotional functioning, and mental health needs",
    href: "/services/family-therapy",
  },
  {
    id: "couple-therapy",
    image: "/home-service-images/couple-therapy.png",
    icon: "/home-service-images/couple-therapy-icon.png",
    iconVariant: "primary",
    title: "Couple Therapy",
    description: "understand personality, emotional functioning, and mental health needs",
    href: "/services/couple-therapy",
  },
  {
    id: "iq-test",
    image: "/home-service-images/iq-test.png",
    icon: "/home-service-images/iq-test-icon.png",
    iconVariant: "accent",
    title: "IQ Test",
    description: "understand personality, emotional functioning, and mental health needs",
    href: "/services/iq-test",
  },
];

function RightArrowIcon(): React.JSX.Element {
  return (
    <svg
      className="inline-block ml-1"
      fill="none"
      viewBox="0 0 12 12"
      width="12"
      height="12"
      aria-hidden="true"
    >
      <path
        d="M2.5 6h7M6.5 2.5l3.5 3.5-3.5 3.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ServiceCard({ item }: { item: ServiceItem }): React.JSX.Element {
  const iconBgClass = item.iconVariant === "primary" ? "bg-primary" : "bg-accent";

  return (
    <div className="bg-white rounded-[16px] shadow-sm border border-gray-50 flex flex-col items-center pb-6 transition-shadow hover:shadow-md">
      {/* Image Block */}
      <div className="relative w-full px-5 pt-5 flex-shrink-0">
        <div className="relative h-[220px] w-full rounded-[10px] overflow-hidden bg-gray-100">
          <Image
            src={item.image}
            alt={item.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
          />
        </div>

        {/* Floating Icon */}
        <div
          className={`absolute left-1/2 -translate-x-1/2 -bottom-[42px] w-[85px] h-[85px] rounded-full flex items-center justify-center border-4 border-white shadow-sm z-10 ${iconBgClass}`}
        >
          <div className="relative w-[44px] h-[44px]">
            <Image
              src={item.icon}
              alt=""
              fill
              className="object-contain"
            />
          </div>
        </div>
      </div>

      {/* Content Block */}
      <div className="flex flex-col items-center text-center px-5 pt-[56px] flex-1 w-full">
        <h3 className="font-marcellus text-xl text-dark mb-2.5">
          {item.title}
        </h3>
        <p className="font-sans text-sm text-light-ash max-w-[332px] mb-[18px] leading-relaxed">
          {item.description}
        </p>

        <div className="mt-auto">
          <Link
            href={item.href}
            className="group inline-flex items-center gap-0 font-marcellus text-sm text-primary-dark transition-colors hover:text-dark-green hover:underline"
          >
            Learn More
            <span className="transition-transform group-hover:translate-x-1">
              <RightArrowIcon />
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function Services(): React.JSX.Element {
  return (
    <section className="py-16 lg:py-24">
      <Container>
        {/* Header */}
        <div className="text-center mb-14 px-4">
          <p className="font-sans font-medium text-base text-accent mb-3 tracking-wide">
            Services We Provide
          </p>
          <h2 className="font-marcellus text-3xl md:text-4xl text-dark leading-snug">
            Professional Psychology <span className="text-primary-dark">Therapy Services</span>
            <br className="hidden md:block" /> You Can Choose
          </h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-8">
          {SERVICES_DATA.map((service) => (
            <ServiceCard key={service.id} item={service} />
          ))}
        </div>
      </Container>
    </section>
  );
}
