import * as React from "react";
import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { SimplePageHeader } from "@/components/shared/simple-page-header";

export const metadata: Metadata = {
  title: "Terms of Service | CMHCB",
  description: "Terms and conditions for using the services provided by CMHCB.",
};

export default function TermsOfServicePage(): React.JSX.Element {
  return (
    <main>
      {/* Simple Header without Image */}
      <SimplePageHeader
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Terms of Service", href: "/terms" }
        ]}
        title="Terms of Service"
        subtitle="Last Updated: May 2026"
      />

      {/* Content Section */}
      <section className="pt-10 pb-20">
        <Container>
          <div className="max-w-4xl font-sans text-base leading-relaxed text-dark space-y-8">
            <p>
              Welcome to the Center for Mental Health and Care Bangladesh (CMHCB). By accessing our website, booking an appointment, or utilizing our services, you agree to comply with and be bound by the following Terms of Service. Please read these terms carefully before engaging with our platform.
            </p>

            <div>
              <h2 className="font-marcellus text-2xl text-primary-dark mb-4 mt-8">1. Medical Disclaimer</h2>
              <p className="mb-4">
                <strong>Not a Substitute for Emergency Services:</strong> The content on this website and our digital platforms is for informational purposes only and is not intended to substitute for professional medical advice, diagnosis, or treatment.
              </p>
              <p>
                If you are experiencing a medical emergency, acute psychological crisis, or having suicidal thoughts, please call emergency services immediately or visit the nearest hospital. CMHCB&apos;s online platforms do not provide crisis intervention services.
              </p>
            </div>

            <div>
              <h2 className="font-marcellus text-2xl text-primary-dark mb-4 mt-8">2. Use of Services</h2>
              <p className="mb-4">When booking and attending therapy sessions with CMHCB, you agree that:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>All information you provide during registration is accurate, current, and complete.</li>
                <li>You will maintain appropriate and respectful behavior toward all CMHCB staff and practitioners.</li>
                <li>Therapists reserve the right to terminate a session or deny service if the environment is deemed unsafe or if policies are repeatedly violated.</li>
              </ul>
            </div>

            <div>
              <h2 className="font-marcellus text-2xl text-primary-dark mb-4 mt-8">3. Appointments and Cancellations</h2>
              <p className="mb-4">
                We value the time of both our clients and practitioners. Our cancellation policy is as follows:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Appointments must be canceled or rescheduled at least 24 hours in advance.</li>
                <li>Late cancellations or missed appointments (&quot;no-shows&quot;) may be subject to a cancellation fee.</li>
                <li>Consistent no-shows may result in the inability to book future appointments.</li>
              </ul>
            </div>

            <div>
              <h2 className="font-marcellus text-2xl text-primary-dark mb-4 mt-8">4. Payments and Billing</h2>
              <p>
                Fees for our therapeutic and counseling services are due at the time of service, unless alternative billing arrangements have been agreed upon in advance. We accept various forms of payment. By providing payment information, you authorize us to charge the applicable fees for the services rendered.
              </p>
            </div>

            <div>
              <h2 className="font-marcellus text-2xl text-primary-dark mb-4 mt-8">5. Intellectual Property</h2>
              <p>
                All content, materials, blogs, graphics, and logos on this website are the intellectual property of CMHCB. They may not be reproduced, distributed, or utilized for commercial purposes without our explicit written permission.
              </p>
            </div>

            <div>
              <h2 className="font-marcellus text-2xl text-primary-dark mb-4 mt-8">6. Limitation of Liability</h2>
              <p>
                To the fullest extent permitted by applicable law, CMHCB and its practitioners shall not be liable for any indirect, incidental, or consequential damages resulting from the use or inability to use our services or website.
              </p>
            </div>

            <div>
              <h2 className="font-marcellus text-2xl text-primary-dark mb-4 mt-8">7. Changes to Terms</h2>
              <p>
                We reserve the right to modify these Terms of Service at any time. Any changes will be posted on this page with an updated revision date. Continued use of our services following any modifications constitutes acceptance of the new terms.
              </p>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}
