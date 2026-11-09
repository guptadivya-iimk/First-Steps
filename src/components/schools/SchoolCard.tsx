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
  index = 0,
  highlighted = false,
  onPoint,
}: {
  school: School;
  score: ScoreResult;
  cabMinutes: number;
  feeLabel: string;
  saved: boolean;
  onToggleSave: () => void;
  onShowOnMap?: () => void;
  /** Position in the list, used only to stagger the arrival. */
  index?: number;
  /** True when this school's pin is the one chosen on the map. */
  highlighted?: boolean;
  /** Called when the pointer rests on the card, so the map can answer. */
  onPoint?: () => void;
}) {
  const curriculum = school.facts.curriculum;
  const cctv = school.facts.cctvParentAccess?.value === true;
  const daycare = school.facts.daycareAvailable?.value === true;
  const conflicts = Object.values(school.facts).filter(
    (f) => f.status === "conflicting"
  ).length;

  return (
    <article
      id={`school-${school.id}`}
      onMouseEnter={onPoint}
      data-highlighted={highlighted || undefined}
      className={cn(
        crayonClass(school.id),
        "panel-crayon anim-rise hover-lift flex scroll-mt-28 flex-col overflow-hidden transition-[box-shadow] hover:shadow-[var(--shadow-lift)]",
        highlighted && "ring-3 ring-[var(--crayon)] ring-offset-2 ring-offset-paper",
        // Only the first few stagger. Past that it is just a wait.
        ["", "anim-d1", "anim-d2", "anim-d3", "anim-d4", "anim-d5"][
          Math.min(index, 5)
        ]
      )}
    >
      {/* A flat band of the school's own colour, carrying its mark. */}
      <div className="flex items-center gap-2 bg-[var(--crayon)] px-4 py-2 text-[var(--crayon-on)]">
        <SchoolMark
          name={doodleFor(school.id)}
          className="size-4 shrink-0"
        />
        <span className="text-step-1 font-bold tracking-widest uppercase">
          {school.sector}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3.5 p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h2 className="text-step-6 leading-snug font-bold text-ink">
              <Link
                href={`/school/${school.id}`}
                className="hover:text-tangerine-ink"
              >
                {school.name}
              </Link>
            </h2>
            <p className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-step-3 text-ink-soft">
              <span className="inline-flex items-center gap-1.5">
                <Car className="size-4 text-[var(--crayon)]" />
                {cabMinutes} min by cab
              </span>
              <span className="text-ink-disabled">·</span>
              <span>{feeLabel}</span>
            </p>
          </div>
          <FitScoreBadge score={score.total} size="sm" />
        </div>

        <div className="flex flex-wrap gap-1.5">
          {curriculum && (
            <Badge
              variant={
                curriculum.status === "conflicting" ||
                curriculum.status === "old"
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
          <p className="flex items-start gap-2 rounded-[var(--radius-sm)] bg-sunshine-pale px-3 py-2 text-step-3 text-sunshine-ink">
            <AlertTriangle className="mt-0.5 size-4 shrink-0" />
            <span>
              {conflicts} {conflicts === 1 ? "detail" : "details"} to check with
              the school.
            </span>
          </p>
        )}

        <div className="mt-auto flex items-center gap-2 pt-1">
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
                saved ? "fill-berry text-berry" : "text-ink-faint"
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
      </div>
    </article>
  );
}
