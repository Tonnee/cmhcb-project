import * as React from "react";
import { type Metadata } from "next";
import { PageFeatureHero } from "@/components/shared/page-feature-hero";
import { FaqTabsSection } from "@/features/faqs/components/faq-tabs-section";
import prisma from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Frequently Asked Questions | CMHCB",
  description: "Find answers to your questions about our therapy services, appointments, billing, and privacy policies at CMHCB.",
};

export default async function FaqsPage(): Promise<React.JSX.Element> {
  const [dbContent, dbServices, dbTrainings] = await Promise.all([
    prisma.faqPageContent.findFirst(),
    prisma.service.findMany({ select: { title: true, faqs: true } }),
    prisma.training.findMany({ select: { title: true, faq: true } }),
  ]);

  const title = dbContent?.heroTitle || "We are here to answer your questions";
  const description = dbContent?.heroDescription || "Whether you're new to therapy or an existing client, we've compiled a list of common questions to help you understand our services, payment methods, and privacy policies.";
  const imageSrc = dbContent?.heroImage || "/understanding-anxiety-workshop-event.png";

  const compiledFaqs: { category: string; question: string; answer: string }[] = [];

  // 1. Compile Service FAQs -> goes to "Services" tab
  dbServices.forEach((srv) => {
    if (srv.faqs) {
      try {
        const parsed = JSON.parse(srv.faqs);
        if (Array.isArray(parsed)) {
          parsed.forEach((faq) => {
            if (faq.question && faq.answer) {
              compiledFaqs.push({
                category: "Services",
                question: faq.question,
                answer: faq.answer,
              });
            }
          });
        }
      } catch (e) {
        console.error("Failed to parse Service FAQ:", e);
      }
    }
  });

  // 2. Compile Training FAQs -> goes to "Trainings" tab
  dbTrainings.forEach((trn) => {
    if (trn.faq) {
      try {
        const parsed = JSON.parse(trn.faq);
        if (Array.isArray(parsed)) {
          parsed.forEach((faq) => {
            if (faq.question && faq.answer) {
              compiledFaqs.push({
                category: "Trainings",
                question: faq.question,
                answer: faq.answer,
              });
            }
          });
        }
      } catch (e) {
        console.error("Failed to parse Training FAQ:", e);
      }
    }
  });

  // 3. Compile Admin-added FAQs from FaqPageContent
  if (dbContent?.items) {
    try {
      const parsed = JSON.parse(dbContent.items);
      if (Array.isArray(parsed)) {
        parsed.forEach((item) => {
          if (item.question && item.answer) {
            const rawCategory = (item.category || "").trim().toLowerCase();
            let finalCategory = "Others";

            if (rawCategory === "services" || rawCategory === "service") {
              finalCategory = "Services";
            } else if (rawCategory === "trainings" || rawCategory === "training") {
              finalCategory = "Trainings";
            } else {
              finalCategory = "Others";
            }

            compiledFaqs.push({
              category: finalCategory,
              question: item.question,
              answer: item.answer,
            });
          }
        });
      }
    } catch (e) {
      console.error("Failed to parse admin FAQ items:", e);
    }
  }

  // Fallback if compiled FAQ list is empty
  if (compiledFaqs.length === 0) {
    compiledFaqs.push(
      {
        category: "Services",
        question: "What types of therapy do you offer?",
        answer: "We offer a wide range of psychological services including individual therapy, couples counselling, family therapy, child and adolescent therapy.",
      },
      {
        category: "Trainings",
        question: "Do I need a psychology background to attend trainings?",
        answer: "No. Most of our community and professional workshops are open to anyone who wants to learn helper skills.",
      },
      {
        category: "Others",
        question: "How do I book an appointment?",
        answer: "You can book directly using the 'Book Appointment' buttons on the website or call our support team.",
      }
    );
  }

  return (
    <main>
      <PageFeatureHero
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "FAQs", href: "/faqs" },
        ]}
        title={title}
        description={description}
        image={{
          src: imageSrc,
          alt: "CMHCB support team and licensed therapist ready to answer your questions",
        }}
        ctas={[
          {
            label: "Search FAQs",
            variant: "primary",
            href: "#faq-section",
            className: "bg-primary-dark hover:bg-primary-dark/90 border-primary-dark",
          },
          {
            label: "Contact Support",
            variant: "outline",
            href: "/contact",
            className: "text-primary-dark border-primary-dark hover:bg-primary-dark/10",
          },
        ]}
      />
      <div id="faq-section">
        <FaqTabsSection initialItems={compiledFaqs} />
      </div>
    </main>
  );
}
