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
} from "lucide-react";
import { SEED_SCHOOLS, SECTOR_47_AREA } from "@/data/seedSchools";
import { AppShell } from "@/components/navigation/AppShell";
import { StatusTag } from "@/components/schools/StatusTag";
import { FitScoreBadge } from "@/components/schools/FitScoreBadge";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { usePreferences } from "@/lib/usePreferences";
import { estimateCabMinutes, scoreSchool } from "@/lib/scoring";
import { cn } from "@/lib/utils";
import { SchoolMark } from "@/components/doodles";
import { SunnyFace } from "@/components/doodles/Characters";
import { crayonClass, doodleFor } from "@/lib/schoolIdentity";

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

  const facts = Object.values(school.facts);
  const conflicts = facts.filter((f) => f.status === "conflicting");
  const saved = prefs.shortlisted.includes(school.id);

  return (
    <AppShell>
      <div className="mx-auto w-full max-w-3xl px-4 py-5 sm:px-6">
        <Button asChild variant="ghost" size="sm" className="-ml-2 mb-3">
          <Link href="/shortlist">
            <ArrowLeft />
            All schools
          </Link>
        </Button>

        {/* ---- Identity ---- */}
        <header
          className={cn(
            crayonClass(school.id),
            "panel-crayon relative overflow-hidden p-5 sm:p-6"
          )}
        >
          {score.total >= 85 && (
            <SunnyFace className="absolute -top-3 -right-3 size-16" />
          )}

          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="flex items-center gap-2 text-step-2 font-bold tracking-wide text-[var(--crayon-ink)] uppercase">
                <span
                  className="flex size-7 items-center justify-center rounded-[var(--radius-chip)] bg-[var(--crayon-pale)]"
                  aria-hidden="true"
                >
                  <SchoolMark name={doodleFor(school.id)} className="size-4" />
                </span>
                {school.sector} · {school.city}
              </p>
              <h1 className="mt-1 font-display text-step-8 leading-tight font-extrabold text-ink sm:text-step-9">
                {school.name}
              </h1>
              <p className="mt-2 flex items-center gap-1.5 text-step-3 text-ink-soft">
                <Car className="size-4 text-[var(--crayon)]" />
                About {cabMinutes} min by cab at 9am
              </p>
            </div>
            <FitScoreBadge score={score.total} size="md" />
          </div>

          {school.status === "possibly_closed" && (
            <p className="mt-4 flex items-start gap-2 rounded-[var(--radius-btn)] bg-sunshine-pale px-3 py-2.5 text-step-3 text-sunshine-ink">
              <AlertTriangle className="mt-0.5 size-4 shrink-0" />
              This branch may have closed. Call before you plan a visit.
            </p>
          )}

          {/* ---- Reach them ---- */}
          <div className="mt-5 grid gap-2 sm:grid-cols-3">
            {phone && (
              <Button asChild variant="outline">
                <a href={`tel:${phone.replace(/\s/g, "")}`}>
                  <Phone />
                  Call
                </a>
              </Button>
            )}
            {whatsapp && (
              <Button asChild variant="outline">
                <a
                  href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <MessageSquare />
                  WhatsApp
                </a>
              </Button>
            )}
            {email && (
              <Button asChild variant="outline">
                <a href={`mailto:${email}`}>
                  <Mail />
                  Email
                </a>
              </Button>
            )}
          </div>

          <div className="mt-2 grid gap-2 sm:grid-cols-[auto_1fr]">
            <Button
              type="button"
              variant="outline"
              onClick={() => toggleShortlist(school.id)}
              aria-pressed={saved}
            >
              <Heart
                className={cn(saved && "fill-berry text-berry")}
              />
              {saved ? "Saved" : "Save"}
            </Button>
            <Button variant="warm">Draft my questions</Button>
          </div>
          <p className="mt-2 text-step-2 text-ink-faint">
            Nothing is sent until you read it and press send yourself.
          </p>
        </header>

        {/* ---- Worth asking ---- */}
        {(conflicts.length > 0 || score.openQuestions.length > 0) && (
          <section className="panel mt-4 border-sunshine/30 bg-sunshine-pale p-5">
            <h2 className="font-display text-step-6 font-bold text-sunshine-ink">
              Worth asking about
            </h2>
            <ul className="mt-3 flex flex-col gap-2">
              {score.openQuestions.map((q) => (
                <li
                  key={q}
                  className="flex items-start gap-2 text-step-3 leading-relaxed text-sunshine-ink"
                >
                  <AlertTriangle className="mt-0.5 size-4 shrink-0" />
                  {q}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* ---- Why this score ---- */}
        <section className="panel mt-4 p-5 sm:p-6">
          <h2 className="font-display text-step-6 font-bold text-ink">
            Why {score.total} out of 100
          </h2>
          <ul className="mt-4 flex flex-col gap-4">
            {score.components.map((c) => (
              <li key={c.key}>
                <div className="flex items-baseline justify-between gap-3">
                  <span className="text-step-4 font-semibold text-ink">
                    {c.label}
                  </span>
                  <span className="text-step-3 tabular-nums text-ink-faint">
                    {c.points} / {c.weight}
                  </span>
                </div>
                <Progress
                  value={(c.points / Math.max(c.weight, 1)) * 100}
                  className="mt-1.5 h-2 bg-paper-deep"
                />
                <p className="mt-1.5 text-step-3 text-ink-soft">{c.note}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* ---- Where each fact came from ---- */}
        <section className="panel mt-4 p-5 sm:p-6">
          <h2 className="font-display text-step-6 font-bold text-ink">
            Where each fact came from
          </h2>
          <p className="mt-1 text-step-3 text-ink-soft">
            Tap a row to see the exact wording and the source.
          </p>

          <Accordion type="single" collapsible className="mt-3">
            {facts.map((fact) => (
              <AccordionItem
                key={fact.key}
                value={fact.key}
                className="border-line"
              >
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
                      <li
                        key={`${fact.key}-${i}`}
                        className="rounded-[var(--radius-btn)] bg-paper-deep p-3"
                      >
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

        {/* ---- Address ---- */}
        <section className="panel mt-4 p-5 sm:p-6">
          <h2 className="font-display text-step-6 font-bold text-ink">
            Getting there
          </h2>
          <p className="mt-2 text-step-3 leading-relaxed text-ink-soft">
            {school.address}
          </p>

          <p className="mt-3 text-step-2 text-ink-faint">
            On the map below, the white ring is Sector 47, where your search
            starts.
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
        </section>

        <div className="mt-3 h-60 overflow-hidden rounded-[var(--radius-card)] sm:h-72">
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
          />
        </div>
      </div>
    </AppShell>
  );
}
