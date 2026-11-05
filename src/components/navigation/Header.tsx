"use client";

import React from "react";
import Link from "next/link";
import { Compass, MapPin } from "lucide-react";

interface HeaderProps {
  userName?: string;
  areaLabel?: string;
}

export const Header: React.FC<HeaderProps> = ({
  userName = "Divya",
  areaLabel = "Sector 47, Gurugram",
}) => {
  return (
    <header className="bg-bg-card border-b border-border-light sticky top-0 z-30 px-4 py-3 sm:px-6">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link href="/shortlist" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-teal-primary text-white flex items-center justify-center font-heading font-bold text-sm lg:hidden">
            <Compass className="w-4 h-4 stroke-[2.2]" />
          </div>
          <div>
            <p className="text-sm font-heading font-bold text-text-main leading-tight">
              Hi {userName}
            </p>
            <div className="flex items-center gap-1 text-xs text-teal-text font-medium">
              <MapPin className="w-3 h-3" />
              <span>{areaLabel}</span>
            </div>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href="/settings/needs"
            className="text-xs font-semibold px-3 py-1.5 rounded-chip bg-teal-tint text-teal-text border border-teal-text/20 hover:bg-teal-primary hover:text-white transition-colors"
          >
            My Needs
          </Link>
        </div>
      </div>
    </header>
  );
};
