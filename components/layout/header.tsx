"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { BookAppointmentButton } from "@/components/shared/book-appointment-button";
import { MobileNav } from "./mobile-nav";
import { Container } from "@/components/layout/container";
import { SERVICES } from "@/features/services/data/services";
import { TRAININGS } from "@/features/training/data/trainings";

// ---------------------------------------------------------------------------
// Service icons – simple SVG paths keyed by slug so each card feels distinct.
// ---------------------------------------------------------------------------
const SERVICE_ICONS: Record<string, React.ReactNode> = {
  "psychometric-assessment": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
    </svg>
  ),
  "individual-therapy": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
  ),
  "child-therapy": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
    </svg>
  ),
  "family-therapy": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
    </svg>
  ),
  "couple-therapy": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
    </svg>
  ),
  "iq-test": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
    </svg>
  ),
};

// ---------------------------------------------------------------------------
// Training icons
// ---------------------------------------------------------------------------
const TRAINING_ICONS: Record<string, React.ReactNode> = {
  "psychological-first-aid": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.315 48.315 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
    </svg>
  ),
  "anger-management": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.601a8.983 8.983 0 013.361-6.866 8.21 8.21 0 003 2.48z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z" />
    </svg>
  ),
  "stress-management": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 7.756a4.5 4.5 0 100 8.488M7.5 10.5h5.25m-5.25 3h5.25M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  "relaxation": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
    </svg>
  ),
  "helping-children-self-confidence": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
    </svg>
  ),
  "managing-childrens-misbehavior": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
    </svg>
  ),
};

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  active?: boolean;
}

function NavLink({ href, children, active }: NavLinkProps) {
  return (
    <Link
      href={href}
      className={`font-marcellus text-base flex items-center gap-1 transition-colors hover:text-primary ${
        active ? "text-primary" : "text-dark"
      }`}
    >
      {children}
    </Link>
  );
}

// ---------------------------------------------------------------------------
// Services Mega Menu
// ---------------------------------------------------------------------------

function ServicesMegaMenu({ active }: { active?: boolean }) {
  const [open, setOpen] = React.useState(false);
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const pathname = usePathname();

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setOpen(false), 120);
  };

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Trigger */}
      <Link
        href="/services"
        className={`font-marcellus text-base flex items-center gap-1 transition-colors ${
          open || active ? "text-primary" : "text-dark hover:text-primary"
        }`}
        id="services-menu-trigger"
        aria-haspopup="true"
        aria-expanded={open}
      >
        Services
        <svg
          className={`h-4 w-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </Link>

      {/* Full-width mega panel */}
      {open && (
        <div
          className="fixed left-0 top-20 w-screen bg-white shadow-2xl border-t-2 border-primary z-50"
          role="menu"
          aria-labelledby="services-menu-trigger"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <Container className="lg:px-8 py-8">
            {/* Header row */}
            <div className="flex items-end justify-between mb-6">
              <div>
                <p className="text-xs font-sans font-semibold tracking-widest uppercase text-primary mb-1">
                  Our Services
                </p>
                <h2 className="font-marcellus text-xl text-dark">
                  What can we help you with?
                </h2>
              </div>
              <Link
                href="/services"
                className="text-sm font-sans text-primary hover:text-primary-dark underline-offset-2 hover:underline transition-colors"
                onClick={() => setOpen(false)}
              >
                View all services →
              </Link>
            </div>

            {/* Service cards grid */}
            <ul
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3"
              role="list"
            >
              {SERVICES.map((service) => (
                <li key={service.slug} role="none">
                  <Link
                    href={`/services/${service.slug}`}
                    role="menuitem"
                    onClick={() => setOpen(false)}
                    className={`group flex flex-col gap-3 p-4 rounded-xl border transition-all duration-200 h-full ${
                      pathname === `/services/${service.slug}`
                        ? "border-primary/30 bg-primary/5"
                        : "border-transparent hover:border-primary/20 hover:bg-primary/5"
                    }`}
                  >
                    {/* Icon */}
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-200">
                      {SERVICE_ICONS[service.slug] ?? (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      )}
                    </span>

                    {/* Title */}
                    <span className={`font-marcellus text-sm transition-colors leading-snug ${
                      pathname === `/services/${service.slug}` ? "text-primary" : "text-dark group-hover:text-primary"
                    }`}>
                      {service.title}
                    </span>

                    {/* Meta */}
                    <span className="text-xs font-sans text-light-ash mt-auto">
                      {service.duration} · {service.fees}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>

            {/* Bottom CTA strip */}
            <div className="mt-6 pt-5 border-t border-gray-100 flex items-center justify-between">
              <p className="text-sm font-sans text-light-ash">
                Not sure which service is right for you?{" "}
                <Link href="/support" className="text-primary hover:underline" onClick={() => setOpen(false)}>
                  Talk to us
                </Link>
              </p>
              <div onClick={() => setOpen(false)}>
                <BookAppointmentButton />
              </div>
            </div>
          </Container>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Training Mega Menu
// ---------------------------------------------------------------------------

function TrainingMegaMenu({ active }: { active?: boolean }) {
  const [open, setOpen] = React.useState(false);
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const pathname = usePathname();

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setOpen(false), 120);
  };

  return (
    <div
      className="relative py-6"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Trigger */}
      <Link
        href="/training"
        className={`font-marcellus text-base flex items-center gap-1 transition-colors ${
          open || active ? "text-primary" : "text-dark hover:text-primary"
        }`}
        id="training-menu-trigger"
        aria-haspopup="true"
        aria-expanded={open}
      >
        Training
        <svg
          className={`h-4 w-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </Link>

      {/* Full-width mega panel */}
      {open && (
        <div
          className="fixed left-0 top-20 w-screen bg-white shadow-2xl border-t-2 border-primary z-50"
          role="menu"
          aria-labelledby="training-menu-trigger"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <Container className="lg:px-8 py-8">
            {/* Header row */}
            <div className="flex items-end justify-between mb-6">
              <div>
                <p className="text-xs font-sans font-semibold tracking-widest uppercase text-primary mb-1">
                  Our Training
                </p>
                <h2 className="font-marcellus text-xl text-dark">
                  Professional development and skills
                </h2>
              </div>
              <Link
                href="/training"
                className="text-sm font-sans text-primary hover:text-primary-dark underline-offset-2 hover:underline transition-colors"
                onClick={() => setOpen(false)}
              >
                View all training →
              </Link>
            </div>

            {/* Training cards grid */}
            <ul
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3"
              role="list"
            >
              {TRAININGS.slice(0, 6).map((training) => (
                <li key={training.slug} role="none">
                  <Link
                    href={`/training/${training.slug}`}
                    role="menuitem"
                    onClick={() => setOpen(false)}
                    className={`group flex flex-col gap-3 p-4 rounded-xl border transition-all duration-200 h-full ${
                      pathname === `/training/${training.slug}`
                        ? "border-primary/30 bg-primary/5"
                        : "border-transparent hover:border-primary/20 hover:bg-primary/5"
                    }`}
                  >
                    {/* Icon */}
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-200">
                      {TRAINING_ICONS[training.slug] ?? (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      )}
                    </span>

                    {/* Title */}
                    <span className={`font-marcellus text-sm transition-colors leading-snug ${
                      pathname === `/training/${training.slug}` ? "text-primary" : "text-dark group-hover:text-primary"
                    }`}>
                      {training.title}
                    </span>

                    {/* Meta */}
                    <span className="text-xs font-sans text-light-ash mt-auto">
                      {training.duration} · {training.fees}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>

            {/* Bottom CTA strip */}
            <div className="mt-6 pt-5 border-t border-gray-100 flex items-center justify-between">
              <p className="text-sm font-sans text-light-ash">
                Looking for corporate or group training?{" "}
                <Link href="/contact" className="text-primary hover:underline" onClick={() => setOpen(false)}>
                  Contact us
                </Link>
              </p>
            </div>
          </Container>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Header
// ---------------------------------------------------------------------------

export function Header(): React.JSX.Element {
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`bg-page-bg h-20 w-full sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white border-b border-black/5" : "border-b border-transparent"
      }`}
    >
      <Container className="h-full flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/cmhcb-mental-health-care.png"
            alt="Center for Mental Health and Care, Bangladesh Logo"
            width={36}
            height={36}
            className="w-auto h-9 object-contain"
          />
          <span className="font-marcellus text-base text-dark">CMHC, B</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-7" aria-label="Main navigation">
          <HeaderLinks />
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-5">
          <div className="hidden lg:block">
            <BookAppointmentButton />
          </div>
          <MobileNav />
        </div>
      </Container>
    </header>
  );
}

function HeaderLinks() {
  const pathname = usePathname();

  return (
    <>
      <NavLink href="/" active={pathname === "/"}>Home</NavLink>
      <ServicesMegaMenu active={pathname.startsWith("/services")} />
      <TrainingMegaMenu active={pathname.startsWith("/training")} />
      <NavLink href="/therapist" active={pathname.startsWith("/therapist")}>Therapist</NavLink>
      <NavLink href="/support" active={pathname.startsWith("/support")}>Support</NavLink>
      <NavLink href="/success-stories" active={pathname.startsWith("/success-stories")}>Success Stories</NavLink>
    </>
  );
}

