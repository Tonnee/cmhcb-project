"use client";

import * as React from "react";
import Image from "next/image";
import { HiBars3 } from "react-icons/hi2";

interface AdminMobileHeaderProps {
  onMenuClick: () => void;
}

export default function AdminMobileHeader({
  onMenuClick,
}: AdminMobileHeaderProps): React.JSX.Element {
  return (
    <header className="lg:hidden w-full bg-white border-b border-muted px-6 py-4 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      {/* Brand Logo and Title */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 relative">
          <Image
            src="/cmhcb-mental-health-care.png"
            alt="CMHC,B Logo"
            fill
            sizes="32px"
            className="object-contain"
          />
        </div>
        <div className="flex flex-col">
          <span className="font-marcellus text-sm text-dark-green leading-tight font-bold">
            CMHC,B
          </span>
          <span className="font-sans text-[10px] text-light-ash">
            Admin Portal
          </span>
        </div>
      </div>

      {/* Hamburger Toggle Button */}
      <button
        type="button"
        onClick={onMenuClick}
        className="p-2 text-light-ash hover:bg-light/30 hover:text-dark rounded-xl transition-all cursor-pointer border border-muted/60"
        aria-label="Open navigation sidebar"
      >
        <HiBars3 className="w-6 h-6" />
      </button>
    </header>
  );
}
