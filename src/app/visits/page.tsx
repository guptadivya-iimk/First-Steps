"use client";

import React from "react";
import Link from "next/link";
import { CalendarCheck, ArrowRight } from "lucide-react";
import { AppShell } from "@/components/navigation/AppShell";
import { Button } from "@/components/ui/button";
import { usePreferences } from "@/lib/usePreferences";
import { Kite } from "@/components/doodles";

const STAGES = [
  { label: "To ask", tone: "bg-paper-deep text-ink-soft" },
  { label: "Asked", tone: "bg-lagoon-pale text-lagoon-ink" },
  { label: "Replied", tone: "bg-tangerine-pale text-tangerine-ink" },
  { label: "Visiting", tone: "bg-sunshine-pale text-sunshine-ink" },
  { label: "Visited", tone: "bg-grape-pale text-grape-ink" },
  { label: "Decided", tone: "bg-forest-pale text-forest-ink" },
];

export default function VisitsPage() {
  const { prefs, loaded } = usePreferences();
  const saved = prefs.shortlisted.length;

  return (
    <AppShell>
      <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6">
        <h1 className="font-display text-step-8 leading-tight font-extrabold text-ink sm:text-step-9">
          Visits
        </h1>
        <p className="mt-1 text-step-3 text-ink-soft">
          Where each school has got to.
        </p>

        <ol className="mt-6 grid grid-cols-3 gap-2 sm:grid-cols-6">
          {STAGES.map((stage, i) => (
            <li
              key={stage.label}
              className={`rounded-[var(--radius-btn)] p-3 text-center ${stage.tone}`}
            >
              <span className="block font-display text-step-7 leading-none font-extrabold tabular-nums">
                {loaded && i === 0 ? saved : 0}
              </span>
              <span className="mt-1 block text-step-2 font-semibold">
                {stage.label}
              </span>
            </li>
          ))}
        </ol>

        <div className="panel mt-6 flex flex-col items-center gap-4 p-10 text-center">
          <Kite className="sway w-32" />
          <h2 className="font-display text-step-6 font-bold text-ink">
            {saved > 0 ? "Ready when you are" : "No visits booked"}
          </h2>
          <p className="max-w-sm text-step-3 leading-relaxed text-ink-soft">
            {saved > 0
              ? "Send your questions first. Once a school replies, book a morning when the children are in class."
              : "Save a few schools and they show up here as you work through them."}
          </p>
          <Button asChild variant={saved > 0 ? "default" : "outline"}>
            <Link href={saved > 0 ? "/compare" : "/shortlist"}>
              {saved > 0 ? (
                <>
                  <CalendarCheck />
                  See your saved schools
                </>
              ) : (
                <>
                  Browse schools
                  <ArrowRight />
                </>
              )}
            </Link>
          </Button>
        </div>
      </div>
    </AppShell>
  );
}
