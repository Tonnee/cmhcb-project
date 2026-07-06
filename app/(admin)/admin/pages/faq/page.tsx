import * as React from "react";
import type { Metadata } from "next";
import prisma from "@/lib/prisma";
import EditFaqPageForm from "@/features/admin/components/edit-faq-page-form";

export const metadata: Metadata = {
  title: "Customize FAQ Page | Admin Portal | CMHCB",
  description: "Manage frequently asked questions, answers, and hero details on the public FAQ page.",
};

export const dynamic = "force-dynamic";

export default async function AdminFaqPage(): Promise<React.JSX.Element> {
  const dbContent = await prisma.faqPageContent.findFirst();

  const defaultContent = {
    id: "faq-content",
    heroTitle: "We are here to answer your questions",
    heroDescription: "Whether you're new to therapy or an existing client, we've compiled a list of common questions to help you understand our services, payment methods, and privacy policies.",
    heroImage: "/understanding-anxiety-workshop-event.png",
    items: JSON.stringify([
      {
        category: "Therapy",
        question: "How long does a typical counseling session last?",
        answer: "A standard individual counseling session at CMHC,B lasts 50 minutes."
      },
      {
        category: "Fees & Billing",
        question: "What are your fees, and do you accept insurance?",
        answer: "Our fees vary depending on the service and the therapist's level of experience. We accept direct payments and provide receipts that you can submit to your insurance provider."
      }
    ])
  };

  const content = dbContent || defaultContent;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-1">
        <h1 className="font-marcellus text-3xl font-bold text-dark-green">
          Customize FAQ Page
        </h1>
        <p className="font-sans text-sm text-light-ash">
          Manage FAQ headings, banner images, and specific question and answer records organized by categories.
        </p>
      </div>

      <EditFaqPageForm initialContent={content} />
    </div>
  );
}
