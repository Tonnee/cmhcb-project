"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { HiArrowUp } from "react-icons/hi2";

export function ScrollToTop(): React.JSX.Element | null {
  const [isVisible, setIsVisible] = React.useState(false);
  const pathname = usePathname();

  React.useEffect(() => {
    const handleScroll = () => {
      // Find the hero section or first main section on the page
      const hero = document.querySelector("section") || document.querySelector("[class*='hero']");
      const threshold = hero ? hero.getBoundingClientRect().height : 400;

      // Only show the button after scrolling past the hero height (min 300px)
      if (window.scrollY > Math.max(threshold, 300)) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Run initially
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [pathname]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Exclude admin dashboard and authentication pages
  if (pathname?.startsWith("/admin") || pathname === "/login" || pathname === "/forgot-password") {
    return null;
  }

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-6 right-6 lg:bottom-8 lg:right-8 z-50 p-3.5 rounded-full bg-primary text-white shadow-[0_8px_30px_rgba(8,115,5,0.35)] border border-white/10 transition-all duration-300 transform hover:bg-primary-dark hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 hover:shadow-[0_8px_30px_rgba(3,83,0,0.5)] cursor-pointer group ${
        isVisible
          ? "opacity-100 translate-y-0 scale-100 pointer-events-auto"
          : "opacity-0 translate-y-10 scale-75 pointer-events-none"
      }`}
      aria-label="Scroll to top"
    >
      <HiArrowUp className="w-5 h-5 transition-transform duration-300 group-hover:-translate-y-0.5" />
    </button>
  );
}
