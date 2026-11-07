"use client";

import React, { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import {
  SlidersHorizontal,
  List,
  Map as MapIcon,
  X,
  ArrowRight,
  Car,
} from "lucide-react";
import { SEED_SCHOOLS, SECTOR_47_AREA } from "@/data/seedSchools";
import { AppShell } from "@/components/navigation/AppShell";
import { SchoolCard } from "@/components/schools/SchoolCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { usePreferences } from "@/lib/usePreferences";
import { estimateCabMinutes, feeBucket, scoreSchool } from "@/lib/scoring";
import { PaperBoat, SchoolMark } from "@/components/doodles";
import { crayonClass, doodleFor } from "@/lib/schoolIdentity";
import { cn } from "@/lib/utils";

const SchoolMap = dynamic(
  () => import("@/components/map/SchoolMap").then((m) => m.SchoolMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center bg-paper-deep text-step-3 text-ink-faint">
        Drawing the map…
      </div>
    ),
  }
);

type SortKey = "fit" | "cab" | "fee";

const SORTS: { value: SortKey; label: string }[] = [
  { value: "fit", label: "Best fit" },
  { value: "cab", label: "Closest" },
  { value: "fee", label: "Cheapest" },
];

export default function ShortlistPage() {
  const { prefs, toggleShortlist } = usePreferences();
  const [sortBy, setSortBy] = useState<SortKey>("fit");
  const [filters, setFilters] = useState<string[]>([]);
  const [view, setView] = useState<"list" | "map">("list");
  const [pinned, setPinned] = useState<string | null>(null);

  const wantsMontessori = filters.includes("montessori");
  const wantsCctv = filters.includes("cctv");
  const wantsDaycare = filters.includes("daycare");

  const { matching, setAside } = useMemo(() => {
    const scored = SEED_SCHOOLS.map((school) => {
      const cabMinutes = estimateCabMinutes(
        SECTOR_47_AREA.center,
        school.location
      );
      const score = scoreSchool({
        school,
        weights: prefs.weights,
        cabMinutes,
        maxTravelMinutes: prefs.maxTravelMinutes,
        budgetBuckets: prefs.budgetBuckets,
        feeThresholds: SECTOR_47_AREA.feeThresholds,
      });
      const monthly =
        typeof school.facts.feeMonthly?.value === "number"
          ? (school.facts.feeMonthly.value as number)
          : undefined;
      const bucket = feeBucket(monthly, SECTOR_47_AREA.feeThresholds);
      const feeLabel =
        monthly === undefined
          ? "Fees not published"
          : `₹${(monthly / 1000).toFixed(monthly % 1000 === 0 ? 0 : 1)}k a month`;
      return { school, score, cabMinutes, monthly, bucket, feeLabel };
    });

    const matching: typeof scored = [];
    const setAside: { entry: (typeof scored)[number]; reason: string }[] = [];

    for (const entry of scored) {
      const { school } = entry;

      if (school.status === "possibly_closed") {
        setAside.push({ entry, reason: "May have closed" });
        continue;
      }

      const curriculum = String(
        school.facts.curriculum?.value ?? ""
      ).toLowerCase();
      if (wantsMontessori && !curriculum.includes("montessori")) {
        setAside.push({ entry, reason: "Not a Montessori school" });
        continue;
      }
      if (wantsCctv && school.facts.cctvParentAccess?.value !== true) {
        setAside.push({ entry, reason: "Parent CCTV not confirmed" });
        continue;
      }
      if (wantsDaycare && school.facts.daycareAvailable?.value !== true) {
        setAside.push({ entry, reason: "Daycare not confirmed" });
        continue;
      }

      matching.push(entry);
    }

    matching.sort((a, b) => {
      if (sortBy === "cab") return a.cabMinutes - b.cabMinutes;
      if (sortBy === "fee") {
        return (
          (a.monthly ?? Number.MAX_SAFE_INTEGER) -
          (b.monthly ?? Number.MAX_SAFE_INTEGER)
        );
      }
      return b.score.total - a.score.total;
    });

    return { matching, setAside };
  }, [
    prefs.weights,
    prefs.maxTravelMinutes,
    prefs.budgetBuckets,
    sortBy,
    wantsMontessori,
    wantsCctv,
    wantsDaycare,
  ]);

  const mapSchools = useMemo(
    () =>
      matching.map(({ school, score }) => ({
        id: school.id,
        name: school.name,
        sector: school.sector,
        score: score.total,
        lat: school.location.lat,
        lng: school.location.lng,
      })),
    [matching]
  );

  const pinnedEntry = matching.find((m) => m.school.id === pinned) ?? null;

  return (
    <AppShell>
      <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="font-display text-step-8 leading-tight font-extrabold text-ink sm:text-step-9">
              Schools near you
            </h1>
            <p className="mt-1 text-step-3 text-ink-soft">
              {matching.length} of {SEED_SCHOOLS.length} match what you asked
              for.
            </p>
          </div>

          <Button asChild variant="outline" size="sm">
            <Link href="/settings/needs">
              <SlidersHorizontal />
              My needs
            </Link>
          </Button>
        </div>

        {/* ---- List or Atlas ---- */}
        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="inline-flex gap-1 self-start rounded-[var(--radius-chip)] bg-paper-deep p-1">
            {(
              [
                { key: "list", label: "List", Icon: List },
                { key: "map", label: "Atlas", Icon: MapIcon },
              ] as const
            ).map(({ key, label, Icon }) => (
              <button
                key={key}
                type="button"
                onClick={() => setView(key)}
                aria-pressed={view === key}
                className={cn(
                  "inline-flex min-h-touch items-center gap-2 rounded-[var(--radius-chip)] px-4 text-step-3 font-bold transition-colors",
                  view === key
                    ? "bg-paper-raised text-tangerine-ink shadow-[var(--shadow-rest)]"
                    : "text-ink-faint hover:text-ink"
                )}
              >
                <Icon className="size-4" />
                {label}
              </button>
            ))}
          </div>

          <label className="flex items-center gap-2 text-step-3 text-ink-soft">
            <span className="shrink-0">Sort by</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortKey)}
              className="min-h-touch rounded-[var(--radius-btn)] border border-line-strong bg-paper-raised px-3 text-step-3 font-semibold text-ink"
            >
              {SORTS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <ToggleGroup
          type="multiple"
          value={filters}
          onValueChange={setFilters}
          variant="outline"
          className="mt-3 flex-wrap justify-start"
          aria-label="Must have"
        >
          <ToggleGroupItem
            value="montessori"
            className="min-h-touch px-4 text-step-3"
          >
            Montessori
          </ToggleGroupItem>
          <ToggleGroupItem value="cctv" className="min-h-touch px-4 text-step-3">
            Parent CCTV
          </ToggleGroupItem>
          <ToggleGroupItem
            value="daycare"
            className="min-h-touch px-4 text-step-3"
          >
            Daycare
          </ToggleGroupItem>
        </ToggleGroup>

        {view === "map" && (
          <div className="relative mt-5">
            <div className="h-[26rem] overflow-hidden rounded-[var(--radius-card)] border border-line sm:h-[32rem]">
              <SchoolMap
                schools={mapSchools}
                home={SECTOR_47_AREA.center}
                selectedId={pinned}
                onSelect={setPinned}
              />
            </div>

            {pinnedEntry ? (
              <div
                className={cn(
                  crayonClass(pinnedEntry.school.id),
                  "panel-crayon absolute inset-x-3 bottom-3 z-[500] flex items-start gap-3 p-3.5 sm:inset-x-auto sm:right-4 sm:bottom-4 sm:w-80"
                )}
              >
                <span
                  className="flex size-11 shrink-0 items-center justify-center rounded-[var(--radius-btn)] bg-[var(--crayon-pale)] text-[var(--crayon-ink)]"
                  aria-hidden="true"
                >
                  <SchoolMark
                    name={doodleFor(pinnedEntry.school.id)}
                    className="size-5"
                  />
                </span>

                <div className="min-w-0 flex-1">
                  <h2 className="text-step-4 leading-snug font-bold text-ink">
                    <Link
                      href={`/school/${pinnedEntry.school.id}`}
                      className="hover:text-tangerine-ink"
                    >
                      {pinnedEntry.school.name}
                    </Link>
                  </h2>
                  <p className="mt-1 flex flex-wrap items-center gap-x-2 text-step-2 text-ink-soft">
                    <span className="inline-flex items-center gap-1">
                      <Car className="size-3.5 text-[var(--crayon)]" />
                      {pinnedEntry.cabMinutes} min
                    </span>
                    <span className="text-ink-disabled">·</span>
                    <span>{pinnedEntry.feeLabel}</span>
                  </p>
                  <Button asChild size="sm" className="mt-2.5 w-full">
                    <Link href={`/school/${pinnedEntry.school.id}`}>
                      See the details
                      <ArrowRight />
                    </Link>
                  </Button>
                </div>

                <button
                  type="button"
                  onClick={() => setPinned(null)}
                  aria-label="Close"
                  className="-mt-1 -mr-1 flex size-8 shrink-0 items-center justify-center rounded-[var(--radius-chip)] text-ink-faint hover:bg-paper-deep hover:text-ink"
                >
                  <X className="size-4" />
                </button>
              </div>
            ) : (
              <p className="mt-2.5 text-step-2 text-ink-faint">
                Every pin carries its fit score. Tap one to see the school.
              </p>
            )}
          </div>
        )}

        {view === "list" &&
          (matching.length === 0 ? (
            <div className="panel mt-6 flex flex-col items-center gap-3 p-10 text-center">
              <PaperBoat className="w-28" />
              <h2 className="font-display text-step-6 font-bold text-ink">
                Nothing matches all three
              </h2>
              <p className="max-w-xs text-step-3 text-ink-soft">
                Turn one filter off and the list fills up again.
              </p>
            </div>
          ) : (
            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {matching.map(({ school, score, cabMinutes, feeLabel }) => (
                <SchoolCard
                  key={school.id}
                  school={school}
                  score={score}
                  cabMinutes={cabMinutes}
                  feeLabel={feeLabel}
                  saved={prefs.shortlisted.includes(school.id)}
                  onToggleSave={() => toggleShortlist(school.id)}
                  onShowOnMap={() => {
                    setPinned(school.id);
                    setView("map");
                  }}
                />
              ))}
            </div>
          ))}

        {setAside.length > 0 && (
          <Accordion type="single" collapsible className="mt-8">
            <AccordionItem
              value="set-aside"
              className="panel border-0 px-4 sm:px-5"
            >
              <AccordionTrigger className="min-h-touch items-center py-4 text-step-4 font-semibold hover:no-underline">
                <span className="flex items-center gap-2">
                  Set aside
                  <Badge variant="soft">{setAside.length}</Badge>
                </span>
              </AccordionTrigger>
              <AccordionContent className="pb-4">
                <ul className="flex flex-col divide-y divide-line">
                  {setAside.map(({ entry, reason }) => (
                    <li
                      key={entry.school.id}
                      className="flex flex-wrap items-center justify-between gap-2 py-2.5"
                    >
                      <Link
                        href={`/school/${entry.school.id}`}
                        className="text-step-3 font-semibold text-ink hover:text-tangerine-ink"
                      >
                        {entry.school.name}
                      </Link>
                      <Badge variant="warn">{reason}</Badge>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}
      </div>
    </AppShell>
  );
}
