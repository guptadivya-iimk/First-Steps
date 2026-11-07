"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { Check, Minus, ArrowRight } from "lucide-react";
import { SEED_SCHOOLS, SECTOR_47_AREA } from "@/data/seedSchools";
import { AppShell } from "@/components/navigation/AppShell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FitScoreBadge } from "@/components/schools/FitScoreBadge";
import { usePreferences } from "@/lib/usePreferences";
import { estimateCabMinutes, scoreSchool } from "@/lib/scoring";
import { Blocks, SchoolMark } from "@/components/doodles";
import { crayonClass, doodleFor } from "@/lib/schoolIdentity";
import { cn } from "@/lib/utils";

const ROWS = [
  { key: "curriculum", label: "Method" },
  { key: "cctvParentAccess", label: "Parent CCTV" },
  { key: "daycareAvailable", label: "Daycare" },
  { key: "daycareHours", label: "Daycare hours" },
  { key: "feeMonthly", label: "Fees a month" },
  { key: "timings", label: "School hours" },
] as const;

export default function ComparePage() {
  const { prefs, loaded } = usePreferences();

  const picked = useMemo(() => {
    return prefs.shortlisted
      .map((id) => SEED_SCHOOLS.find((s) => s.id === id))
      .filter((s): s is (typeof SEED_SCHOOLS)[number] => Boolean(s))
      .slice(0, 4)
      .map((school) => {
        const cabMinutes = estimateCabMinutes(
          SECTOR_47_AREA.center,
          school.location
        );
        return {
          school,
          cabMinutes,
          score: scoreSchool({
            school,
            weights: prefs.weights,
            cabMinutes,
            maxTravelMinutes: prefs.maxTravelMinutes,
            budgetBuckets: prefs.budgetBuckets,
            feeThresholds: SECTOR_47_AREA.feeThresholds,
          }),
        };
      });
  }, [prefs.shortlisted, prefs.weights, prefs.maxTravelMinutes, prefs.budgetBuckets]);

  return (
    <AppShell>
      <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6">
        <h1 className="font-display text-step-8 leading-tight font-extrabold text-ink sm:text-step-9">
          Side by side
        </h1>
        <p className="mt-1 text-step-3 text-ink-soft">
          The schools you saved, on the things you said matter.
        </p>

        {!loaded ? null : picked.length === 0 ? (
          <div className="panel mt-6 flex flex-col items-center gap-4 p-10 text-center">
            <Blocks className="w-32" />
            <h2 className="font-display text-step-6 font-bold text-ink">
              Nothing saved yet
            </h2>
            <p className="max-w-xs text-step-3 leading-relaxed text-ink-soft">
              Tap the heart on any school and it turns up here.
            </p>
            <Button asChild>
              <Link href="/shortlist">
                Browse schools
                <ArrowRight />
              </Link>
            </Button>
          </div>
        ) : (
          <div className="panel mt-6 overflow-x-auto">
            <table className="w-full min-w-[34rem] border-collapse text-left">
              <caption className="sr-only">
                Saved schools compared on method, safety, daycare and fees
              </caption>
              <thead>
                <tr>
                  <th scope="col" className="w-32 p-4 sm:w-40">
                    <span className="sr-only">What we compared</span>
                  </th>
                  {picked.map(({ school, score, cabMinutes }) => (
                    <th
                      key={school.id}
                      scope="col"
                      className={cn(
                        crayonClass(school.id),
                        "border-l border-l-line bg-[color-mix(in_oklch,var(--crayon-pale)_60%,transparent)] p-4 align-top"
                      )}
                    >
                      <span className="flex items-center gap-2">
                        <span
                          className="flex size-9 shrink-0 items-center justify-center rounded-[var(--radius-btn)] bg-[var(--crayon-pale)] text-[var(--crayon-ink)]"
                          aria-hidden="true"
                        >
                          <SchoolMark
                            name={doodleFor(school.id)}
                            className="size-5"
                          />
                        </span>
                        <FitScoreBadge score={score.total} size="sm" />
                      </span>
                      <Link
                        href={`/school/${school.id}`}
                        className="mt-2 block font-display text-step-4 leading-snug font-bold text-ink hover:text-tangerine-ink"
                      >
                        {school.name}
                      </Link>
                      <span className="mt-1 block text-step-2 font-normal text-ink-faint">
                        {school.sector} · {cabMinutes} min
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ROWS.map((row) => (
                  <tr key={row.key} className="border-t border-line">
                    <th
                      scope="row"
                      className="p-4 align-top text-step-3 font-semibold text-ink-soft"
                    >
                      {row.label}
                    </th>
                    {picked.map(({ school }) => {
                      const fact = school.facts[row.key];
                      return (
                        <td
                          key={school.id}
                          className="border-l border-line p-4 align-top"
                        >
                          {fact ? (
                            <span className="flex flex-col items-start gap-1.5">
                              <span className="flex items-start gap-1.5 text-step-3 leading-snug text-ink">
                                {fact.value === true && (
                                  <Check className="mt-0.5 size-4 shrink-0 text-forest-ink" />
                                )}
                                {fact.displayText}
                              </span>
                              {fact.status === "conflicting" && (
                                <Badge variant="warn">Sources disagree</Badge>
                              )}
                            </span>
                          ) : (
                            <span className="flex items-center gap-1.5 text-step-3 text-ink-disabled">
                              <Minus className="size-4" />
                              Not known
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AppShell>
  );
}
