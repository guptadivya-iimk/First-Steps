"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, RotateCcw, Minus, Plus, Check } from "lucide-react";
import { AppShell } from "@/components/navigation/AppShell";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { usePreferences, DEFAULT_PREFERENCES } from "@/lib/usePreferences";
import { DEFAULT_WEIGHTS, type Weights } from "@/lib/scoring";
import {
  getWeightsSum,
  rebalanceWeights,
  type UserWeights,
} from "@/lib/scoring/weights";
import { Sprout } from "@/components/doodles";
import { cn } from "@/lib/utils";

/**
 * The hundred points.
 *
 * A parent has a fixed amount of caring to spend, so the five priorities
 * always add up to 100. Pushing one up pulls the others down in proportion,
 * which is the only honest way to ask what matters most: everything cannot.
 * The rebalancing itself lives in `src/lib/scoring/weights.ts`.
 */
const WEIGHT_ROWS: {
  key: keyof Weights;
  label: string;
  hint: string;
  crayon: string;
}[] = [
  {
    key: "montessori",
    label: "Montessori",
    hint: "Trained teachers and a real prepared classroom",
    crayon: "crayon crayon-teal",
  },
  {
    key: "safety",
    label: "Safety",
    hint: "CCTV you can watch, women-only toileting staff",
    crayon: "crayon crayon-coral",
  },
  {
    key: "daycare",
    label: "Daycare",
    hint: "Hours past the school day",
    crayon: "crayon crayon-grape",
  },
  {
    key: "travel",
    label: "Travel",
    hint: "Minutes in the cab each morning",
    crayon: "crayon crayon-sky",
  },
  {
    key: "fees",
    label: "Fees",
    hint: "What it costs each month",
    crayon: "crayon crayon-marigold",
  },
];

const BUCKETS = [
  { value: "low", label: "Under ₹7k" },
  { value: "medium", label: "₹7k to ₹12k" },
  { value: "high", label: "Over ₹12k" },
] as const;

export default function MyNeedsPage() {
  const { prefs, update } = usePreferences();
  const total = getWeightsSum(prefs.weights as UserWeights);
  const balanced = total === 100;

  /** Move one priority and let the other four give way. */
  const setWeight = (key: keyof Weights, value: number) => {
    const next = rebalanceWeights(prefs.weights as UserWeights, key, value);
    update({ weights: next as Weights });
  };

  const step = (key: keyof Weights, by: number) => {
    setWeight(key, prefs.weights[key] + by);
  };

  const toggleBucket = (bucket: "low" | "medium" | "high") => {
    const has = prefs.budgetBuckets.includes(bucket);
    const next = has
      ? prefs.budgetBuckets.filter((b) => b !== bucket)
      : [...prefs.budgetBuckets, bucket];
    update({ budgetBuckets: next.length ? next : prefs.budgetBuckets });
  };

  return (
    <AppShell>
      <div className="mx-auto w-full max-w-2xl px-4 py-5 sm:px-6">
        <Button asChild variant="ghost" size="sm" className="-ml-2 mb-3">
          <Link href="/shortlist">
            <ArrowLeft />
            All schools
          </Link>
        </Button>

        <h1 className="font-display text-step-8 leading-tight font-extrabold text-ink sm:text-step-9">
          What matters to you
        </h1>
        <p className="mt-1 text-step-3 text-ink-soft">
          You have a hundred points to spend. Give more to one and the rest give
          way.
        </p>

        {/* ---- Weights ---- */}
        <section className="panel mt-5 p-5 sm:p-6">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="font-display text-step-6 font-bold text-ink">
              Your priorities
            </h2>
            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-[var(--radius-chip)] px-2.5 py-1 text-step-2 font-bold tabular-nums",
                balanced
                  ? "bg-leaf-pale text-leaf-ink"
                  : "bg-marigold-pale text-marigold-ink"
              )}
            >
              {balanced && <Check className="size-3.5" />}
              {total} of 100 spent
            </span>
          </div>

          {/* How the hundred points are divided, at a glance. */}
          <div
            className="mt-4 flex h-3 overflow-hidden rounded-[var(--radius-chip)] bg-paper-deep"
            role="img"
            aria-label={WEIGHT_ROWS.map(
              (r) => `${r.label} ${prefs.weights[r.key]}`
            ).join(", ")}
          >
            {WEIGHT_ROWS.map((row) => (
              <span
                key={row.key}
                className={cn(row.crayon, "block bg-[var(--crayon)]")}
                style={{
                  width: `${(prefs.weights[row.key] / Math.max(total, 1)) * 100}%`,
                }}
              />
            ))}
          </div>

          <ul className="mt-6 flex flex-col gap-6">
            {WEIGHT_ROWS.map((row) => (
              <li key={row.key} className={row.crayon}>
                <div className="flex items-center justify-between gap-3">
                  <label
                    htmlFor={`weight-${row.key}`}
                    className="text-step-4 font-semibold text-ink"
                  >
                    <span className="mr-2 inline-block size-2.5 rounded-full bg-[var(--crayon)] align-middle" />
                    {row.label}
                  </label>

                  <span className="flex items-center gap-1">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon-sm"
                      onClick={() => step(row.key, -5)}
                      disabled={prefs.weights[row.key] <= 0}
                      aria-label={`Less weight on ${row.label}`}
                    >
                      <Minus className="size-4" />
                    </Button>
                    <span className="w-10 text-center text-step-4 font-bold tabular-nums text-[var(--crayon-ink)]">
                      {prefs.weights[row.key]}
                    </span>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon-sm"
                      onClick={() => step(row.key, 5)}
                      disabled={prefs.weights[row.key] >= 100}
                      aria-label={`More weight on ${row.label}`}
                    >
                      <Plus className="size-4" />
                    </Button>
                  </span>
                </div>

                <p className="mt-0.5 text-step-2 text-ink-faint">{row.hint}</p>

                <Slider
                  id={`weight-${row.key}`}
                  className="mt-3"
                  min={0}
                  max={100}
                  step={5}
                  value={[prefs.weights[row.key]]}
                  onValueChange={([v]) => setWeight(row.key, v)}
                  aria-label={`${row.label} importance`}
                />
              </li>
            ))}
          </ul>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="mt-5 -ml-2"
            onClick={() => update({ weights: DEFAULT_WEIGHTS })}
          >
            <RotateCcw />
            Back to the defaults
          </Button>
        </section>

        {/* ---- Travel ---- */}
        <section className="panel mt-4 p-5 sm:p-6">
          <h2 className="font-display text-step-6 font-bold text-ink">
            The morning cab
          </h2>
          <div className="mt-4 flex items-baseline justify-between gap-3">
            <label
              htmlFor="max-travel"
              className="text-step-4 font-semibold text-ink"
            >
              Longest ride you would accept
            </label>
            <span className="text-step-3 font-semibold tabular-nums text-teal-ink">
              {prefs.maxTravelMinutes} min
            </span>
          </div>
          <Slider
            id="max-travel"
            className="mt-3"
            min={5}
            max={45}
            step={5}
            value={[prefs.maxTravelMinutes]}
            onValueChange={([v]) => update({ maxTravelMinutes: v })}
            aria-label="Longest acceptable cab ride in minutes"
          />
          <p className="mt-3 text-step-2 text-ink-faint">
            Drop-off {prefs.dropTime}, pickup {prefs.pickupTime}, measured on a
            weekday.
          </p>
        </section>

        {/* ---- Budget ---- */}
        <section className="panel mt-4 p-5 sm:p-6">
          <h2 className="font-display text-step-6 font-bold text-ink">Budget</h2>
          <p className="mt-1 text-step-3 text-ink-soft">
            Pick the ranges you would consider.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {BUCKETS.map((bucket) => {
              const on = prefs.budgetBuckets.includes(bucket.value);
              return (
                <button
                  key={bucket.value}
                  type="button"
                  onClick={() => toggleBucket(bucket.value)}
                  aria-pressed={on}
                  className={`min-h-touch rounded-[var(--radius-chip)] border px-4 text-step-3 font-semibold transition-colors ${
                    on
                      ? "border-teal bg-teal-pale text-teal-ink"
                      : "border-line-strong bg-paper-raised text-ink-faint"
                  }`}
                >
                  {bucket.label}
                </button>
              );
            })}
          </div>
        </section>

        <Separator className="my-6 bg-line" />

        <p className="flex items-center gap-2.5 text-step-2 text-ink-faint">
          <Sprout className="size-6 shrink-0" />
          Saved on this device as you go. Nothing leaves your phone.
        </p>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="mt-2 -ml-2 text-ink-faint"
          onClick={() => update(DEFAULT_PREFERENCES)}
        >
          Reset everything
        </Button>
      </div>
    </AppShell>
  );
}
