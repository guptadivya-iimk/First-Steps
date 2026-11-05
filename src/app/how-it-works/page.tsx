import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { DoodleDivider, Sprout } from "@/components/doodles";

const STEPS = [
  {
    title: "We show our sources",
    body: "Listing sites carry old fees and curriculum badges a school never claimed. So every fact here is stamped with where it came from, and we say plainly when two sources disagree.",
  },
  {
    title: "We measure the real ride",
    body: "A circle on a map says nothing about Sohna Road at 9am. We work in minutes by cab, at the hour you would actually be doing drop-off.",
  },
  {
    title: "You do the talking",
    body: "We draft the questions a school has not answered yet. The message opens in your own WhatsApp or mail app, and goes nowhere until you send it.",
  },
];

export default function HowItWorksPage() {
  return (
    <main className="paper-grid min-h-dvh px-4 py-8 sm:px-6">
      <div className="mx-auto w-full max-w-xl">
        <Link
          href="/"
          className="inline-flex min-h-touch items-center gap-1.5 text-step-3 font-semibold text-teal-ink hover:underline"
        >
          <ArrowLeft className="size-4" />
          Back
        </Link>

        <h1 className="mt-3 font-display text-step-9 leading-tight font-extrabold text-ink">
          How this works
        </h1>

        <ol className="mt-7 flex flex-col gap-5">
          {STEPS.map((step, i) => (
            <li key={step.title} className="panel flex gap-4 p-5">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-[var(--radius-chip)] bg-teal-pale font-display text-step-4 font-extrabold text-teal-ink">
                {i + 1}
              </span>
              <div>
                <h2 className="font-display text-step-6 font-bold text-ink">
                  {step.title}
                </h2>
                <p className="mt-1.5 text-step-4 leading-relaxed text-ink-soft">
                  {step.body}
                </p>
              </div>
            </li>
          ))}
        </ol>

        <DoodleDivider className="my-7" />

        <p className="flex items-center justify-center gap-2.5 text-step-3 text-ink-faint">
          <Sprout className="size-6 shrink-0" />
          Fourteen schools so far, all within reach of Sector 47.
        </p>
      </div>
    </main>
  );
}
