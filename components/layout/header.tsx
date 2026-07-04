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
import {
  HiClipboardDocumentCheck,
  HiUser,
  HiSparkles,
  HiUsers,
  HiHeart,
  HiPuzzlePiece,
  HiPlusCircle,
  HiFaceFrown,
  HiArrowsPointingOut,
  HiSun,
  HiStar,
  HiHandRaised,
  HiChevronDown,
  HiPlus
} from "react-icons/hi2";

// ---------------------------------------------------------------------------
// Service icons – simple SVG paths keyed by slug so each card feels distinct.
// ---------------------------------------------------------------------------
const SERVICE_ICONS: Record<string, React.ReactNode> = {
  "psychometric-assessment": <HiClipboardDocumentCheck className="w-6 h-6" />,
  "individual-therapy": <HiUser className="w-6 h-6" />,
  "child-therapy": <HiSparkles className="w-6 h-6" />,
  "family-therapy": <HiUsers className="w-6 h-6" />,
  "couple-therapy": <HiHeart className="w-6 h-6" />,
  "iq-test": <HiPuzzlePiece className="w-6 h-6" />,
};

// ---------------------------------------------------------------------------
// Training icons
// ---------------------------------------------------------------------------
const TRAINING_ICONS: Record<string, React.ReactNode> = {
  "psychological-first-aid": <HiPlusCircle className="w-6 h-6" />,
  "anger-management": <HiFaceFrown className="w-6 h-6" />,
  "stress-management": <HiArrowsPointingOut className="w-6 h-6" />,
  "relaxation": <HiSun className="w-6 h-6" />,
  "helping-children-self-confidence": <HiStar className="w-6 h-6" />,
  "managing-childrens-misbehavior": <HiHandRaised className="w-6 h-6" />,
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
      className={`font-marcellus text-base flex items-center gap-1 transition-colors hover:text-primary ${active ? "text-primary" : "text-dark"
        }`}
    >
      {children}
    </Link>
  );
}

// ---------------------------------------------------------------------------
// Services Mega Menu
// ---------------------------------------------------------------------------

import * as HiIcons from "react-icons/hi2";
import { getActiveServicesListAction } from "@/app/(admin)/admin/actions";

function renderIconByName(name: string): React.ReactNode {
  const IconComponent = (HiIcons as any)[name];
  if (!IconComponent) {
    return <HiIcons.HiPlus className="w-6 h-6" />;
  }
  return <IconComponent className="w-6 h-6" />;
}

interface ServicesDropdownItem {
  title: string;
  slug: string;
  icon: string;
  duration: string | null;
  fees: string | null;
}

function ServicesMegaMenu({ active }: { active?: boolean }) {
  const [open, setOpen] = React.useState(false);
  const [services, setServices] = React.useState<ServicesDropdownItem[]>([]);
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const pathname = usePathname();

  React.useEffect(() => {
    async function load() {
      const res = await getActiveServicesListAction();
      if (res.success && res.data) {
        setServices(res.data);
      }
    }
    load();
  }, []);

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
        className={`font-marcellus text-base flex items-center gap-1 transition-colors ${open || active ? "text-primary" : "text-dark hover:text-primary"
          }`}
        id="services-menu-trigger"
        aria-haspopup="true"
        aria-expanded={open}
      >
        Services
        <HiChevronDown className={`h-4 w-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`} aria-hidden="true" />
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
                className="text-sm font-sans text-primary hover:text-accent underline-offset-2 transition-colors"
                onClick={() => setOpen(false)}
              >
                View all services →
              </Link>
            </div>

            {/* Service cards grid */}
            <ul
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6"
              role="list"
            >
              {services.map((service) => (
                <li key={service.slug} role="none">
                  <Link
                    href={`/services/${service.slug}`}
                    role="menuitem"
                    onClick={() => setOpen(false)}
                    className={`group flex flex-col gap-3 p-4 rounded-xl border transition-all duration-200 h-full ${pathname === `/services/${service.slug}`
                      ? "border-primary/30 bg-primary/5"
                      : "border-transparent hover:border-primary/20 hover:bg-primary/5"
                      }`}
                  >
                    {/* Icon */}
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-200">
                      {renderIconByName(service.icon)}
                    </span>

                    {/* Title */}
                    <span className={`font-marcellus text-sm transition-colors leading-snug ${pathname === `/services/${service.slug}` ? "text-primary" : "text-dark group-hover:text-primary"
                      }`}>
                      {service.title}
                    </span>

                    {/* Meta */}
                    <span className="text-xs font-sans text-light-ash mt-auto">
                      {service.duration && service.fees
                        ? `${service.duration} / ${service.fees}`
                        : service.duration || service.fees || "Professional Care"}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>

            {/* Bottom CTA strip */}
            <div className="mt-6 pt-5 border-t border-gray-100 flex items-center justify-between">
              <p className="text-sm font-sans text-light-ash">
                Not sure which service is right for you?{" "}
                <Link href="/support" className="text-primary hover:text-accent" onClick={() => setOpen(false)}>
                  Talk to us
                </Link>
              </p>
              <div onClick={() => setOpen(false)}>
                <BookAppointmentButton variant="primary" />
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
        className={`font-marcellus text-base flex items-center gap-1 transition-colors ${open || active ? "text-primary" : "text-dark hover:text-primary"
          }`}
        id="training-menu-trigger"
        aria-haspopup="true"
        aria-expanded={open}
      >
        Training
        <HiChevronDown className={`h-4 w-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`} aria-hidden="true" />
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
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6"
              role="list"
            >
              {TRAININGS.slice(0, 6).map((training) => (
                <li key={training.slug} role="none">
                  <Link
                    href={`/training/${training.slug}`}
                    role="menuitem"
                    onClick={() => setOpen(false)}
                    className={`group flex flex-col gap-3 p-4 rounded-xl border transition-all duration-200 h-full ${pathname === `/training/${training.slug}`
                      ? "border-primary/30 bg-primary/5"
                      : "border-transparent hover:border-primary/20 hover:bg-primary/5"
                      }`}
                  >
                    {/* Icon */}
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-200">
                      {TRAINING_ICONS[training.slug] ?? <HiPlus className="w-6 h-6" />}
                    </span>

                    {/* Title */}
                    <span className={`font-marcellus text-sm transition-colors leading-snug ${pathname === `/training/${training.slug}` ? "text-primary" : "text-dark group-hover:text-primary"
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

export function Header(): React.JSX.Element | null {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (pathname?.startsWith("/admin") || pathname === "/login" || pathname === "/forgot-password") {
    return null;
  }

  return (
    <header
      className={`bg-page-bg h-20 w-full sticky top-0 z-50 transition-all duration-300 ${isScrolled ? "bg-white border-b border-black/5" : "border-b border-transparent"
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
        <div className="flex items-center gap-6">
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
      <NavLink href="/therapists" active={pathname.startsWith("/therapists")}>Therapist</NavLink>
      <NavLink href="/support" active={pathname.startsWith("/support")}>Support</NavLink>
      <NavLink href="/success-stories" active={pathname.startsWith("/success-stories")}>Success Stories</NavLink>
    </>
  );
}

