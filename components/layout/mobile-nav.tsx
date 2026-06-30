"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookAppointmentButton } from "@/components/shared/book-appointment-button";

import { HiChevronDown } from "react-icons/hi2";
import { getActiveServicesListAction } from "@/app/(admin)/admin/actions";

interface ServicesDropdownItem {
  title: string;
  slug: string;
}

export function MobileNav(): React.JSX.Element {
  const [isOpen, setIsOpen] = React.useState(false);
  const [services, setServices] = React.useState<ServicesDropdownItem[]>([]);
  const [servicesOpen, setServicesOpen] = React.useState(false);
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
        <div className="absolute top-20 left-0 w-full bg-white shadow-lg border-t border-gray-100 flex flex-col p-4 gap-2 z-50 overflow-y-auto max-h-[80vh]">
          <Link
            href="/"
            className={`font-marcellus text-base p-3 rounded-lg transition-colors ${
              pathname === "/" ? "text-primary bg-primary/5" : "text-dark hover:bg-gray-50"
            }`}
            onClick={() => setIsOpen(false)}
          >
            Home
          </Link>
          
          <div className="flex flex-col">
            <button
              onClick={() => setServicesOpen(!servicesOpen)}
              className={`w-full text-left font-marcellus text-base p-3 rounded-lg transition-colors flex items-center justify-between ${
                pathname.startsWith("/services") ? "text-primary bg-primary/5" : "text-dark hover:bg-gray-50"
              }`}
            >
              <span>Services</span>
              <HiChevronDown className={`h-4 w-4 transition-transform duration-200 ${servicesOpen ? "rotate-180" : ""}`} />
            </button>
            {servicesOpen && (
              <div className="flex flex-col pl-6 gap-1 mt-1 border-l border-muted ml-4">
                <Link
                  href="/services"
                  className="font-sans text-sm p-2 text-light-ash hover:text-primary transition-colors"
                  onClick={() => {
                    setIsOpen(false);
                    setServicesOpen(false);
                  }}
                >
                  All Services
                </Link>
                {services.map((service) => (
                  <Link
                    key={service.slug}
                    href={`/services/${service.slug}`}
                    className={`font-sans text-sm p-2 transition-colors ${
                      pathname === `/services/${service.slug}` ? "text-primary font-semibold" : "text-light-ash hover:text-primary"
                    }`}
                    onClick={() => {
                      setIsOpen(false);
                      setServicesOpen(false);
                    }}
                  >
                    {service.title}
                  </Link>
                ))}
              </div>
            )}
          </div>
          <Link
            href="/training"
            className={`font-marcellus text-base p-3 rounded-lg transition-colors ${
              pathname.startsWith("/training") ? "text-primary bg-primary/5" : "text-dark hover:bg-gray-50"
            }`}
            onClick={() => setIsOpen(false)}
          >
            Training
          </Link>
          <Link
            href="/therapists"
            className={`font-marcellus text-base p-3 rounded-lg transition-colors ${
              pathname.startsWith("/therapists") ? "text-primary bg-primary/5" : "text-dark hover:bg-gray-50"
            }`}
            onClick={() => setIsOpen(false)}
          >
            Therapist
          </Link>
          <Link
            href="/support"
            className={`font-marcellus text-base p-3 rounded-lg transition-colors ${
              pathname.startsWith("/support") ? "text-primary bg-primary/5" : "text-dark hover:bg-gray-50"
            }`}
            onClick={() => setIsOpen(false)}
          >
            Support
          </Link>
          <Link
            href="/success-stories"
            className={`font-marcellus text-base p-3 rounded-lg transition-colors ${
              pathname.startsWith("/success-stories") ? "text-primary bg-primary/5" : "text-dark hover:bg-gray-50"
            }`}
            onClick={() => setIsOpen(false)}
          >
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
