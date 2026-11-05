import React from "react";
import Link from "next/link";
import { ArrowLeft, Check, X } from "lucide-react";

const KEPT = [
  "The area you search from, and how long a cab ride you accept",
  "What you weighted as important",
  "Schools you save, notes you write, messages you approve",
];

const NEVER = [
  "Your name, or your child's",
  "Their age, birthday or any government ID",
  "Photographs of your child",
  "Medical or health history",
];

const RIGHTS = [
  {
    title: "Take it with you",
    body: "Download everything we hold as a file, from your account page.",
  },
  {
    title: "Delete it",
    body: "One tap removes your profile, your saved schools and your notes. We keep no shadow copy.",
  },
  {
    title: "Change your mind",
    body: "Withdrawing consent stops the personalised parts and leaves the public school listings working.",
  },
];

export default function PrivacyPage() {
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
          Privacy
        </h1>
        <p className="mt-2 text-step-4 leading-relaxed text-ink-soft">
          This product is about someone else&apos;s child, so it holds nothing
          that points to one. No name, no age, no birthday. Written to meet
          India&apos;s DPDP Act.
        </p>

        <div className="mt-7 grid gap-4 sm:grid-cols-2">
          <section className="panel p-5">
            <h2 className="font-display text-step-5 font-bold text-teal-ink">
              What we keep
            </h2>
            <ul className="mt-3 flex flex-col gap-2">
              {KEPT.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2 text-step-3 leading-relaxed text-ink-soft"
                >
                  <Check className="mt-0.5 size-4 shrink-0 text-teal" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section className="panel p-5">
            <h2 className="font-display text-step-5 font-bold text-ink">
              What we never ask for
            </h2>
            <ul className="mt-3 flex flex-col gap-2">
              {NEVER.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2 text-step-3 leading-relaxed text-ink-soft"
                >
                  <X className="mt-0.5 size-4 shrink-0 text-ink-faint" />
                  {item}
                </li>
              ))}
            </ul>
          </section>
        </div>

        <section className="mt-6">
          <h2 className="font-display text-step-7 font-bold text-ink">
            What you can do
          </h2>
          <dl className="mt-3 flex flex-col gap-3">
            {RIGHTS.map((right) => (
              <div key={right.title} className="panel p-4">
                <dt className="text-step-4 font-bold text-ink">
                  {right.title}
                </dt>
                <dd className="mt-1 text-step-3 leading-relaxed text-ink-soft">
                  {right.body}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="mt-6">
          <h2 className="font-display text-step-7 font-bold text-ink">
            Where it lives
          </h2>
          <p className="mt-2 text-step-3 leading-relaxed text-ink-soft">
            Your data sits in Google Cloud regions inside India. School listings
            are public information and are not tied to you. We sell nothing to
            anyone and run no advertising.
          </p>
        </section>

        <p className="mt-8 text-step-2 text-ink-faint">
          Questions about any of this: gupta.divyaIIMK@gmail.com
        </p>
      </div>
    </main>
  );
}
