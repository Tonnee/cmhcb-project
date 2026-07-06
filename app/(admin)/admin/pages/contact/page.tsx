import * as React from "react";
import type { Metadata } from "next";
import prisma from "@/lib/prisma";
import EditContactPageForm from "@/features/admin/components/edit-contact-page-form";

export const metadata: Metadata = {
  title: "Customize Contact Details | Admin Portal | CMHCB",
  description: "Manage phone numbers, emails, addresses, social media links, and clinic location maps.",
};

export const dynamic = "force-dynamic";

export default async function AdminContactPage(): Promise<React.JSX.Element> {
  const dbContent = await prisma.contactPageContent.findFirst();

  const defaultContent = {
    id: "contact-content",
    phone: "+880 1974-349569",
    email: "info@cmhcbd.com",
    addressLine1: "CMHC Office Room, 78/2 (2nd Floor)",
    addressLine2: "New Airport Road, Tejkunipara",
    addressLine3: "Tejgoan, Dhaka-1212",
    facebookUrl: "#",
    instagramUrl: "#",
    twitterUrl: "#",
    linkedinUrl: "#",
    mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.810573934375!2d90.3907579!3d23.7541819!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c7793b5847e7%3A0xa64aa8a96677f40d!2sTejgaon%2C%20Dhaka!5e0!3m2!1sen!2sbd!4v1689200000000!5m2!1sen!2sbd"
  };

  const content = dbContent || defaultContent;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-1">
        <h1 className="font-marcellus text-3xl font-bold text-dark-green">
          Customize Contact Details
        </h1>
        <p className="font-sans text-sm text-light-ash">
          Manage the public contact information cards, address info, social platforms, and clinical google map iframe.
        </p>
      </div>

      <EditContactPageForm initialContent={content} />
    </div>
  );
}
