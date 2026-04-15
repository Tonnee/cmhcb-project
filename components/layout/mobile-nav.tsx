"use client";

import * as React from "react";
import Link from "next/link";
import { BookAppointmentButton } from "@/components/shared/book-appointment-button";

export function MobileNav(): React.JSX.Element {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="lg:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-dark focus:outline-none rounded-md hover:bg-gray-100 transition-colors"
        aria-label="Toggle menu"
        aria-expanded={isOpen}
      >
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
          {isOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-20 left-0 w-full bg-white shadow-lg border-t border-gray-100 flex flex-col p-4 gap-2 z-50">
          <Link href="/" className="font-marcellus text-base text-dark p-3 hover:bg-gray-50 rounded-lg transition-colors" onClick={() => setIsOpen(false)}>
            Home
          </Link>
          <Link href="/services" className="font-marcellus text-base text-dark p-3 hover:bg-gray-50 rounded-lg transition-colors" onClick={() => setIsOpen(false)}>
            Services
          </Link>
          <Link href="/training" className="font-marcellus text-base text-dark p-3 hover:bg-gray-50 rounded-lg transition-colors" onClick={() => setIsOpen(false)}>
            Training
          </Link>
          <Link href="/therapist" className="font-marcellus text-base text-dark p-3 hover:bg-gray-50 rounded-lg transition-colors" onClick={() => setIsOpen(false)}>
            Therapist
          </Link>
          <Link href="/support" className="font-marcellus text-base text-dark p-3 hover:bg-gray-50 rounded-lg transition-colors" onClick={() => setIsOpen(false)}>
            Support
          </Link>
          <Link href="/success-stories" className="font-marcellus text-base text-dark p-3 hover:bg-gray-50 rounded-lg transition-colors" onClick={() => setIsOpen(false)}>
            Success Stories
          </Link>
          <div className="mt-2 pt-4 border-t border-gray-100">
            <BookAppointmentButton className="w-full justify-center" />
          </div>
        </div>
      )}
    </div>
  );
}
