import * as React from "react";
import Image from "next/image";
import { Container } from "@/components/layout/container";

interface IconBadgeProps {
  children: React.ReactNode;
  bgClass: string;
}

function IconBadge({ children, bgClass }: IconBadgeProps): React.JSX.Element {
  return (
    <span
      className={`inline-flex items-center justify-center w-11 h-11 rounded-full align-middle mx-1 ${bgClass}`}
    >
      {children}
    </span>
  );
}

interface ImageBadgeProps {
  src: string;
  alt: string;
}

function ImageBadge({ src, alt }: ImageBadgeProps): React.JSX.Element {
  return (
    <span className="relative inline-flex items-center justify-center w-11 h-11 rounded-full overflow-hidden align-middle mx-1 border-2 border-white shadow-md">
      <Image
        src={src}
        alt={alt}
        fill
        sizes="44px"
        className="object-cover"
      />
    </span>
  );
}

export default function About(): React.JSX.Element {
  return (
    <section className="bg-white py-16 lg:py-24">
      <Container>
        <div className="text-center">
          <h2 className="font-marcellus text-3xl md:text-4xl leading-relaxed text-dark">
            We connect licensed therapists{" "}
            <ImageBadge
              src="/home-about-image/licensed-mental-health-therapist.png"
              alt="Portrait of a licensed mental health therapist"
            />
            , mental health programs{" "}
            <IconBadge bgClass="bg-primary-dark">
              <Image
                src="/home-about-image/mental-health-brain-icon.png"
                alt="Mental health brain icon representing programs"
                width={30}
                height={30}
              />
            </IconBadge>
            , and personalized care{" "}
            <IconBadge bgClass="bg-accent">
              <Image
                src="/home-about-image/personalized-care-heart-icon.png"
                alt="Heart icon indicating personalized mental health care"
                width={27}
                height={27}
              />
            </IconBadge>{" "}
            services, ensuring clients{" "}
            <ImageBadge
              src="/home-about-image/mental-health-therapy-client.png"
              alt="Portrait of a successful mental health therapy client"
            />{" "}
            receive the support they need to thrive{" "}
            <IconBadge bgClass="bg-secondary">
              <Image
                src="/home-about-image/mental-health-progress-chart-icon.png"
                alt="Growth chart icon signifying client progress"
                width={26}
                height={26}
              />
            </IconBadge>{" "}
            wherever they feel safe.
          </h2>
        </div>
      </Container>
    </section>
  );
}
