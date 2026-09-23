import * as React from "react";
import Image from "next/image";
import { Container } from "@/components/layout/container";

interface IconBadgeProps {
  children: React.ReactNode;
  bgClass: string;
}

function IconBadge({ children }: IconBadgeProps): React.JSX.Element {
  return (
    <span
      className={`inline-flex items-center justify-center w-11 h-11 rounded-full align-middle mx-1 bg-primary/10 text-primary`}
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

export interface AboutProps {
  statement?: string | null;
  therapistImage?: string | null;
  clientImage?: string | null;
  brainIcon?: string | null;
  heartIcon?: string | null;
  chartIcon?: string | null;
}

export const DEFAULT_ABOUT_STATEMENT =
  "We connect licensed therapists [therapist], mental health programs [brain], and personalized care [heart] services, ensuring clients [client] receive the support they need to thrive [chart] wherever they feel safe.";

export const DEFAULT_ABOUT_BADGES = {
  therapistImage: "/home-about-image/licensed-mental-health-therapist.png",
  clientImage: "/home-about-image/mental-health-therapy-client.png",
  brainIcon: "/home-about-image/mental-health-brain-icon.png",
  heartIcon: "/home-about-image/personalized-care-heart-icon.png",
  chartIcon: "/home-about-image/mental-health-progress-chart-icon.png",
};

export default function About({
  statement = DEFAULT_ABOUT_STATEMENT,
  therapistImage = DEFAULT_ABOUT_BADGES.therapistImage,
  clientImage = DEFAULT_ABOUT_BADGES.clientImage,
  brainIcon = DEFAULT_ABOUT_BADGES.brainIcon,
  heartIcon = DEFAULT_ABOUT_BADGES.heartIcon,
  chartIcon = DEFAULT_ABOUT_BADGES.chartIcon,
}: AboutProps = {}): React.JSX.Element {
  const currentStatement = statement || DEFAULT_ABOUT_STATEMENT;
  const currentTherapistImage = therapistImage || DEFAULT_ABOUT_BADGES.therapistImage;
  const currentClientImage = clientImage || DEFAULT_ABOUT_BADGES.clientImage;
  const currentBrainIcon = brainIcon || DEFAULT_ABOUT_BADGES.brainIcon;
  const currentHeartIcon = heartIcon || DEFAULT_ABOUT_BADGES.heartIcon;
  const currentChartIcon = chartIcon || DEFAULT_ABOUT_BADGES.chartIcon;

  const TOKEN_REGEX = /(\[(?:therapist|brain|heart|client|chart|progress)\])/gi;
  const parts = currentStatement.split(TOKEN_REGEX);

  return (
    <section className="py-16 lg:py-24">
      <Container>
        <div className="text-center">
          <h2 className="font-marcellus text-3xl md:text-4xl leading-relaxed text-dark">
            {parts.map((part, index) => {
              const lower = part.toLowerCase();
              if (lower === "[therapist]") {
                return (
                  <ImageBadge
                    key={index}
                    src={currentTherapistImage}
                    alt="Portrait of a licensed mental health therapist"
                  />
                );
              }
              if (lower === "[client]") {
                return (
                  <ImageBadge
                    key={index}
                    src={currentClientImage}
                    alt="Portrait of a successful mental health therapy client"
                  />
                );
              }
              if (lower === "[brain]") {
                return (
                  <IconBadge key={index} bgClass="">
                    <Image
                      src={currentBrainIcon}
                      alt="Mental health brain icon representing programs"
                      width={30}
                      height={30}
                    />
                  </IconBadge>
                );
              }
              if (lower === "[heart]") {
                return (
                  <IconBadge key={index} bgClass="">
                    <Image
                      src={currentHeartIcon}
                      alt="Heart icon indicating personalized mental health care"
                      width={27}
                      height={27}
                    />
                  </IconBadge>
                );
              }
              if (lower === "[chart]" || lower === "[progress]") {
                return (
                  <IconBadge key={index} bgClass="">
                    <Image
                      src={currentChartIcon}
                      alt="Growth chart icon signifying client progress"
                      width={26}
                      height={26}
                    />
                  </IconBadge>
                );
              }

              return <span key={index} dangerouslySetInnerHTML={{ __html: part }} />;
            })}
          </h2>
        </div>
      </Container>
    </section>
  );
}
