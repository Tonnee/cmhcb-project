"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FOOTER_LINK_COLUMNS,
  SOCIAL_LINKS,
  LEGAL_LINKS,
  CONTACT_INFO,
} from "@/data/footer";
import type { FooterLinkColumn, SocialLink as SocialLinkType } from "@/data/footer";
import {
  EmailIcon,
  PhoneIcon,
  LocationPinIcon,
  FacebookIcon,
  InstagramIcon,
  TwitterXIcon,
  LinkedInIcon,
  YouTubeIcon,
} from "./footer-icons";

const SOCIAL_ICON_MAP: Record<string, React.JSX.Element> = {
  Facebook: <FacebookIcon />,
  Instagram: <InstagramIcon />,
  Twitter: <TwitterXIcon />,
  LinkedIn: <LinkedInIcon />,
  YouTube: <YouTubeIcon />,
};

function LinkColumn({ column }: { column: FooterLinkColumn }): React.JSX.Element {
  return (
    <div className="flex flex-col gap-6">
      <h3 className="font-marcellus text-base text-white">
        {column.title}
      </h3>
      <nav className="flex flex-col gap-6" aria-label={column.title}>
        {column.links.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            className={`font-sans text-sm transition-colors duration-200 ${link.isHighlighted
              ? "text-accent hover:text-white"
              : "text-white/60 hover:text-accent"
              }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}

export function Footer(): React.JSX.Element | null {
  const pathname = usePathname();

  if (pathname?.startsWith("/admin") || pathname === "/login" || pathname === "/forgot-password") {
    return null;
  }

  return (
    <footer className="bg-footer-bg mt-auto border-t-4 border-primary">
      <div className="container pt-20 pb-10">

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-10 gap-6 mb-20">

          {/* Brand & Mission - 3 cols */}
          <div className="lg:col-span-3 flex flex-col gap-10">
            <div className="rounded-2xl flex items-center gap-6 w-fit">
              <div className="w-[70px] h-[70px] shrink-0 relative">
                <Image
                  src="/cmhcb-mental-health-care.png"
                  alt="CMHC,B Logo"
                  fill
                  sizes="70px"
                  className="object-contain"
                />
              </div>
              <p className="font-marcellus text-lg text-white max-w-[180px] leading-tight">
                Center for Mental Health and Care, Bangladesh
              </p>
            </div>

            <p className="font-sans text-white/70 leading-relaxed max-w-[320px]">
              Empowering your mind and transforming your life with compassionate, evidence-based mental health care.
            </p>

            <div className="flex items-center gap-6 mt-2">
              {SOCIAL_LINKS.map((social: SocialLinkType) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 md:w-12 md:h-12 rounded-lg bg-white/5 text-white flex items-center justify-center hover:bg-accent hover:text-dark transition-colors"
                >
                  {SOCIAL_ICON_MAP[social.label]}
                </a>
              ))}
            </div>
          </div>

          {/* Links 1 - 2 cols */}
          <div className="lg:col-span-2 lg:ml-6">
            <LinkColumn column={FOOTER_LINK_COLUMNS[0]} />
          </div>

          {/* Links 2 - 2 cols */}
          <div className="lg:col-span-2">
            <LinkColumn column={FOOTER_LINK_COLUMNS[1]} />
          </div>

          {/* Contact - 3 cols */}
          <div className="lg:col-span-3 flex flex-col gap-6">
            <h3 className="font-marcellus text-base text-white">Contact Us</h3>
            <address className="flex flex-col gap-6 not-italic">
              <div className="flex items-start gap-6 group">
                <div className="w-11 h-11 md:w-12 md:h-12 rounded-lg bg-white/5 text-white flex items-center justify-center shrink-0 group-hover:bg-accent group-hover:text-dark transition-colors">
                  <LocationPinIcon />
                </div>
                <div className="pt-1 md:pt-1.5">
                  <p className="font-sans text-sm leading-relaxed text-white/70 transition-colors">
                    {CONTACT_INFO.address.map((line, idx) => (
                      <React.Fragment key={idx}>
                        {line}
                        {idx < CONTACT_INFO.address.length - 1 && <br />}
                      </React.Fragment>
                    ))}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-6 group">
                <div className="w-11 h-11 md:w-12 md:h-12 rounded-lg bg-white/5 text-white flex items-center justify-center shrink-0 group-hover:bg-accent group-hover:text-dark transition-colors">
                  <PhoneIcon />
                </div>
                <a href={`tel:${CONTACT_INFO.phone}`} className="font-sans text-sm text-white/70 group-hover:text-accent transition-colors">
                  {CONTACT_INFO.phone}
                </a>
              </div>

              <div className="flex items-center gap-6 group">
                <div className="w-11 h-11 md:w-12 md:h-12 rounded-lg bg-white/5 text-white flex items-center justify-center shrink-0 group-hover:bg-accent group-hover:text-dark transition-colors">
                  <EmailIcon />
                </div>
                <a href={`mailto:${CONTACT_INFO.email}`} className="font-sans text-sm text-white/70 group-hover:text-accent transition-colors">
                  {CONTACT_INFO.email}
                </a>
              </div>
            </address>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col lg:flex-row items-center justify-between gap-6">
          <nav className="flex flex-wrap items-center justify-center lg:justify-start gap-x-8 gap-y-4" aria-label="Legal links">
            {LEGAL_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="font-sans text-sm text-white/60 hover:text-accent transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-6 text-sm text-white/50 font-sans">
            <p>CMHC,B &copy; {new Date().getFullYear()}. All rights reserved.</p>
            <span className="hidden sm:inline text-white/20">|</span>
            <p>Designed &amp; Developed by <span className="text-accent font-medium">DigitalDive</span></p>
          </div>
        </div>

      </div>
    </footer>
  );
}

