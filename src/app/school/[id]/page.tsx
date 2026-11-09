"use client";

import React, { use } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ExternalLink,
  Phone,
  MessageSquare,
  Mail,
  Car,
  AlertTriangle,
  Heart,
  Send,
  BadgeCheck,
  Video,
  Clock,
  IndianRupee,
} from "lucide-react";
import { SEED_SCHOOLS, SECTOR_47_AREA } from "@/data/seedSchools";
import { AppShell } from "@/components/navigation/AppShell";
import { StatusTag } from "@/components/schools/StatusTag";
import { FitScoreBadge } from "@/components/schools/FitScoreBadge";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { usePreferences } from "@/lib/usePreferences";
import { estimateCabMinutes, scoreSchool } from "@/lib/scoring";
import { draftQuestions } from "@/lib/outreach";
import { PRIORITY_CRAYON } from "@/lib/priorities";
import { cn } from "@/lib/utils";
import { SchoolMark, Burst } from "@/components/doodles";
import { crayonClass, doodleFor } from "@/lib/schoolIdentity";
import type { SchoolFact } from "@/lib/types";

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

/** One answer at a glance: what we know, and where it came from. */
function GlanceTile({
  Icon,
  label,
  fact,
  fallback,
}: {
  Icon: typeof Car;
  label: string;
  fact?: SchoolFact;
  fallback: string;
}) {
  return (
    <div className="flex flex-col gap-2 rounded-[var(--radius-btn)] border border-line bg-paper-raised p-3.5">
      <span className="flex items-center gap-1.5 text-step-2 font-bold tracking-wide text-ink-faint uppercase">
        <Icon className="size-3.5" />
        {label}
      </span>
      <span className="text-step-4 leading-snug font-semibold text-ink">
        {fact?.displayText ?? fallback}
      </span>
      <span className="mt-auto">
        <StatusTag status={fact?.status ?? "unknown"} />
      </span>
    </div>
  );
}

export default function SchoolDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { prefs, toggleShortlist } = usePreferences();
  const school = SEED_SCHOOLS.find((s) => s.id === id);

  if (!school) notFound();

  const cabMinutes = estimateCabMinutes(SECTOR_47_AREA.center, school.location);
  const score = scoreSchool({
    school,
    weights: prefs.weights,
    cabMinutes,
    maxTravelMinutes: prefs.maxTravelMinutes,
    budgetBuckets: prefs.budgetBuckets,
    feeThresholds: SECTOR_47_AREA.feeThresholds,
  });

  const phone = school.contacts.find((c) => c.type === "phone")?.value;
  const whatsapp =
    school.contacts.find((c) => c.type === "whatsapp")?.value ||
    phone?.replace(/[^0-9]/g, "");
  const email = school.contacts.find((c) => c.type === "email")?.value;
  const draft = draftQuestions(school, score);

  const facts = Object.values(school.facts);
  const saved = prefs.shortlisted.includes(school.id);
  const f = school.facts;

  return (
    <AppShell>
      <div className="mx-auto w-full max-w-5xl px-4 py-5 sm:px-6">
        <Button asChild variant="ghost" size="sm" className="-ml-2 mb-3">
          <Link href="/shortlist">
            <ArrowLeft />
            All schools
          </Link>
        </Button>

        {/* ================= Identity ================= */}
        <header
          className={cn(
            crayonClass(school.id),
            "panel-crayon relative overflow-hidden"
          )}
        >
          {/* The same band the school wears on its card. */}
          <div className="flex items-center gap-2 bg-[var(--crayon)] px-5 py-2.5 text-[var(--crayon-on)] sm:px-6">
            <SchoolMark name={doodleFor(school.id)} className="size-4 shrink-0" />
            <span className="text-step-1 font-bold tracking-widest uppercase">
              {school.sector} · {school.city}
            </span>
          </div>

          <div className="relative p-5 sm:p-6">
            {score.total >= 85 && (
              <Burst className="doodle-drift absolute top-3 right-24 size-10 text-sunshine-ink/40" />
            )}
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h1 className="font-display text-step-8 leading-tight font-extrabold text-ink sm:text-step-9">
                  {school.name}
                </h1>
                <p className="mt-2 flex items-start gap-1.5 text-step-3 text-ink-soft">
                  <Car className="mt-0.5 size-4 shrink-0" />
                  About {cabMinutes} min by cab on the morning school run
                </p>
              </div>
              <FitScoreBadge score={score.total} size="md" />
            </div>

            {school.status === "possibly_closed" && (
              <p className="mt-4 flex items-start gap-2 rounded-[var(--radius-sm)] bg-sunshine-pale px-3 py-2.5 text-step-3 text-sunshine-ink">
                <AlertTriangle className="mt-0.5 size-4 shrink-0" />
                This branch may have closed. Call before you plan a visit.
              </p>
            )}
          </div>
        </header>

        {/* ================= At a glance ================= */}
        <section aria-label="At a glance" className="mt-4 grid grid-cols-2 gap-2.5 lg:grid-cols-4">
          <GlanceTile Icon={BadgeCheck} label="Method" fact={f.curriculum} fallback="Not published" />
          <GlanceTile Icon={Video} label="Parent CCTV" fact={f.cctvParentAccess} fallback="Not confirmed" />
          <GlanceTile Icon={Clock} label="Daycare" fact={f.daycareHours ?? f.daycareAvailable} fallback="Not confirmed" />
          <GlanceTile Icon={IndianRupee} label="Fees" fact={f.feeMonthly ?? f.feeAnnual} fallback="Not published" />
        </section>

        <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
          {/* ================= Main column ================= */}
          <div className="flex min-w-0 flex-col gap-4">
            {score.openQuestions.length > 0 && (
              <section className="rounded-[var(--radius-card)] border border-sunshine-ink/20 bg-sunshine-pale p-5">
                <h2 className="font-display text-step-6 font-bold text-ink">
                  Worth asking about
                </h2>
                <ul className="mt-3 flex flex-col gap-2">
                  {score.openQuestions.map((q) => (
                    <li
                      key={q}
                      className="flex items-start gap-2 text-step-4 leading-relaxed text-sunshine-ink"
                    >
                      <AlertTriangle className="mt-1 size-4 shrink-0" />
                      {q}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <section className="panel p-5 sm:p-6">
              <h2 className="font-display text-step-6 font-bold text-ink">
                Why {score.total} out of 100
              </h2>
              <ul className="mt-4 flex flex-col gap-4">
                {score.components.map((c) => {
                  const share = Math.min(100, (c.points / Math.max(c.weight, 1)) * 100);
                  return (
                    <li key={c.key} className={PRIORITY_CRAYON[c.key]}>
                      <div className="flex items-baseline justify-between gap-3">
                        <span className="flex items-center gap-2 text-step-4 font-semibold text-ink">
                          <span className="inline-block size-2.5 rounded-full bg-[var(--crayon)]" />
                          {c.label}
                        </span>
                        <span className="text-step-3 tabular-nums text-ink-faint">
                          {c.points} / {c.weight}
                        </span>
                      </div>
                      <div
                        className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-paper-deep"
                        role="img"
                        aria-label={`${c.label}: ${c.points} of ${c.weight}`}
                      >
                        <div
                          className="h-full rounded-full bg-[var(--crayon)]"
                          style={{ width: `${share}%` }}
                        />
                      </div>
                      <p className="mt-1.5 text-step-3 text-ink-soft">{c.note}</p>
                    </li>
                  );
                })}
              </ul>
            </section>

            <section className="panel p-5 sm:p-6">
              <h2 className="font-display text-step-6 font-bold text-ink">
                Where each fact came from
              </h2>
              <p className="mt-1 text-step-3 text-ink-soft">
                Open a row for the exact wording and its source.
              </p>

              <Accordion type="single" collapsible className="mt-3">
                {facts.map((fact) => (
                  <AccordionItem key={fact.key} value={fact.key} className="border-line">
                    <AccordionTrigger className="min-h-touch items-center gap-3 py-3.5 hover:no-underline">
                      <span className="flex flex-1 flex-wrap items-center gap-2 text-left">
                        <span className="text-step-4 font-semibold text-ink">
                          {fact.displayText}
                        </span>
                        <StatusTag status={fact.status} />
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="pb-4">
                      <ul className="flex flex-col gap-2.5">
                        {fact.sources.map((source, i) => (
                          <li key={`${fact.key}-${i}`} className="rounded-[var(--radius-sm)] bg-paper-deep p-3">
                            <p className="text-step-3 leading-relaxed text-ink">
                              {source.quote ? `“${source.quote}”` : source.name}
                            </p>
                            <p className="mt-1.5 flex flex-wrap items-center gap-2 text-step-2 text-ink-faint">
                              <Badge variant="outline">{source.name}</Badge>
                              <span>seen {source.capturedAt}</span>
                              {source.url && (
                                <a
                                  href={source.url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-1 font-semibold text-tangerine-ink hover:underline"
                                >
                                  Open
                                  <ExternalLink className="size-3" />
                                </a>
                              )}
                            </p>
                          </li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>
          </div>

          {/* ================= Side column ================= */}
          <aside className="flex flex-col gap-4 lg:sticky lg:top-20">
            <section className="panel p-5">
              <h2 className="font-display text-step-6 font-bold text-ink">
                Ask the school
              </h2>
              <p className="mt-1 text-step-3 leading-relaxed text-ink-soft">
                {draft.channel === "whatsapp"
                  ? "Opens WhatsApp with your questions already written. You decide whether to send it."
                  : draft.channel === "email"
                    ? "Opens your mail app with your questions already written. You decide whether to send it."
                    : "We have no contact details for this school yet."}
              </p>

              {draft.href ? (
                <Button asChild className="mt-4 w-full" size="lg">
                  <a href={draft.href} target="_blank" rel="noreferrer">
                    <Send />
                    Draft my questions
                  </a>
                </Button>
              ) : (
                <Button className="mt-4 w-full" size="lg" disabled>
                  <Send />
                  Draft my questions
                </Button>
              )}

              <div className="mt-2 grid grid-cols-3 gap-2">
                {phone && (
                  <Button asChild variant="outline" size="sm">
                    <a href={`tel:${phone.replace(/\s/g, "")}`} aria-label={`Call ${school.name}`}>
                      <Phone />
                      Call
                    </a>
                  </Button>
                )}
                {whatsapp && (
                  <Button asChild variant="outline" size="sm">
                    <a
                      href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, "")}`}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`WhatsApp ${school.name}`}
                    >
                      <MessageSquare />
                      Chat
                    </a>
                  </Button>
                )}
                {email && (
                  <Button asChild variant="outline" size="sm">
                    <a href={`mailto:${email}`} aria-label={`Email ${school.name}`}>
                      <Mail />
                      Email
                    </a>
                  </Button>
                )}
              </div>

              <Button
                type="button"
                variant="ghost"
                className="mt-2 w-full"
                onClick={() => toggleShortlist(school.id)}
                aria-pressed={saved}
              >
                <Heart className={cn(saved && "fill-berry text-berry")} />
                {saved ? "Saved to your list" : "Save to your list"}
              </Button>
            </section>

            <section className="panel overflow-hidden">
              <div className="h-56">
                <SchoolMap
                  schools={[
                    {
                      id: school.id,
                      name: school.name,
                      sector: school.sector,
                      score: score.total,
                      lat: school.location.lat,
                      lng: school.location.lng,
                    },
                  ]}
                  home={SECTOR_47_AREA.center}
                  selectedId={school.id}
                  onSelect={() => {}}
                  className="rounded-none"
                />
              </div>
              <div className="p-4">
                <p className="text-step-3 leading-relaxed text-ink-soft">
                  {school.address}
                </p>
                <p className="mt-2 text-step-2 text-ink-faint">
                  The white ring is Sector 47, where your search starts.
                </p>
                {school.website && (
                  <a
                    href={school.website}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-1 inline-flex min-h-touch items-center gap-1.5 text-step-3 font-semibold text-tangerine-ink hover:underline"
                  >
                    School website
                    <ExternalLink className="size-3.5" />
                  </a>
                )}
              </div>
            </section>
          </aside>
        </div>
      </div>
    </AppShell>
  );
}
