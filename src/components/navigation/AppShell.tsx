"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MapPin, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "./nav-items";
import { Footprint } from "@/components/doodles";

/**
 * One shell for every page inside the app.
 *
 * Phones and tablets get a bottom bar under the thumb. Laptops get a rail on
 * the left instead, because a cursor has no thumb reach to worry about.
 * `wide` lets a page such as the shortlist use the full width for its
 * list-and-map split.
 */
export function AppShell({
  children,
  areaLabel = "Sector 47, Gurugram",
  wide = false,
}: {
  children: React.ReactNode;
  areaLabel?: string;
  wide?: boolean;
}) {
  return (
    <div className="flex min-h-dvh bg-paper">
      <SideRail />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar areaLabel={areaLabel} wide={wide} />
        <div className="flex-1 pb-24 lg:pb-10">{children}</div>
      </div>
      <BottomBar />
    </div>
  );
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn("flex min-h-touch items-center gap-2", className)}>
      <span className="flex size-9 items-center justify-center rounded-[var(--radius-btn)] bg-tangerine text-ink">
        <Footprint className="size-5" />
      </span>
      <span className="font-display text-step-6 leading-none font-extrabold tracking-tight">
        FirstSteps
      </span>
    </span>
  );
}

function isActive(pathname: string, href: string) {
  // A single school's page belongs to the Schools section.
  if (href === "/shortlist" && pathname.startsWith("/school/")) return true;
  return pathname === href || pathname.startsWith(`${href}/`);
}

function SideRail() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 flex-col border-r border-line bg-paper-raised px-4 py-5 lg:flex">
      <Link href="/" aria-label="FirstSteps home" className="mb-7 px-1">
        <Wordmark />
      </Link>

      <nav className="flex flex-col gap-1" aria-label="Main">
        {NAV_ITEMS.map((item) => {
          const active = isActive(pathname, item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "crayon",
                item.crayon,
                "group flex min-h-touch items-center gap-3 rounded-[var(--radius-btn)] px-2 text-step-4 font-semibold transition-colors",
                active ? "bg-paper-deep text-ink" : "text-ink-soft hover:bg-paper-deep/70 hover:text-ink"
              )}
            >
              <span
                className={cn(
                  "flex size-8 items-center justify-center rounded-[var(--radius-sm)] transition-colors",
                  active
                    ? "bg-[var(--crayon)] text-[var(--crayon-on)]"
                    : "bg-[var(--crayon-pale)] text-[var(--crayon-ink)]"
                )}
              >
                <Icon className="size-[17px]" />
              </span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto flex gap-2.5 rounded-[var(--radius-btn)] bg-paper-deep p-3">
        <Lock className="mt-0.5 size-4 shrink-0 text-ink-soft" />
        <p className="text-step-2 leading-relaxed text-ink-soft">
          <span className="font-bold text-ink">Private by default.</span>{" "}
          No name, no age, no photos. Just an area and a shortlist.
        </p>
      </div>
    </aside>
  );
}

function TopBar({ areaLabel, wide }: { areaLabel: string; wide: boolean }) {
  return (
    <header className="sticky top-0 z-30 bg-paper/90 backdrop-blur-md">
      <div
        className={cn(
          "mx-auto flex min-h-touch w-full items-center justify-between gap-3 px-4 py-2.5 sm:px-6",
          wide ? "max-w-none" : "max-w-5xl"
        )}
      >
        <Link href="/" aria-label="FirstSteps home" className="lg:hidden">
          <Wordmark />
        </Link>

        <span className="hidden items-center gap-1.5 text-step-3 font-semibold text-ink-soft lg:flex">
          <MapPin className="size-4 text-tangerine-ink" />
          {areaLabel}
        </span>

        <span className="flex items-center gap-1.5 rounded-[var(--radius-chip)] border border-ink/15 bg-sand px-3 py-1.5 text-step-2 font-bold text-ink lg:hidden">
          <MapPin className="size-3.5" />
          Sector 47
        </span>

        <span className="hidden rounded-[var(--radius-chip)] bg-paper-deep px-3 py-1 text-step-2 font-semibold text-ink-soft lg:block">
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
          const active = isActive(pathname, item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "crayon",
                item.crayon,
                "flex min-h-touch flex-1 flex-col items-center justify-center gap-1 py-2 transition-colors",
                active ? "text-ink" : "text-ink-faint"
              )}
            >
              <span
                className={cn(
                  "flex h-7 w-11 items-center justify-center rounded-[var(--radius-sm)] transition-colors",
                  active && "bg-[var(--crayon)] text-[var(--crayon-on)]"
                )}
              >
                <Icon className="size-[18px]" />
              </span>
              <span className="text-step-1 font-bold">{item.short}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
