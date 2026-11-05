"use client";

import React from "react";
import Link from "next/link";
import { Download, Trash2, ShieldCheck, ArrowLeft } from "lucide-react";
import { AppShell } from "@/components/navigation/AppShell";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { usePreferences, DEFAULT_PREFERENCES } from "@/lib/usePreferences";

export default function SettingsPage() {
  const { prefs, update } = usePreferences();
  const [cleared, setCleared] = React.useState(false);

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(prefs, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "firststeps-data.json";
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    try {
      window.localStorage.removeItem("firststeps_preferences");
      window.localStorage.removeItem("firststeps_consent");
    } catch {
      // Nothing to clear if the store is unavailable.
    }
    update(DEFAULT_PREFERENCES);
    setCleared(true);
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
          Your data
        </h1>
        <p className="mt-1 text-step-3 text-ink-soft">
          We hold a search area and a list of schools. That is the whole file.
        </p>

        <section className="panel mt-5 p-5 sm:p-6">
          <dl className="flex flex-col gap-3 text-step-3">
            <div className="flex justify-between gap-4">
              <dt className="text-ink-soft">Searching from</dt>
              <dd className="font-semibold text-ink">Sector 47, Gurugram</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-ink-soft">Schools saved</dt>
              <dd className="font-semibold text-ink">
                {prefs.shortlisted.length}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-ink-soft">Your name</dt>
              <dd className="font-semibold text-ink-faint">Not stored</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-ink-soft">Your child</dt>
              <dd className="font-semibold text-ink-faint">Not stored</dd>
            </div>
          </dl>

          <Separator className="my-5 bg-line" />

          <div className="flex flex-col gap-2 sm:flex-row">
            <Button type="button" variant="outline" onClick={handleExport}>
              <Download />
              Download my data
            </Button>
            <Button type="button" variant="destructive" onClick={handleClear}>
              <Trash2 />
              Delete everything
            </Button>
          </div>

          {cleared && (
            <p className="mt-3 text-step-3 font-semibold text-teal-ink">
              Done. Nothing about you is stored on this device now.
            </p>
          )}
        </section>

        <section className="panel mt-4 flex items-start gap-3 p-5">
          <ShieldCheck className="mt-0.5 size-5 shrink-0 text-teal" />
          <p className="text-step-3 leading-relaxed text-ink-soft">
            Your name and your child&apos;s details never leave your device, so
            there is nothing here to identify either of you.{" "}
            <Link
              href="/privacy"
              className="font-semibold text-teal-ink hover:underline"
            >
              Read the policy
            </Link>
          </p>
        </section>
      </div>
    </AppShell>
  );
}
