import React from "react";
import Link from "next/link";
import { Car, ShieldCheck, Send, ArrowRight, Map as MapIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Footprint, Sun, Rainbow } from "@/components/doodles";

const PROMISES = [
  {
    Icon: MapIcon,
    crayon: "crayon crayon-coral",
    title: "An atlas, not a list",
    body: "Every preschool pinned, with its fit score on the pin.",
  },
  {
    Icon: Car,
    crayon: "crayon crayon-marigold",
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
    crayon: "crayon crayon-sky",
    title: "Questions, drafted",
    body: "We write the message. You decide whether to send it.",
  },
];

export default function LandingPage() {
  return (
    <main className="paper-grid min-h-dvh">
      <div className="mx-auto flex min-h-dvh w-full max-w-5xl flex-col px-4 sm:px-6">
        <header className="flex min-h-touch items-center justify-between py-5">
          <span className="flex items-center gap-2">
            <span className="flex size-9 items-center justify-center rounded-[var(--radius-btn)] bg-teal text-white">
              <Footprint className="size-5" />
            </span>
            <span className="font-display text-step-6 leading-none font-extrabold tracking-tight">
              FirstSteps
            </span>
          </span>
          <span className="rounded-[var(--radius-chip)] border border-teal/25 bg-teal-pale px-3 py-1.5 text-step-2 font-semibold text-teal-ink">
            Gurugram
          </span>
        </header>

        <div className="flex flex-1 flex-col justify-center gap-10 py-8 lg:flex-row lg:items-center lg:gap-16 lg:py-16">
          {/* ---- The pitch ---- */}
          <div className="flex-1">
            <p className="mb-4 inline-flex items-center gap-2 rounded-[var(--radius-chip)] border border-coral/30 bg-coral-pale px-3 py-1.5 text-step-2 font-bold text-coral-ink">
              14 preschools, all checked
            </p>

            <h1 className="font-display text-step-9 leading-[1.08] font-extrabold text-ink sm:text-step-10 lg:text-step-11">
              A first school you can{" "}
              <span className="crayon-underline">feel good</span> about.
            </h1>

            <p className="mt-5 max-w-md text-step-5 leading-relaxed text-ink-soft">
              Fourteen preschools near Sector 47, checked for Montessori
              training, safety and daycare hours. Every fact shows where it came
              from.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="sm:w-auto">
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

          {/* ---- What you get ---- */}
          <div className="panel relative flex-1 p-5 sm:p-7">
            <Sun className="sway absolute -top-4 -right-3 size-10" />

            <ul className="flex flex-col gap-5">
              {PROMISES.map(({ Icon, title, body, crayon }) => (
                <li key={title} className={cn(crayon, "flex items-start gap-3.5")}>
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-[var(--radius-btn)] bg-[var(--crayon-pale)] text-[var(--crayon-ink)]">
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

            <div className="mt-6 flex items-center gap-3 border-t border-line pt-5">
              <Rainbow className="h-8 w-14 shrink-0" />
              <p className="text-step-3 text-ink-soft">
                Made for families starting out in Sector 47.
              </p>
            </div>
          </div>
        </div>

        <footer className="flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-line py-5 text-step-2 text-ink-faint">
          <Link href="/how-it-works" className="inline-flex min-h-touch items-center hover:text-teal-ink">
            How it works
          </Link>
          <Link href="/privacy" className="inline-flex min-h-touch items-center hover:text-teal-ink">
            Privacy
          </Link>
          <span className="ml-auto">Sector 47, Gurugram</span>
        </footer>
      </div>
    </main>
  );
}
