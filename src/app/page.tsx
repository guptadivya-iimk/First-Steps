import React from "react";
import Link from "next/link";
import { Car, ShieldCheck, Send, ArrowRight, Map as MapIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Footprint,
  Squiggle,
  Burst,
  Curl,
  HillDivider,
  Rainbow,
} from "@/components/doodles";

const PROMISES = [
  {
    Icon: MapIcon,
    crayon: "crayon crayon-tangerine",
    title: "An atlas, not a list",
    body: "Every preschool pinned, with its fit score on the pin.",
  },
  {
    Icon: Car,
    crayon: "crayon crayon-sunshine",
    title: "Real cab times",
    body: "Minutes at 9am traffic, not distance on a map.",
  },
  {
    Icon: ShieldCheck,
    crayon: "crayon crayon-grape",
    title: "Montessori, checked",
    body: "Teacher training and parent CCTV, with the source for each.",
  },
  {
    Icon: Send,
    crayon: "crayon crayon-lagoon",
    title: "Questions, drafted",
    body: "We write the message. You decide whether to send it.",
  },
];

export default function LandingPage() {
  return (
    <main className="min-h-dvh bg-paper">
      {/* ---------- Top bar ---------- */}
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-5 sm:px-6">
        <span className="flex min-h-touch items-center gap-2">
          <span className="flex size-9 items-center justify-center rounded-[var(--radius-btn)] bg-tangerine text-ink">
            <Footprint className="size-5" />
          </span>
          <span className="font-display text-step-6 leading-none font-extrabold tracking-tight">
            FirstSteps
          </span>
        </span>
        <span className="rounded-[var(--radius-chip)] border border-ink/15 bg-sand px-3 py-1.5 text-step-2 font-bold text-ink">
          Gurugram
        </span>
      </header>

      {/* ---------- Hero ---------- */}
      <section className="paper-grid relative overflow-hidden">
        <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 pt-6 pb-24 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:gap-14 lg:pt-10 lg:pb-32">
          <div className="relative">
            <Curl className="absolute -top-6 right-4 hidden size-12 text-ink/25 lg:block" />

            {/* The block headline: flat colour, sharp corners, staggered. */}
            <h1 className="block-line text-step-10 sm:text-step-11">
              <span className="block-word block-word--a">A first school</span>
              <span className="block-word block-word--b">you can trust</span>
            </h1>

            <div className="mt-7 flex items-start gap-3">
              <Squiggle className="mt-1 hidden h-4 w-16 shrink-0 text-ink/35 sm:block" />
              <p className="max-w-md text-step-5 leading-relaxed text-ink-soft">
                Fourteen preschools near Sector 47, checked for Montessori
                training, safety and daycare hours. Every fact shows where it
                came from.
              </p>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/welcome">
                  Continue with Google
                  <ArrowRight />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/shortlist">Look around first</Link>
              </Button>
            </div>

            <p className="mt-4 text-step-2 text-ink-faint">
              Free while we are testing in Sector 47.
            </p>
          </div>

          {/* ---------- What you get ---------- */}
          <div className="relative">
            <Burst className="absolute -top-5 -left-4 hidden size-11 text-ink/25 lg:block" />

            <ul className="flex flex-col gap-2.5">
              {PROMISES.map(({ Icon, title, body, crayon }, i) => (
                <li
                  key={title}
                  data-on={i === 0}
                  className={cn(crayon, "row-flat flex items-start gap-3.5 p-4")}
                >
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--crayon)] text-[var(--crayon-on)]">
                    <Icon className="size-5" />
                  </span>
                  <div>
                    <h2 className="font-display text-step-5 font-bold text-ink">
                      {title}
                    </h2>
                    <p className="mt-0.5 text-step-3 leading-relaxed text-ink-soft">
                      {body}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-5 flex items-center gap-3 px-1">
              <Rainbow className="h-7 w-12 shrink-0" />
              <p className="text-step-3 text-ink-soft">
                Made for families starting out in Sector 47.
              </p>
            </div>
          </div>
        </div>

        <HillDivider className="absolute inset-x-0 bottom-0 h-14 text-paper-raised sm:h-20" />
      </section>

      {/* ---------- Footer ---------- */}
      <footer className="bg-paper-raised">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-8 text-step-2 text-ink-faint sm:px-6">
          <Link
            href="/how-it-works"
            className="inline-flex min-h-touch items-center font-semibold hover:text-tangerine-ink"
          >
            How it works
          </Link>
          <Link
            href="/privacy"
            className="inline-flex min-h-touch items-center font-semibold hover:text-tangerine-ink"
          >
            Privacy
          </Link>
          <span className="ml-auto">Sector 47, Gurugram</span>
        </div>
      </footer>
    </main>
  );
}
