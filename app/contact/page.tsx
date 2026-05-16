import * as React from "react";
import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { PageHero } from "@/components/shared/page-hero";
import {
  EmailIcon,
  PhoneIcon,
  LocationPinIcon,
  FacebookIcon,
  InstagramIcon,
  TwitterXIcon,
  LinkedInIcon,
} from "@/components/layout/footer-icons";

export const metadata: Metadata = {
  title: "Contact Us | CMHCB",
  description: "Get in touch with us for any inquiries or support.",
};

export default function ContactPage(): React.JSX.Element {
  const breadcrumbs = [
    { label: "Home", href: "/" },
  ];

  return (
    <main className="bg-page-bg">
      <PageHero
        breadcrumbs={breadcrumbs}
        currentPage="Contact Us"
        title="Contact Us"
        description="We'd love to hear from you. Please reach out with any questions or inquiries."
        imageSrc="/pages-hero-background/1.png"
      />

      <Container className="py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
          
          {/* Left Column: Contact Details */}
          <div className="flex flex-col justify-center">
            <h2 className="font-marcellus text-3xl md:text-4xl text-dark mb-6">
              Get in Touch
            </h2>
            <p className="font-sans text-light-ash mb-10 leading-relaxed max-w-[500px]">
              Whether you have a question about our services, need assistance, or just want to talk, we are here for you. Reach out to us through any of the channels below.
            </p>

            <div className="flex flex-col gap-8 mb-12">
              {/* Phone */}
              <div className="flex items-start gap-5">
                <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <PhoneIcon className="w-6 h-6" />
                </div>
                <div className="pt-1">
                  <h3 className="font-bold text-dark text-lg mb-1">Phone</h3>
                  <a href="tel:+1234567890" className="font-sans text-light-ash hover:text-primary transition-colors">
                    +1 234 567 890
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-5">
                <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <EmailIcon className="w-6 h-6" />
                </div>
                <div className="pt-1">
                  <h3 className="font-bold text-dark text-lg mb-1">Email</h3>
                  <a href="mailto:info@cmhcb.com" className="font-sans text-light-ash hover:text-primary transition-colors">
                    info@cmhcb.com
                  </a>
                </div>
              </div>

              {/* Address */}
              <div className="flex items-start gap-5">
                <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <LocationPinIcon className="w-6 h-6" />
                </div>
                <div className="pt-1">
                  <h3 className="font-bold text-dark text-lg mb-1">Address</h3>
                  <p className="font-sans text-light-ash leading-relaxed">
                    123 Wellness Avenue<br />
                    Mental Health Center<br />
                    Cityville, State 12345
                  </p>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div>
              <h3 className="font-bold text-dark text-lg mb-5">Follow Us</h3>
              <div className="flex items-center gap-4 text-primary">
                <a href="#" className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center hover:bg-primary hover:text-white transition-colors" aria-label="Facebook">
                  <FacebookIcon className="w-6 h-6" />
                </a>
                <a href="#" className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center hover:bg-primary hover:text-white transition-colors" aria-label="Instagram">
                  <InstagramIcon className="w-6 h-6" />
                </a>
                <a href="#" className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center hover:bg-primary hover:text-white transition-colors" aria-label="Twitter">
                  <TwitterXIcon className="w-6 h-6" />
                </a>
                <a href="#" className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center hover:bg-primary hover:text-white transition-colors" aria-label="LinkedIn">
                  <LinkedInIcon className="w-6 h-6" />
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Google Map */}
          <div className="h-[400px] lg:h-auto min-h-[500px] rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-muted/30">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.019112484218!2d-122.39997268468233!3d37.79379097975661!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x808580647a4ba7bd%3A0x1d211cc5bb679b!2sFerry%20Building!5e0!3m2!1sen!2sus!4v1689201944123!5m2!1sen!2sus"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Google Map Location"
              className="w-full h-full"
            />
          </div>

        </div>
      </Container>
    </main>
  );
}
