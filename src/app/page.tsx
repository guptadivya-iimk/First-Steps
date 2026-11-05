import React from "react";
import Link from "next/link";
import { Car, ShieldCheck, MessageSquare, Compass, ArrowRight } from "lucide-react";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-bg flex flex-col justify-between p-4 sm:p-8">
      {/* Top Bar */}
      <header className="max-w-xl mx-auto w-full flex items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-teal-primary text-white flex items-center justify-center font-heading font-bold">
            <Compass className="w-5 h-5 stroke-[2.2]" />
          </div>
          <span className="font-heading font-bold text-text-main text-lg tracking-tight">
            FirstSteps Finder
          </span>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-chip bg-teal-tint text-teal-text border border-teal-text/20">
          Gurugram
        </span>
      </header>

      {/* Main Hero Card */}
      <div className="max-w-xl mx-auto w-full my-auto py-6">
        <div className="bg-bg-card rounded-card border border-border-light shadow-card p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-text-main leading-tight mb-3">
            Find the right first school, without the guesswork.
          </h1>
          <p className="text-sm sm:text-base text-text-muted mb-8 leading-relaxed">
            Montessori authenticity, child safety, and daycare flexibility,
            checked for you. Every fact clearly shows where it came from.
          </p>

          {/* 3 Benefit Rows */}
          <div className="space-y-4 mb-8">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-teal-tint text-teal-text flex items-center justify-center flex-shrink-0 mt-0.5">
                <Car className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-text-main">
                  Schools within your cab time
                </h3>
                <p className="text-xs text-text-muted leading-relaxed">
                  Traffic-aware routes calculated for weekday morning drop-off
                  and afternoon pickup.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-teal-tint text-teal-text flex items-center justify-center flex-shrink-0 mt-0.5">
                <ShieldCheck className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-text-main">
                  Real Montessori and safety checks
                </h3>
                <p className="text-xs text-text-muted leading-relaxed">
                  AMI/AMS teacher training audits and parent CCTV access verified
                  with transparent sources.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-teal-tint text-teal-text flex items-center justify-center flex-shrink-0 mt-0.5">
                <MessageSquare className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-text-main">
                  Ask schools in one tap
                </h3>
                <p className="text-xs text-text-muted leading-relaxed">
                  Personalized WhatsApp, email, and call drafts. Nothing is sent
                  without your explicit OK.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Link
              href="/welcome"
              className="w-full min-h-touch inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-btn bg-teal-primary hover:bg-teal-hover active:bg-teal-hover text-white text-sm font-semibold shadow-sm transition-colors"
            >
              <span>Continue with Google</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/shortlist"
              className="w-full min-h-touch inline-flex items-center justify-center gap-2 px-6 py-3 rounded-btn border border-border text-xs font-semibold text-text-main hover:bg-bg transition-colors"
            >
              <span>Explore Sector 47 Schools (Preview)</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="max-w-xl mx-auto w-full py-4 text-center text-xs text-text-muted">
        <div className="flex items-center justify-center gap-4">
          <Link href="/how-it-works" className="hover:underline">
            How it works
          </Link>
          <span>·</span>
          <Link href="/privacy" className="hover:underline">
            Privacy policy
          </Link>
          <span>·</span>
          <span>Sector 47, Gurugram</span>
        </div>
      </footer>
    </main>
  );
}
