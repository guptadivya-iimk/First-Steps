"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ListFilter,
  Columns3,
  CalendarCheck,
  SlidersHorizontal,
  Compass,
  ShieldCheck,
  User,
} from "lucide-react";

export const DesktopSidebar: React.FC = () => {
  const pathname = usePathname();

  const navItems = [
    {
      label: "Shortlist",
      href: "/shortlist",
      icon: ListFilter,
      active: pathname === "/shortlist" || pathname.startsWith("/school"),
    },
    {
      label: "Compare",
      href: "/compare",
      icon: Columns3,
      active: pathname === "/compare",
    },
    {
      label: "Visits & Pipeline",
      href: "/visits",
      icon: CalendarCheck,
      active: pathname.startsWith("/visits"),
    },
    {
      label: "My Needs & Weights",
      href: "/settings/needs",
      icon: SlidersHorizontal,
      active: pathname === "/settings/needs",
    },
    {
      label: "Account & Data",
      href: "/settings",
      icon: User,
      active: pathname === "/settings",
    },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-bg-card border-r border-border-light h-screen sticky top-0 p-5 z-30">
      {/* Brand Header */}
      <div className="flex items-center gap-2.5 pb-6 border-b border-border-light">
        <div className="w-9 h-9 rounded-xl bg-teal-primary text-white flex items-center justify-center font-heading font-bold text-lg shadow-sm">
          <Compass className="w-5 h-5 stroke-[2.2]" />
        </div>
        <div>
          <span className="font-heading font-bold text-text-main text-lg tracking-tight block leading-tight">
            FirstSteps
          </span>
          <span className="text-[11px] font-medium text-teal-text">
            Gurugram · Sector 47
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 py-6 space-y-1.5" aria-label="Desktop Navigation">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-btn text-sm transition-colors ${
                item.active
                  ? "bg-teal-tint text-teal-text font-semibold border border-teal-text/20"
                  : "text-text-muted hover:text-text-main hover:bg-bg"
              }`}
              aria-current={item.active ? "page" : undefined}
            >
              <Icon
                className={`w-4 h-4 ${
                  item.active ? "stroke-[2.5]" : "stroke-[1.8]"
                }`}
              />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Safety & Compliance Badge */}
      <div className="pt-4 border-t border-border-light">
        <div className="bg-bg rounded-card p-3 border border-border-light text-xs">
          <div className="flex items-center gap-2 text-teal-text font-semibold mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>DPDP Verified</span>
          </div>
          <p className="text-[11px] text-text-muted leading-relaxed">
            Strict parent consent. No child photos or birth dates stored.
          </p>
        </div>
      </div>
    </aside>
  );
};
