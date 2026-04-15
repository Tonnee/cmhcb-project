import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

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
      <div className="container mx-auto h-full flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="relative h-9 w-9 overflow-hidden rounded">
            <Image
              src="/cmhcb-mental-health-care-logo.png"
              alt="Center for Mental Health and Care, Bangladesh Logo"
              fill
              className="object-cover"
              sizes="36px"
            />
          </div>
          <span className="font-marcellus text-base text-dark">
            CMHC, B
          </span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
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

        {/* CTA Button */}
        <Button href="/book" variant="primary" size="md">
          Book Appointment
        </Button>
      </div>
    </header>
  );
}
