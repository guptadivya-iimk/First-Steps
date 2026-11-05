import React from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, ShieldAlert } from "lucide-react";

export default function HowItWorksPage() {
  return (
    <main className="min-h-screen bg-bg p-4 sm:p-8">
      <div className="max-w-2xl mx-auto bg-bg-card rounded-card border border-border-light shadow-card p-6 sm:p-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-text hover:text-teal-primary mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>

        <h1 className="text-2xl font-heading font-bold text-text-main mb-4">
          How FirstSteps Finder Works
        </h1>

        <div className="space-y-4 text-xs sm:text-sm text-text-muted leading-relaxed">
          <p>
            Preschool information in Indian cities is notoriously fragmented and frequently contradictory. Listing platforms often display outdated fee structures, incorrect curriculum badges, and obsolete contact numbers.
          </p>

          <div className="p-4 bg-bg rounded-xl border border-border-light space-y-2">
            <h3 className="font-semibold text-text-main text-sm">
              1. Provenance-Tracked Information
            </h3>
            <p>
              We do not invent data. Every piece of school information is stamped with its source (official school website, verified reply, or listing aggregator) and tagged with a confidence status.
            </p>
          </div>

          <div className="p-4 bg-bg rounded-xl border border-border-light space-y-2">
            <h3 className="font-semibold text-text-main text-sm">
              2. Real Commute Times with Traffic
            </h3>
            <p>
              Rather than linear radius circles, we compute cab driving times at exact weekday morning drop-off (09:00 AM) and afternoon pickup (01:00 PM) hours using Google Routes API traffic models.
            </p>
          </div>

          <div className="p-4 bg-bg rounded-xl border border-border-light space-y-2">
            <h3 className="font-semibold text-text-main text-sm">
              3. Strict Human-in-the-Loop Outreach
            </h3>
            <p>
              Our AI engine drafts tailored inquiries highlighting conflicting facts and unverified criteria, but it never contacts schools autonomously. Messages only open on your device after you review and approve every word.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
