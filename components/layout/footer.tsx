import * as React from "react";
import Image from "next/image";
import Link from "next/link";
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

function LogoCard(): React.JSX.Element {
  return (
    <div className="bg-white rounded-3xl shadow-sm p-7 flex flex-col gap-5 w-full lg:w-[372px] lg:min-w-[372px]">
      <div className="flex items-center gap-5">
        <div className="w-[109px] h-[109px] shrink-0 relative">
          <Image
            src="/cmhcb-mental-health-care.png"
            alt="CMHC,B - Center for Mental Health and Care, Bangladesh logo"
            fill
            sizes="109px"
            className="object-contain"
          />
        </div>
        <p className="font-marcellus text-xl text-dark">
          Center for Mental Health and Care, Bangladesh
        </p>
      </div>

      <div className="h-px bg-gray-100 w-full" />

      <address className="flex flex-col gap-4.5 not-italic">
        <div className="flex items-start gap-3 text-accent">
          <EmailIcon />
          <span className="font-sans text-base text-light-ash">
            {CONTACT_INFO.email}
          </span>
        </div>

        <div className="flex items-start gap-3 text-accent">
          <PhoneIcon />
          <span className="font-sans text-base text-light-ash">
            {CONTACT_INFO.phone}
          </span>
        </div>

        <div className="flex items-start gap-3 text-accent">
          <LocationPinIcon />
          <p className="font-sans text-base leading-relaxed text-light-ash">
            {CONTACT_INFO.address.map((line, idx) => (
              <React.Fragment key={idx}>
                {line}
                {idx < CONTACT_INFO.address.length - 1 && <br />}
              </React.Fragment>
            ))}
          </p>
        </div>
      </address>
    </div>
  );
}

function LinkColumn({ column }: { column: FooterLinkColumn }): React.JSX.Element {
  return (
    <div className="flex flex-col gap-5">
      <p className="font-marcellus text-base text-muted/70">
        {column.title}
      </p>
      <nav className="flex flex-col gap-4" aria-label={column.title}>
        {column.links.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            className={`font-sans text-sm transition-opacity hover:opacity-80 ${
              link.isHighlighted ? "text-accent" : "text-muted"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}

function ConnectColumn(): React.JSX.Element {
  return (
    <div className="flex flex-col gap-5">
      <p className="font-marcellus text-base text-muted/70">
        Connect with Us
      </p>

      <div className="flex items-center gap-4">
        {SOCIAL_LINKS.map((social: SocialLinkType) => (
          <a
            key={social.label}
            href={social.href}
            aria-label={social.label}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center text-white hover:text-accent transition-colors"
          >
            {SOCIAL_ICON_MAP[social.label]}
          </a>
        ))}
      </div>

      <nav className="flex flex-col gap-4 mt-5" aria-label="Legal links">
        {LEGAL_LINKS.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            className="font-sans text-sm text-muted hover:opacity-80 transition-opacity"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}

export function Footer(): React.JSX.Element {
  return (
    <footer className="relative mt-auto">
      {/* Dark background — offset from top to let LogoCard overlap */}
      <div className="absolute inset-x-0 bottom-0 top-[91px] bg-footer-bg" aria-hidden="true" />

      <div className="relative container">
        <div className="flex flex-col lg:flex-row items-start gap-10 lg:gap-20">
          <LogoCard />

          <div className="flex flex-wrap flex-1 gap-10 lg:gap-14 pt-0 lg:pt-[86px]">
            {FOOTER_LINK_COLUMNS.map((column, idx) => (
              <LinkColumn key={idx} column={column} />
            ))}
            <ConnectColumn />
          </div>
        </div>

        <div className="relative border-t border-white/17 mt-12" />

        <div className="relative flex flex-col sm:flex-row items-center justify-between gap-4 py-8">
          <p className="font-sans text-sm text-muted">
            CMHC,B &copy; 2025. All rights reserved.
          </p>
          <p className="font-sans text-sm text-muted">
            Designed &amp; Developed by{" "}
            <span className="text-accent">DigitalDive</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
