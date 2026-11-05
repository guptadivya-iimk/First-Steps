"use client";

import * as React from "react";
import Link from "next/link";
import { Car, Heart, ArrowRight, AlertTriangle, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import type { School } from "@/lib/types";
import type { ScoreResult } from "@/lib/scoring";
import { FitScoreBadge } from "./FitScoreBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SchoolMark } from "@/components/doodles";
import { crayonClass, doodleFor } from "@/lib/schoolIdentity";

export function SchoolCard({
  school,
  score,
  cabMinutes,
  feeLabel,
  saved,
  onToggleSave,
  onShowOnMap,
}: {
  school: School;
  score: ScoreResult;
  cabMinutes: number;
  feeLabel: string;
  saved: boolean;
  onToggleSave: () => void;
  onShowOnMap?: () => void;
}) {
  const curriculum = school.facts.curriculum;
  const cctv = school.facts.cctvParentAccess?.value === true;
  const daycare = school.facts.daycareAvailable?.value === true;
  const conflicts = Object.values(school.facts).filter(
    (f) => f.status === "conflicting"
  ).length;

  return (
    <article
      className={cn(
        crayonClass(school.id),
        "panel-crayon flex flex-col gap-4 p-4 transition-shadow hover:shadow-[var(--shadow-lift)] sm:p-5"
      )}
    >
      <div className="flex items-start gap-3">
        {/* The school's own mark, in the school's own colour. */}
        <span
          className="flex size-12 shrink-0 items-center justify-center rounded-[var(--radius-btn)] bg-[var(--crayon-pale)] text-[var(--crayon-ink)]"
          aria-hidden="true"
        >
          <SchoolMark name={doodleFor(school.id)} className="size-6" />
        </span>

        <div className="min-w-0 flex-1">
          <p className="text-step-2 font-bold tracking-wide text-[var(--crayon-ink)] uppercase">
            {school.sector}
          </p>
          <h2 className="mt-0.5 text-step-6 leading-snug font-bold text-ink">
            <Link href={`/school/${school.id}`} className="hover:text-teal-ink">
              {school.name}
            </Link>
          </h2>
        </div>

        <FitScoreBadge score={score.total} size="sm" />
      </div>

      <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-step-3 text-ink-soft">
        <span className="inline-flex items-center gap-1.5">
          <Car className="size-4 text-[var(--crayon)]" />
          {cabMinutes} min by cab
        </span>
        <span className="text-ink-disabled">·</span>
        <span>{feeLabel}</span>
      </p>

      <div className="flex flex-wrap gap-1.5">
        {curriculum && (
          <Badge
            variant={
              curriculum.status === "conflicting" || curriculum.status === "old"
                ? "warn"
                : curriculum.status === "confirmed"
                  ? "default"
                  : curriculum.status === "website"
                    ? "website"
                    : "soft"
            }
          >
            {curriculum.displayText}
          </Badge>
        )}
        {cctv && <Badge variant="good">Parent CCTV</Badge>}
        {daycare && <Badge variant="website">Daycare</Badge>}
      </div>

      {conflicts > 0 && (
        <p className="flex items-start gap-2 rounded-[var(--radius-btn)] bg-marigold-pale px-3 py-2 text-step-3 text-marigold-ink">
          <AlertTriangle className="mt-0.5 size-4 shrink-0" />
          <span>
            {conflicts} {conflicts === 1 ? "detail" : "details"} to check with
            the school.
          </span>
        </p>
      )}

      <div className="mt-auto flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={onToggleSave}
          aria-pressed={saved}
          aria-label={saved ? "Remove from your list" : "Save to your list"}
        >
          <Heart
            className={cn(
              "size-[18px]",
              saved ? "fill-coral text-coral" : "text-ink-faint"
            )}
          />
        </Button>

        {onShowOnMap && (
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={onShowOnMap}
            aria-label={`Show ${school.name} on the map`}
          >
            <MapPin className="size-[18px] text-ink-faint" />
          </Button>
        )}

        <Button asChild className="flex-1">
          <Link href={`/school/${school.id}`}>
            See the details
            <ArrowRight />
          </Link>
        </Button>
      </div>
    </article>
  );
}
