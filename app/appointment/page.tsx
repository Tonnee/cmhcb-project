import * as React from "react";
import { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { AppointmentForm } from "@/features/appointment/components/appointment-form";
import { PhoneIcon } from "@/components/layout/footer-icons";
import { HiUserGroup, HiClock } from "react-icons/hi2";

export const metadata: Metadata = {
  title: "Book an Appointment | CMHCB",
  description: "Take the first step toward better mental well-being. Book an appointment with our expert therapists at the Center for Mental Health and Care, Bangladesh.",
};

export default function AppointmentPage() {
  return (
    <main className="flex-1 bg-page-bg py-16 lg:py-24">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-6 items-start">
          {/* Left Side: Content */}
          <div className="lg:col-span-5 lg:sticky lg:top-32">
            <SectionHeading
              level="h1"
              subtitle="Get Started"
              title="Book an Appointment"
              align="left"
              className="mb-6"
            />
            <p className="font-sans text-lg text-light-ash leading-relaxed max-w-lg mb-10">
              Take the first step toward better mental well-being. Choose your
              preferred therapist, service, and time. Our team is here to support
              you every step of the way.
            </p>

            <div className="space-y-6">
              <div className="flex gap-6 items-center">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <HiUserGroup className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-marcellus text-lg text-dark">Expert Care</h4>
                  <p className="font-sans text-sm text-light-ash">
                    Connect with highly qualified mental health professionals.
                  </p>
                </div>
              </div>

              <div className="flex gap-6 items-center">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <HiClock className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-marcellus text-lg text-dark">Flexible Timing</h4>
                  <p className="font-sans text-sm text-light-ash">
                    Choose a time that works best for your schedule.
                  </p>
                </div>
              </div>

              <div className="flex gap-6 items-center">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 text-primary">
                  <PhoneIcon className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-marcellus text-lg text-dark">Private & Confidential</h4>
                  <p className="font-sans text-sm text-light-ash">
                    Your sessions are held in strict professional confidence.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Form */}
          <div className="lg:col-span-7">
            <AppointmentForm />
          </div>
        </div>
      </Container>
    </main>
  );
}
