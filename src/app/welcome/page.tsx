"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Shield, Check, Lock, Trash2, ArrowRight } from "lucide-react";

export default function WelcomeConsentPage() {
  const router = useRouter();
  const [agreed, setAgreed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (agreed) {
      if (typeof window !== "undefined") {
        localStorage.setItem(
          "firststeps_consent",
          JSON.stringify({
            accepted: true,
            acceptedAt: new Date().toISOString(),
          })
        );
      }
      router.push("/shortlist");
    }
  };

  return (
    <main className="min-h-screen bg-bg flex flex-col justify-center items-center p-4 sm:p-6">
      <div className="max-w-md w-full bg-bg-card rounded-card border border-border-light shadow-card p-6 sm:p-8">
        <div className="w-12 h-12 rounded-2xl bg-teal-tint text-teal-text flex items-center justify-center mb-4">
          <Shield className="w-6 h-6 stroke-[2.2]" />
        </div>

        <h1 className="text-xl sm:text-2xl font-heading font-bold text-text-main mb-2">
          Your child&apos;s privacy comes first.
        </h1>
        <p className="text-xs sm:text-sm text-text-muted mb-6 leading-relaxed">
          In accordance with India&apos;s Digital Personal Data Protection (DPDP) Act,
          we require verifiable parental consent before personalizing your school discovery.
        </p>

        <div className="space-y-4 mb-6">
          <div className="flex items-start gap-3 p-3 bg-bg rounded-xl border border-border-light">
            <Check className="w-4 h-4 text-teal-primary flex-shrink-0 mt-0.5" />
            <div className="text-xs">
              <span className="font-semibold text-text-main block">What we store:</span>
              <span className="text-text-muted">
                Your child&apos;s age in months, Sector 47 search location, shortlisted schools, and messages you approve.
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-bg rounded-xl border border-border-light">
            <Lock className="w-4 h-4 text-teal-primary flex-shrink-0 mt-0.5" />
            <div className="text-xs">
              <span className="font-semibold text-text-main block">What we never collect:</span>
              <span className="text-text-muted">
                No child photographs, exact date of birth, Aadhaar numbers, or medical history.
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-bg rounded-xl border border-border-light">
            <Trash2 className="w-4 h-4 text-teal-primary flex-shrink-0 mt-0.5" />
            <div className="text-xs">
              <span className="font-semibold text-text-main block">Full control:</span>
              <span className="text-text-muted">
                You can export your shortlist data or delete your account completely at any time.
              </span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <label className="flex items-start gap-3 mb-6 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-1 w-4 h-4 rounded text-teal-primary focus:ring-teal-primary border-border"
              required
            />
            <span className="text-xs text-text-main leading-snug">
              I confirm that I am the parent or legal guardian, and I consent to the storage of my search preferences.
            </span>
          </label>

          <button
            type="submit"
            disabled={!agreed}
            className={`w-full min-h-touch inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-btn text-sm font-semibold transition-colors ${
              agreed
                ? "bg-teal-primary hover:bg-teal-hover active:bg-teal-hover text-white shadow-sm cursor-pointer"
                : "bg-border-light text-text-muted cursor-not-allowed"
            }`}
          >
            <span>Proceed to Shortlist</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </main>
  );
}
