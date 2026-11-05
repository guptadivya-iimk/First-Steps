"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ListFilter, Columns3, CalendarCheck, SlidersHorizontal } from "lucide-react";

export const BottomNav: React.FC = () => {
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
      label: "Visits",
      href: "/visits",
      icon: CalendarCheck,
      active: pathname.startsWith("/visits"),
    },
    {
      label: "My needs",
      href: "/settings/needs",
      icon: SlidersHorizontal,
      active: pathname.startsWith("/settings"),
    },
  ];

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-bg-card border-t border-border-light shadow-lg safe-area-pb"
      aria-label="Mobile Navigation"
    >
      <div className="grid grid-cols-4 h-16 max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center min-h-touch gap-1 transition-colors ${
                item.active
                  ? "text-teal-primary font-semibold"
                  : "text-text-muted hover:text-text-main"
              }`}
              aria-current={item.active ? "page" : undefined}
            >
              <Icon className={`w-5 h-5 ${item.active ? "stroke-[2.5]" : "stroke-[1.8]"}`} />
              <span className="text-[11px] leading-tight">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
