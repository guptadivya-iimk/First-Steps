import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Car,
  Map as MapIcon,
  Quote,
  Video,
  Info,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Kid } from "@/components/characters/Kid";
import { AtlasPreview } from "@/components/landing/AtlasPreview";
import {
  Footprint,
  Squiggle,
  Burst,
  Curl,
  HillDivider,
  Star,
} from "@/components/doodles";

const CHECKS = [
  {
    Icon: BadgeCheck,
    crayon: "crayon crayon-grape",
    title: "Is it really Montessori?",
    body: "Anyone can paint the word on a gate. We show what each school claims and exactly where that claim came from.",
  },
  {
    Icon: Video,
    crayon: "crayon crayon-tangerine",
    title: "Can you watch the CCTV?",
    body: "Cameras on the wall and a live feed on your phone are different things. We say which one a school offers.",
  },
  {
    Icon: Car,
    crayon: "crayon crayon-sunshine",
    title: "How long is the cab ride?",
    body: "An estimate in minutes for the morning school run, rather than a circle drawn on a map.",
  },
  {
    Icon: Quote,
    crayon: "crayon crayon-lagoon",
    title: "Who says so?",
    body: "Every fact carries its source and the date we read it. When two sources disagree, you see both.",
  },
];

const STEPS = [
  {
    n: "1",
    tone: "block-word--d",
    title: "Tell us what matters",
    body: "Share a hundred points between Montessori, safety, daycare, travel and fees.",
  },
  {
    n: "2",
    tone: "block-word--c",
    title: "Compare side by side",
    body: "A list, a map and a table, each ranked by what you said matters most.",
  },
  {
    n: "3",
    tone: "block-word--b",
    title: "Ask the right questions",
    body: "We draft the message to the school. Nothing goes out until you send it yourself.",
  },
];

const NAV = [
  { href: "#how", label: "How it works", Icon: Info },
  { href: "/shortlist?view=map", label: "The Atlas", Icon: MapIcon },
  { href: "/privacy", label: "Privacy", Icon: Lock },
];

function Wordmark() {
  return (
    <span className="flex min-h-touch items-center gap-2">
      <span className="flex size-9 items-center justify-center rounded-[var(--radius-btn)] bg-tangerine text-ink">
        <Footprint className="size-5" />
      </span>
      <span className="font-display text-step-6 leading-none font-extrabold tracking-tight">
        FirstSteps
      </span>
    </span>
  );
}

export default function LandingPage() {
  return (
    <main className="min-h-dvh overflow-x-clip bg-paper">
      {/* ================= Header ================= */}
      <header className="relative z-20 mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link href="/" aria-label="FirstSteps home" className="anim-rise">
          <Wordmark />
        </Link>

        <nav aria-label="Site" className="hidden items-center gap-1 md:flex">
          {NAV.map(({ href, label, Icon }) => (
            <Link
              key={href}
              href={href}
              className="inline-flex min-h-touch items-center gap-2 rounded-[var(--radius-btn)] px-3 text-step-3 font-semibold text-ink-soft transition-colors hover:bg-paper-deep hover:text-ink"
            >
              <Icon className="size-4" />
              {label}
            </Link>
          ))}
        </nav>

        <Button asChild size="sm" className="anim-rise anim-d1">
          <Link href="/welcome">Find a school</Link>
        </Button>
      </header>

      {/* ================= Hero ================= */}
      <section className="paper-grid relative">
        <div className="relative mx-auto grid w-full max-w-6xl gap-6 px-4 pt-6 pb-24 sm:px-6 sm:pb-28 lg:grid-cols-[1.08fr_1fr] lg:items-center lg:gap-6 lg:pt-10 lg:pb-36">
          <div className="relative z-10">
            <h1 className="block-line text-step-10 sm:text-step-11 xl:text-step-12">
              <span className="anim-block block-word block-word--a">
                A first school
              </span>
              <span className="anim-block anim-d2 block-word block-word--b">
                you can trust
              </span>
            </h1>

            <div className="anim-rise anim-d4 mt-7 flex items-start gap-3">
              <Squiggle className="mt-1.5 hidden h-4 w-16 shrink-0 text-ink/35 sm:block" />
              <p className="max-w-md text-step-5 leading-relaxed text-ink-soft">
                Fourteen preschools near Sector 47, Gurugram, checked for
                Montessori training, safety and daycare hours. Every fact shows
                where it came from.
              </p>
            </div>

            <div className="anim-rise anim-d5 mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/welcome">
                  Find a school
                  <ArrowRight />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/shortlist">Look around first</Link>
              </Button>
            </div>

            <p className="anim-rise anim-d6 mt-4 flex items-center gap-2 text-step-2 text-ink-faint">
              <Star className="size-3.5 text-sunshine-ink" />
              Free, and nothing about your child is stored.
            </p>
          </div>

          {/* The girl, laughing up at her balloons. */}
          <div className="relative mx-auto w-full max-w-[19rem] sm:max-w-[23rem] lg:max-w-[28rem]">
            <Burst className="doodle-drift absolute top-[6%] -left-[4%] z-10 size-12 text-ink/25" />
            <Curl className="doodle-drift doodle-drift--slow absolute top-[40%] -right-[2%] z-10 size-12 text-ink/20" />
            <Squiggle className="doodle-drift absolute -bottom-1 left-[10%] z-10 h-4 w-20 text-tangerine/60" />
            <Kid who="girl" priority className="anim-pop anim-d2" />
          </div>
        </div>

        <HillDivider className="absolute inset-x-0 bottom-0 h-14 text-paper-raised sm:h-20" />
      </section>

      {/* ================= What we check ================= */}
      <section id="check" className="bg-paper-raised">
        <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-16 lg:py-24">
          <div className="relative order-2 mx-auto w-full max-w-[17rem] sm:max-w-[21rem] lg:order-1 lg:max-w-[26rem]">
            <Burst className="doodle-drift absolute top-[22%] right-[2%] z-10 size-11 text-ink/25" />
            <Squiggle className="doodle-drift doodle-drift--slow absolute bottom-[3%] left-[6%] z-10 h-4 w-20 text-lagoon-ink/50" />
            <Kid who="boy" />
          </div>

          <div className="order-1 lg:order-2">
            <h2 className="text-step-8 sm:text-step-9">
              <span className="block-word block-word--d tilt-l">
                What we check
              </span>
            </h2>
            <p className="mt-5 max-w-lg text-step-5 leading-relaxed text-ink-soft">
              The four questions every parent asks first, answered with the
              source beside each answer.
            </p>

            <ul className="mt-7 flex flex-col gap-2.5">
              {CHECKS.map(({ Icon, title, body, crayon }, i) => (
                <li
                  key={title}
                  data-on={i === 0}
                  className={cn(crayon, "row-flat hover-lift flex items-start gap-4 p-4 sm:p-5")}
                >
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--crayon)] text-[var(--crayon-on)]">
                    <Icon className="size-5" />
                  </span>
                  <div>
                    <h3 className="font-display text-step-6 font-bold text-ink">
                      {title}
                    </h3>
                    <p className="mt-1 text-step-4 leading-relaxed text-ink-soft">
                      {body}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ================= Atlas ================= */}
      <section id="atlas" className="relative bg-paper">
        <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 pt-16 pb-28 sm:px-6 lg:grid-cols-[1fr_1.2fr] lg:items-center lg:gap-14 lg:pt-24 lg:pb-36">
          <div>
            <h2 className="text-step-8 sm:text-step-9">
              <span className="block-word block-word--c tilt-r">
                Every school, pinned
              </span>
            </h2>
            <p className="mt-5 max-w-md text-step-5 leading-relaxed text-ink-soft">
              The number on each pin is that school&apos;s fit score for your
              family. Tap a pin and it tells you why.
            </p>
            <Button asChild size="lg" variant="secondary" className="mt-7">
              <Link href="/shortlist?view=map">
                <MapIcon />
                Open the Atlas
              </Link>
            </Button>
          </div>

          <div className="panel overflow-hidden">
            <AtlasPreview />
          </div>
        </div>
        <HillDivider className="absolute inset-x-0 bottom-0 h-14 text-paper-raised sm:h-20" />
      </section>

      {/* ================= How it works ================= */}
      <section id="how" className="relative bg-paper-raised">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
          <h2 className="text-step-8 sm:text-step-9">
            <span className="block-word block-word--e tilt-l">
              How it works
            </span>
          </h2>

          <ol className="mt-10 grid gap-4 md:grid-cols-3">
            {STEPS.map((step) => (
              <li key={step.n} className="panel hover-lift p-6">
                <span
                  className={cn(
                    "block-word inline-flex min-w-12 justify-center text-step-9",
                    step.tone
                  )}
                >
                  {step.n}
                </span>
                <h3 className="mt-5 font-display text-step-7 font-bold text-ink">
                  {step.title}
                </h3>
                <p className="mt-2 text-step-4 leading-relaxed text-ink-soft">
                  {step.body}
                </p>
              </li>
            ))}
          </ol>

          <div className="mt-12 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
            <Button asChild size="lg">
              <Link href="/welcome">
                Find a school
                <ArrowRight />
              </Link>
            </Button>
            <p className="text-step-3 text-ink-faint">
              Takes about two minutes. No sign-up form.
            </p>
          </div>
        </div>
      </section>

      {/* ================= Footer ================= */}
      <footer className="bg-ink text-paper">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="flex items-center gap-2">
            <span className="flex size-9 items-center justify-center rounded-[var(--radius-btn)] bg-tangerine text-ink">
              <Footprint className="size-5" />
            </span>
            <span className="font-display text-step-6 font-extrabold">
              FirstSteps
            </span>
          </div>
          <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-1 text-step-3">
            <Link href="/how-it-works" className="inline-flex min-h-touch items-center text-paper/80 hover:text-paper">
              How it works
            </Link>
            <Link href="/privacy" className="inline-flex min-h-touch items-center text-paper/80 hover:text-paper">
              Privacy
            </Link>
            <Link href="/shortlist" className="inline-flex min-h-touch items-center text-paper/80 hover:text-paper">
              All schools
            </Link>
          </nav>
          <p className="text-step-2 text-paper/70">Made in Gurugram.</p>
        </div>
      </footer>
    </main>
  );
}
