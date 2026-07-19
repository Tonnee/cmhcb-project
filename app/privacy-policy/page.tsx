import * as React from "react";
import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { SimplePageHeader } from "@/components/shared/simple-page-header";
import { getRequiredAdminSession } from "@/app/(admin)/admin/admin-management";
import DOMPurify from "isomorphic-dompurify";

import prisma from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Privacy Policy | CMHCB",
  description: "Privacy Policy for the Center for Mental Health and Care Bangladesh.",
};

export const dynamic = "force-dynamic";

const defaultContent = `
<p>
  At the Center for Mental Health and Care Bangladesh (CMHCB), we are committed to protecting your privacy and ensuring the confidentiality of your personal and medical information. This Privacy Policy outlines how we collect, use, and safeguard your data when you use our website or clinical services.
</p>

<div>
  <h2 class="font-marcellus text-2xl text-primary-dark mb-4 mt-8">1. Information We Collect</h2>
  <p class="mb-4">We may collect the following types of information:</p>
  <ul class="list-disc pl-6 space-y-2">
    <li><strong>Personal Identification Information:</strong> Name, email address, phone number, date of birth, and physical address when you register or book an appointment.</li>
    <li><strong>Health and Clinical Information:</strong> Medical history, therapy notes, psychological assessments, and treatment plans necessary to provide you with adequate care.</li>
    <li><strong>Usage Data:</strong> Information on how you navigate our website (IP address, browser type, pages visited) to improve user experience.</li>
  </ul>
</div>

<div>
  <h2 class="font-marcellus text-2xl text-primary-dark mb-4 mt-8">2. How We Use Your Information</h2>
  <p class="mb-4">The information we collect is strictly used for:</p>
  <ul class="list-disc pl-6 space-y-2">
    <li>Providing, operating, and maintaining our clinical and therapeutic services.</li>
    <li>Communicating with you regarding appointments, updates, and necessary medical advice.</li>
    <li>Complying with legal obligations and professional psychological governing bodies in Bangladesh.</li>
    <li>Improving our digital platform and user accessibility.</li>
  </ul>
</div>

<div>
  <h2 class="font-marcellus text-2xl text-primary-dark mb-4 mt-8">3. Patient Confidentiality</h2>
  <p>
    Confidentiality is the cornerstone of mental health care. All therapeutic sessions, clinical records, and consultations are held in the strictest confidence. We will not disclose your personal or psychological information to any third party without your explicit, written consent, except in specific situations mandated by law (e.g., immediate threat to self or others, or a court order).
  </p>
</div>

<div>
  <h2 class="font-marcellus text-2xl text-primary-dark mb-4 mt-8">4. Data Security</h2>
  <p>
    We implement robust physical, technical, and administrative security measures to protect your data from unauthorized access, alteration, or destruction. Our digital booking systems and patient databases use encrypted connections to ensure your health information remains secure.
  </p>
</div>

<div>
  <h2 class="font-marcellus text-2xl text-primary-dark mb-4 mt-8">5. Your Rights</h2>
  <p class="mb-4">You have the right to:</p>
  <ul class="list-disc pl-6 space-y-2">
    <li>Request access to your personal data and clinical records.</li>
    <li>Request corrections to any inaccurate or incomplete information.</li>
    <li>Withdraw consent for optional communications (e.g., newsletters).</li>
    <li>Request the deletion of your personal data, subject to local legal requirements for medical record retention.</li>
  </ul>
</div>

<div>
  <h2 class="font-marcellus text-2xl text-primary-dark mb-4 mt-8">6. Contact Us</h2>
  <p>
    If you have any questions or concerns regarding this Privacy Policy or the handling of your data, please contact our administrative team at privacy@cmhcbd.com or call our support line.
  </p>
</div>
`;

export default async function PrivacyPolicyPage(): Promise<React.JSX.Element> {
  let isAdmin = false;
  try {
    await getRequiredAdminSession();
    isAdmin = true;
  } catch {
    isAdmin = false;
  }

  const dbContent = await prisma.policyPageContent.findUnique({
    where: { id: "privacy-policy" },
  });

  const title = dbContent?.title || "Privacy Policy";
  const subtitle = dbContent?.subtitle || "Last Updated: May 2026";
  const htmlContent = dbContent?.content || defaultContent;

  return (
    <main>
      {isAdmin && (
        <div className="bg-primary/10 border-b border-primary/20 py-3 text-center text-sm">
          <Container className="flex items-center justify-between">
            <span className="font-medium text-primary-dark font-sans">
              You are logged in as an Administrator.
            </span>
            <a
              href="/admin/pages/privacy-policy"
              className="px-4 py-1.5 bg-primary-dark hover:bg-primary-dark/90 text-white rounded-lg font-semibold transition-all text-xs font-sans"
            >
              Edit Page Content
            </a>
          </Container>
        </div>
      )}
      {/* Simple Header without Image */}
      <SimplePageHeader
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Privacy Policy", href: "/privacy-policy" }
        ]}
        title={title}
        subtitle={subtitle}
      />

      {/* Content Section */}
      <section className="pt-10 pb-20">
        <Container>
          <div
            className="max-w-4xl font-sans text-base leading-relaxed text-dark space-y-8"
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(htmlContent) }}
          />
        </Container>
      </section>
    </main>
  );
}
