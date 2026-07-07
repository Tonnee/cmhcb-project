"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  HiSquares2X2,
  HiUsers,
  HiCalendarDays,
  HiAcademicCap,
  HiBookOpen,
  HiArrowLeft,
  HiGlobeAlt,
  HiBriefcase,
  HiArrowRightOnRectangle,
  HiUserCircle,
  HiShieldCheck,
  HiBookmark,
  HiDocumentText,
  HiChevronDown,
  HiChevronUp
} from "react-icons/hi2";
import { signOutAction } from "@/app/auth/actions";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const NAV_ITEMS: NavItem[] = [
  {
    label: "Overview",
    href: "/admin",
    icon: HiSquares2X2,
  },
  {
    label: "Landing Page",
    href: "/admin/landing-page",
    icon: HiGlobeAlt,
  },
  {
    label: "Services",
    href: "/admin/services",
    icon: HiBriefcase,
  },
  {
    label: "Trainings",
    href: "/admin/trainings",
    icon: HiBookmark,
  },
  {
    label: "Therapists",
    href: "/admin/therapists",
    icon: HiUsers,
  },
  {
    label: "Appointments",
    href: "/admin/appointments",
    icon: HiCalendarDays,
  },
  {
    label: "Events & Workshops",
    href: "/admin/workshops",
    icon: HiAcademicCap,
  },
  {
    label: "Blogs",
    href: "/admin/blogs",
    icon: HiBookOpen,
  },
  {
    label: "Admins",
    href: "/admin/admins",
    icon: HiShieldCheck,
  },
];

const OTHER_PAGES = [
  { label: "About Us", href: "/admin/pages/about" },
  { label: "Contact Us", href: "/admin/pages/contact" },
  { label: "FAQ", href: "/admin/pages/faq" },
  { label: "Success Stories", href: "/admin/pages/success-stories" },
  { label: "Support", href: "/admin/pages/support" },
  { label: "Affiliation Program", href: "/admin/pages/affiliation" },
  { label: "Privacy Policy", href: "/admin/pages/privacy-policy" },
  { label: "Terms & Conditions", href: "/admin/pages/terms" },
];

interface AdminSidebarProps {
  adminEmail: string;
}

export default function AdminSidebar({ adminEmail }: AdminSidebarProps): React.JSX.Element {
  const pathname = usePathname();
  const [isPagesOpen, setIsPagesOpen] = React.useState(() =>
    pathname?.startsWith("/admin/pages") || false
  );

  const isAnyPageActive = pathname?.startsWith("/admin/pages");

  return (
    <aside className="w-64 md:w-72 bg-white border-r border-muted h-screen sticky top-0 flex flex-col justify-between shrink-0 overflow-y-auto">
      <div className="flex flex-col gap-8 p-6">
        {/* Brand Header */}
        <div className="flex items-center gap-3 pb-6 border-b border-muted">
          <div className="w-10 h-10 shrink-0 relative">
            <Image
              src="/cmhcb-mental-health-care.png"
              alt="CMHC,B Logo"
              fill
              sizes="40px"
              className="object-contain"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-marcellus text-base text-dark-green leading-tight font-bold">
              CMHC,B
            </span>
            <span className="font-sans text-xs text-light-ash">
              Admin Portal
            </span>
          </div>
        </div>

        {/* Navigation Section */}
        <nav className="flex flex-col gap-1.5" aria-label="Admin sidebar navigation">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            // Matches exact path for overview, or starts with for subroutes
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname?.startsWith(item.href) && !pathname?.startsWith("/admin/pages");

            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-sans ${
                  isActive
                    ? "bg-primary/10 text-primary-dark font-semibold shadow-sm"
                    : "text-light-ash hover:bg-light/30 hover:text-dark"
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? "text-primary" : "text-light-ash/80"}`} />
                {item.label}
              </Link>
            );
          })}

          {/* Collapsible Dropdown for Other Pages */}
          <div className="flex flex-col">
            <button
              type="button"
              onClick={() => setIsPagesOpen(!isPagesOpen)}
              className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 text-sm font-sans w-full text-left cursor-pointer ${
                isAnyPageActive
                  ? "bg-primary/5 text-primary-dark font-medium"
                  : "text-light-ash hover:bg-light/30 hover:text-dark"
              }`}
            >
              <div className="flex items-center gap-3">
                <HiDocumentText className={`w-5 h-5 ${isAnyPageActive ? "text-primary" : "text-light-ash/80"}`} />
                <span>Other Pages</span>
              </div>
              {isPagesOpen ? (
                <HiChevronUp className="w-4 h-4 text-light-ash/80" />
              ) : (
                <HiChevronDown className="w-4 h-4 text-light-ash/80" />
              )}
            </button>

            {isPagesOpen && (
              <div className="flex flex-col gap-1.5 pl-9 mt-1 border-l border-muted ml-6">
                {OTHER_PAGES.map((page) => {
                  const isActivePage = pathname === page.href;
                  return (
                    <Link
                      key={page.label}
                      href={page.href}
                      className={`px-3 py-2 rounded-lg text-xs font-sans transition-all duration-150 ${
                        isActivePage
                          ? "text-primary-dark font-semibold bg-primary/5"
                          : "text-light-ash hover:text-dark hover:bg-light/20"
                      }`}
                    >
                      {page.label}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </nav>
      </div>

      {/* Sidebar Footer with Profile & Sign Out */}
      <div className="p-4 border-t border-muted flex flex-col gap-2 bg-light/10">
        <div className="flex items-center gap-3 px-4 py-2">
          <HiUserCircle className="w-8 h-8 text-light-ash/60 shrink-0" />
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] text-light-ash/70 font-sans font-medium uppercase tracking-wider">Signed in as</span>
            <span className="text-xs font-semibold text-dark truncate font-sans" title={adminEmail}>
              {adminEmail}
            </span>
          </div>
        </div>

        <form action={signOutAction}>
          <button
            type="submit"
            className="flex w-full items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-sans text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-200 cursor-pointer font-medium"
          >
            <HiArrowRightOnRectangle className="w-5 h-5 shrink-0" />
            Sign Out
          </button>
        </form>

        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-sans text-light-ash hover:bg-light/30 hover:text-dark transition-all duration-200 mt-1"
        >
          <HiArrowLeft className="w-5 h-5 text-light-ash/80 shrink-0" />
          Back to Main Site
        </Link>
      </div>
    </aside>
  );
}
