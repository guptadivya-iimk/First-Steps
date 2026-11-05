"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "./nav-items";
import { Footprint } from "@/components/doodles";

/**
 * One shell for every signed-in page.
 *
 * Phones get a bottom bar under the thumb. Tablets keep the bottom bar and
 * gain a wider content column. Laptops get a rail on the left and lose the
 * bottom bar, because a cursor has no thumb reach to worry about.
 */
export function AppShell({
  children,
  areaLabel = "Sector 47, Gurugram",
}: {
  children: React.ReactNode;
  areaLabel?: string;
}) {
  return (
    <div className="flex min-h-dvh">
      <SideRail />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar areaLabel={areaLabel} />
        <div className="flex-1 pb-24 lg:pb-10">{children}</div>
      </div>
      <BottomBar />
    </div>
  );
}

function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn("flex min-h-touch items-center gap-2", className)}>
      <span className="flex size-9 items-center justify-center rounded-[var(--radius-btn)] bg-teal text-white">
        <Footprint className="size-5" />
      </span>
      <span className="font-display text-step-6 leading-none font-extrabold tracking-tight">
        FirstSteps
      </span>
    </span>
  );
}

function SideRail() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 hidden h-dvh w-60 shrink-0 flex-col border-r border-line bg-paper-raised px-4 py-6 lg:flex xl:w-68">
      <Link href="/shortlist" className="mb-8 px-1">
        <Wordmark />
      </Link>

      <nav className="flex flex-col gap-1" aria-label="Main">
        {NAV_ITEMS.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex min-h-touch items-center gap-3 rounded-[var(--radius-btn)] px-3 text-step-4 font-semibold transition-colors",
                active
                  ? "bg-teal-pale text-teal-ink"
                  : "text-ink-soft hover:bg-paper-deep hover:text-ink"
              )}
            >
              <Icon className="size-[18px]" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto rounded-[var(--radius-btn)] bg-paper-deep p-3">
        <p className="text-step-2 font-semibold text-ink">Private by default</p>
        <p className="mt-0.5 text-step-2 leading-relaxed text-ink-faint">
          No name, no age, no photos. Just an area and a shortlist.
        </p>
      </div>
    </aside>
  );
}

function TopBar({ areaLabel }: { areaLabel: string }) {
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-paper/85 backdrop-blur-md">
      <div className="mx-auto flex min-h-touch w-full max-w-5xl items-center justify-between gap-3 px-4 py-2.5 sm:px-6">
        <Link href="/shortlist" className="lg:hidden">
          <Wordmark />
        </Link>

        <span className="hidden items-center gap-1.5 text-step-3 font-semibold text-ink-soft lg:flex">
          <MapPin className="size-4 text-teal" />
          {areaLabel}
        </span>

        <span className="flex items-center gap-1.5 rounded-[var(--radius-chip)] border border-teal/25 bg-teal-pale px-3 py-1.5 text-step-2 font-semibold text-teal-ink lg:hidden">
          <MapPin className="size-3.5" />
          Sector 47
        </span>

        <span className="hidden text-step-3 text-ink-faint lg:block">
          Phase 1 preview
        </span>
      </div>
      <div className="rainbow-rule" aria-hidden="true" />
    </header>
  );
}

function BottomBar() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-paper-raised/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md lg:hidden"
      aria-label="Main"
    >
      <div className="mx-auto flex max-w-lg items-stretch justify-around px-1">
        {NAV_ITEMS.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex min-h-touch flex-1 flex-col items-center justify-center gap-1 rounded-[var(--radius-btn)] py-2 transition-colors",
                active ? "text-teal-ink" : "text-ink-faint"
              )}
            >
              <span
                className={cn(
                  "flex h-7 w-11 items-center justify-center rounded-[var(--radius-chip)] transition-colors",
                  active && "bg-teal-pale"
                )}
              >
                <Icon className="size-[18px]" />
              </span>
              <span className="text-step-1 font-semibold">{item.short}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export { Wordmark };
