"use client";

import React, { useEffect, useMemo, useState } from "react";
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
      <div className="flex h-full w-full items-center justify-center rounded-[var(--radius-card)] bg-paper-deep text-step-3 text-ink-faint">
        Drawing the map…
      </div>
    ),
  }
);

type SortKey = "fit" | "cab" | "fee";

/**
 * Whether the laptop layout is showing. Each map is mounted only for the
 * layout it belongs to: hiding one with CSS would still have a phone fetch
 * Leaflet and a screenful of tiles for a map it never shows.
 */
function useIsDesktop() {
  const [desktop, setDesktop] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(min-width: 1024px)");
    const update = () => setDesktop(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  return desktop;
}

const SORTS: { value: SortKey; label: string }[] = [
  { value: "fit", label: "Best fit" },
  { value: "cab", label: "Closest" },
  { value: "fee", label: "Cheapest" },
];

export default function ShortlistPage() {
  const { prefs, toggleShortlist } = usePreferences();
  const [sortBy, setSortBy] = useState<SortKey>("fit");
  const [filters, setFilters] = useState<string[]>([]);
  /** Phones only. On a laptop the list and the map are always both on screen. */
  const [view, setView] = useState<"list" | "map">("list");
  const [pinned, setPinned] = useState<string | null>(null);
  const isDesktop = useIsDesktop();

  // The landing page links here with ?view=map to open straight onto the Atlas.
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("view") === "map") {
      setView("map");
    }
  }, []);

  const wantsMontessori = filters.includes("montessori");
  const wantsCctv = filters.includes("cctv");
  const wantsDaycare = filters.includes("daycare");

  const { matching, setAside } = useMemo(() => {
    const scored = SEED_SCHOOLS.map((school) => {
      const cabMinutes = estimateCabMinutes(SECTOR_47_AREA.center, school.location);
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

      const curriculum = String(school.facts.curriculum?.value ?? "").toLowerCase();
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

  // A pin that has been filtered away should not stay chosen.
  useEffect(() => {
    if (pinned && !matching.some((m) => m.school.id === pinned)) setPinned(null);
  }, [matching, pinned]);

  const pinnedEntry = matching.find((m) => m.school.id === pinned) ?? null;

  /** Tapping a pin on a laptop brings its card into view in the list. */
  const choosePin = (id: string) => {
    setPinned(id);
    if (isDesktop) {
      document
        .getElementById(`school-${id}`)
        ?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  };

  return (
    <AppShell wide>
      <div className="px-4 py-6 sm:px-6 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-6 xl:gap-8">
        {/* ================= List column ================= */}
        <div className="min-w-0">
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

          {/* ---- Controls ---- */}
          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            {/* List or Atlas: phones only. */}
            <div className="inline-flex gap-1 self-start rounded-[var(--radius-chip)] bg-paper-deep p-1 lg:hidden">
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
                      ? "bg-paper-raised text-ink shadow-[var(--shadow-rest)]"
                      : "text-ink-faint hover:text-ink"
                  )}
                >
                  <Icon className="size-4" />
                  {label}
                </button>
              ))}
            </div>

            <ToggleGroup
              type="multiple"
              value={filters}
              onValueChange={setFilters}
              variant="outline"
              className="flex-wrap justify-start"
              aria-label="Must have"
            >
              <ToggleGroupItem value="montessori" className="min-h-touch px-4 text-step-3">
                Montessori
              </ToggleGroupItem>
              <ToggleGroupItem value="cctv" className="min-h-touch px-4 text-step-3">
                Parent CCTV
              </ToggleGroupItem>
              <ToggleGroupItem value="daycare" className="min-h-touch px-4 text-step-3">
                Daycare
              </ToggleGroupItem>
            </ToggleGroup>

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

          {/* ---- Atlas, phones ---- */}
          {view === "map" && !isDesktop && (
            <div className="relative mt-5 lg:hidden">
              <div className="h-[28rem] overflow-hidden rounded-[var(--radius-card)] border border-line">
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
                    "panel-crayon absolute inset-x-3 bottom-3 z-[500] flex items-start gap-3 p-3.5"
                  )}
                >
                  <span
                    className="flex size-11 shrink-0 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--crayon)] text-[var(--crayon-on)]"
                    aria-hidden="true"
                  >
                    <SchoolMark name={doodleFor(pinnedEntry.school.id)} className="size-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <h2 className="text-step-4 leading-snug font-bold text-ink">
                      {pinnedEntry.school.name}
                    </h2>
                    <p className="mt-1 flex flex-wrap items-center gap-x-2 text-step-2 text-ink-soft">
                      <span className="inline-flex items-center gap-1">
                        <Car className="size-3.5" />
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
                    className="-mt-1 -mr-1 flex size-9 shrink-0 items-center justify-center rounded-[var(--radius-sm)] text-ink-faint hover:bg-paper-deep hover:text-ink"
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

          {/* ---- List ---- */}
          <div className={cn(view === "map" && !isDesktop && "hidden")}>
            {matching.length === 0 ? (
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
              <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-1 2xl:grid-cols-2">
                {matching.map(({ school, score, cabMinutes, feeLabel }, i) => (
                  <SchoolCard
                    key={school.id}
                    index={i}
                    school={school}
                    score={score}
                    cabMinutes={cabMinutes}
                    feeLabel={feeLabel}
                    saved={prefs.shortlisted.includes(school.id)}
                    onToggleSave={() => toggleShortlist(school.id)}
                    highlighted={pinned === school.id}
                    onPoint={() => setPinned(school.id)}
                    onShowOnMap={() => {
                      setPinned(school.id);
                      setView("map");
                    }}
                  />
                ))}
              </div>
            )}

            {setAside.length > 0 && (
              <Accordion type="single" collapsible className="mt-8">
                <AccordionItem value="set-aside" className="panel border-0 px-4 sm:px-5">
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
        </div>

        {/* ================= Map column, laptops ================= */}
        {isDesktop && (
        <aside aria-label="Atlas">
          <div className="sticky top-[4.25rem] h-[calc(100dvh-5.75rem)] overflow-hidden rounded-[var(--radius-card)] border border-line">
            <SchoolMap
              schools={mapSchools}
              home={SECTOR_47_AREA.center}
              selectedId={pinned}
              onSelect={choosePin}
            />
            {!pinned && (
              <p className="pointer-events-none absolute inset-x-3 bottom-9 z-[500] rounded-[var(--radius-sm)] bg-paper-raised/95 px-3 py-2 text-center text-step-2 font-semibold text-ink-soft">
                Rest on a card to find its pin. Tap a pin to find its card.
              </p>
            )}
          </div>
        </aside>
        )}
      </div>
    </AppShell>
  );
}
