import * as React from "react";
import type { Metadata } from "next";
import prisma from "@/lib/prisma";
import EditSupportPageForm from "@/features/admin/components/edit-support-page-form";

export const metadata: Metadata = {
  title: "Customize Support Details | Admin Portal | CMHCB",
  description: "Manage phone numbers, emergency helplines, hero details, and advisory disclaimers on the Support page.",
};

export const dynamic = "force-dynamic";

export default async function AdminSupportPage(): Promise<React.JSX.Element> {
  const dbContent = await prisma.supportPageContent.findFirst();

  const defaultContent = {
    id: "support-content",
    heroTitle: "We are here to support you in times of need",
    heroDescription: "Whether you are facing a mental health crisis or seeking guidance for a loved one, CMHCB is here to help. Reach out to our emergency contacts or trained professionals for immediate assistance.",
    heroImage: "/hero-image/group-therapy-support-circle.png",
    advisoryText: "Important Advisory: CMHCB and associated emotional helper helplines provide psychological support, mental health counseling, and crisis triage. If you or someone you know is in immediate physical danger, experiencing a severe drug/medical emergency, or threatened by active self-harm, please dial the National Emergency Hotline (999) or proceed immediately to the nearest hospital emergency department.",
    contacts: JSON.stringify([
      {
        title: "CMHCB Crisis Helpline",
        description: "Speak directly with our trained psychological first-aid team for immediate mental health support, emotional guidance, crisis interventions, and safety planning.",
        phone: "+880 1974-349569",
        hours: "Available 24/7",
        iconName: "phone",
        isPrimary: true,
      },
      {
        title: "National Emergency Service",
        description: "Call immediately for urgent, life-threatening medical emergencies, police assistance, ambulance dispatch, or physical safety threats.",
        phone: "999",
        hours: "Available 24/7",
        iconName: "warning",
        isPrimary: false,
      },
      {
        title: "National Child Helpline",
        description: "Toll-free national emergency helpline dedicated to children and youth in distress, offering immediate protection, support, and counseling.",
        phone: "1098",
        hours: "Available 24/7",
        iconName: "shield",
        isPrimary: false,
      }
    ])
  };

  const content = dbContent || defaultContent;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-1">
        <h1 className="font-marcellus text-3xl font-bold text-dark-green">
          Customize Support Details
        </h1>
        <p className="font-sans text-sm text-light-ash">
          Manage crisis helplines, support titles, advisory texts, and banner visual graphics.
        </p>
      </div>

      <EditSupportPageForm initialContent={content} />
    </div>
  );
}
