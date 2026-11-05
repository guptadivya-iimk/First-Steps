"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sprout } from "@/components/doodles";

const KEPT = [
  "The part of Sector 47 you search from",
  "What you told us matters most",
  "Schools you save and messages you approve",
];

const NEVER = [
  "Your name or your child's",
  "Their age, birthday or Aadhaar",
  "Photos, or any medical history",
];

export default function WelcomeConsentPage() {
  const router = useRouter();
  const [agreed, setAgreed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) return;
    try {
      window.localStorage.setItem(
        "firststeps_consent",
        JSON.stringify({ accepted: true, acceptedAt: new Date().toISOString() })
      );
    } catch {
      // A blocked store should not stop a parent getting to the schools.
    }
    router.push("/shortlist");
  };

  return (
    <main className="paper-grid flex min-h-dvh flex-col items-center justify-center px-4 py-10 sm:px-6">
      <div className="panel w-full max-w-lg p-6 sm:p-8">
        <h1 className="font-display text-step-8 leading-tight font-extrabold text-ink">
          Before we start
        </h1>
        <p className="mt-2 text-step-4 leading-relaxed text-ink-soft">
          India&apos;s DPDP Act asks permission before anyone keeps data about
          a child. We decided the easiest way to pass that test was to keep
          nothing that points to either of you.
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <section className="rounded-[var(--radius-btn)] bg-teal-pale p-4">
            <h2 className="text-step-3 font-bold text-teal-ink">We keep</h2>
            <ul className="mt-2 flex flex-col gap-1.5">
              {KEPT.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2 text-step-3 leading-snug text-teal-ink"
                >
                  <Check className="mt-0.5 size-3.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-[var(--radius-btn)] bg-paper-deep p-4">
            <h2 className="text-step-3 font-bold text-ink">We never ask for</h2>
            <ul className="mt-2 flex flex-col gap-1.5">
              {NEVER.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2 text-step-3 leading-snug text-ink-soft"
                >
                  <X className="mt-0.5 size-3.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </section>
        </div>

        <form onSubmit={handleSubmit} className="mt-6">
          <label className="flex min-h-touch cursor-pointer items-start gap-3 rounded-[var(--radius-btn)] border border-line-strong p-3.5 text-step-4 leading-relaxed text-ink has-checked:border-teal has-checked:bg-teal-pale">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-0.5 size-5 shrink-0 accent-[var(--teal)]"
            />
            <span>
              I am the parent or guardian, and I agree to this.
            </span>
          </label>

          <Button
            type="submit"
            size="lg"
            disabled={!agreed}
            className="mt-4 w-full"
          >
            Show me the schools
            <ArrowRight />
          </Button>
        </form>

        <p className="mt-5 flex items-center gap-2.5 text-step-2 text-ink-faint">
          <Sprout className="size-6 shrink-0" />
          You can delete all of it from your account page, any time.
        </p>
      </div>

      <Link
        href="/privacy"
        className="mt-3 inline-flex min-h-touch items-center text-step-3 font-semibold text-teal-ink hover:underline"
      >
        Read the full privacy policy
      </Link>
    </main>
  );
}
