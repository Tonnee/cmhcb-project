import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { BookAppointmentButton } from "@/components/shared/book-appointment-button";
import { MobileNav } from "./mobile-nav";
import { Container } from "@/components/layout/container";

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

export function Header(): React.JSX.Element {
  return (
    <header className="bg-white h-20 w-full sticky top-0 z-50 shadow-sm">
      <Container className="lg:px-8 h-full flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/cmhcb-mental-health-care.png"
            alt="Center for Mental Health and Care, Bangladesh Logo"
            width={36}
            height={36}
            className="w-auto h-9 object-contain"
          />
          <span className="font-marcellus text-base text-dark">
            CMHC, B
          </span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden lg:flex items-center gap-5">
          <NavLink href="/" active>
            Home
          </NavLink>

          {/* Services Dropdown (using CSS hover instead of state) */}
          <div className="group relative py-6">
            <Link
              href="/services"
              className="font-marcellus text-base text-dark flex items-center gap-1 transition-colors group-hover:text-primary"
            >
              Services
              <svg className="h-4 w-4 transition-transform group-hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </Link>
            
            <div className="absolute top-full left-0 mt-0 w-48 rounded-lg bg-white shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border border-gray-100 overflow-hidden">
              <Link
                href="/services/1"
                className="block px-4 py-3 hover:bg-gray-50 text-dark font-marcellus transition-colors text-sm"
              >
                Service 1
              </Link>
              <Link
                href="/services/2"
                className="block px-4 py-3 hover:bg-gray-50 text-dark font-marcellus transition-colors text-sm"
              >
                Service 2
              </Link>
              <Link
                href="/services/3"
                className="block px-4 py-3 hover:bg-gray-50 text-dark font-marcellus transition-colors text-sm"
              >
                Service 3
              </Link>
            </div>
          </div>

          {/* Training Dropdown */}
          <div className="group relative py-6">
            <Link
              href="/training"
              className="font-marcellus text-base text-dark flex items-center gap-1 transition-colors group-hover:text-primary"
            >
              Training
              <svg className="h-4 w-4 transition-transform group-hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </Link>
            
            <div className="absolute top-full left-0 mt-0 w-48 rounded-lg bg-white shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border border-gray-100 overflow-hidden">
              <Link
                href="/training/1"
                className="block px-4 py-3 hover:bg-gray-50 text-dark font-marcellus transition-colors text-sm"
              >
                Training 1
              </Link>
              <Link
                href="/training/2"
                className="block px-4 py-3 hover:bg-gray-50 text-dark font-marcellus transition-colors text-sm"
              >
                Training 2
              </Link>
              <Link
                href="/training/3"
                className="block px-4 py-3 hover:bg-gray-50 text-dark font-marcellus transition-colors text-sm"
              >
                Training 3
              </Link>
            </div>
          </div>

          <NavLink href="/therapist">Therapist</NavLink>
          <NavLink href="/support">Support</NavLink>
          <NavLink href="/success-stories">
            Success Stories
          </NavLink>
        </nav>

        {/* Right Actions: Desktop CTA & Mobile Menu Toggle */}
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
