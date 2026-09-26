import * as React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";
import { sanitizeHtml } from "@/lib/sanitize";

export interface AppointmentCtaProps {
  title?: string | null;
  description?: string | null;
  image?: string | null;
  imageAlt?: string | null;
  buttonText?: string | null;
  buttonHref?: string | null;
}

const DEFAULT_CTA = {
  title: "Take The Next Step - Schedule Your Appointment",
  description:
    "We're here to support you, let's work together to create a path toward healing, growth, and balance.",
  image: "/pages-hero-background/1.png",
  imageAlt: "Make an appointment background",
  buttonText: "Book an Appointment",
  buttonHref: "/appointment",
};

export async function AppointmentCta({
  title,
  description,
  image,
  imageAlt,
  buttonText,
  buttonHref,
}: AppointmentCtaProps = {}): Promise<React.JSX.Element> {
  let dbContent: any = null;
  if (!title || !description || !image || !buttonText || !buttonHref) {
    try {
      dbContent = await prisma.trainingPageContent.findFirst().catch(() => null);
    } catch {
      dbContent = null;
    }
  }

  const finalTitle = title ?? dbContent?.ctaTitle ?? DEFAULT_CTA.title;
  const finalDescription = description ?? dbContent?.ctaDescription ?? DEFAULT_CTA.description;
  const finalImage = image ?? dbContent?.ctaImage ?? DEFAULT_CTA.image;
  const finalImageAlt = imageAlt ?? dbContent?.ctaImageAlt ?? DEFAULT_CTA.imageAlt;
  const finalButtonText = buttonText ?? dbContent?.ctaButtonText ?? DEFAULT_CTA.buttonText;
  const finalButtonHref = buttonHref ?? dbContent?.ctaButtonHref ?? DEFAULT_CTA.buttonHref;

  return (
    <section className="relative w-full py-28 md:py-36 overflow-hidden flex items-center">
      {/* Background image */}
      <Image
        src={finalImage}
        alt={finalImageAlt}
        fill
        sizes="100vw"
        className="object-cover object-center"
      />

      {/* Dark overlay */}
      <div
        className="absolute inset-0"
        style={{ backgroundColor: "rgba(1, 30, 0, 0.73)" }}
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-10 w-full flex flex-col items-center justify-center px-6 text-center">
        <h2 className="font-marcellus text-4xl md:text-5xl leading-tight text-white max-w-3xl mb-6">
          {finalTitle.includes("<") ? (
            <span dangerouslySetInnerHTML={{ __html: sanitizeHtml(finalTitle) }} />
          ) : (
            finalTitle
          )}
        </h2>
        
        <p className="font-sans text-base leading-normal text-white max-w-2xl mb-10">
          {finalDescription}
        </p>

        <Button href={finalButtonHref} variant="white">
          {finalButtonText}
        </Button>
      </div>
    </section>
  );
}
