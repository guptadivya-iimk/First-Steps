"use client";

import React, { use, useState, useEffect } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SEED_SCHOOLS } from "@/data/seedSchools";
import { StatusTag } from "@/components/schools/StatusTag";
import { FitScoreBadge } from "@/components/schools/FitScoreBadge";
import { Header } from "@/components/navigation/Header";
import { BottomNav } from "@/components/navigation/BottomNav";
import { DesktopSidebar } from "@/components/navigation/DesktopSidebar";
import {
  UserWeights,
  DEFAULT_WEIGHTS,
  loadSavedWeights,
  WEIGHT_KEYS,
  WEIGHT_LABELS,
} from "@/lib/scoring/weights";
import { computeFitScore } from "@/lib/scoring/engine";
import {
  ArrowLeft,
  ExternalLink,
  Phone,
  MessageSquare,
  Mail,
  Send,
  AlertTriangle,
  Sliders,
  Mic,
} from "lucide-react";

export default function SchoolDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const school = SEED_SCHOOLS.find((s) => s.id === id);

  const [weights, setWeights] = useState<UserWeights>(DEFAULT_WEIGHTS);

  useEffect(() => {
    setWeights(loadSavedWeights());
  }, []);

  if (!school) {
    notFound();
  }

  const phone = school.contacts.find((c) => c.type === "phone")?.value;
  const whatsapp =
    school.contacts.find((c) => c.type === "whatsapp")?.value ||
    phone?.replace(/[^0-9]/g, "");
  const email = school.contacts.find((c) => c.type === "email")?.value;

  const scoreResult = computeFitScore(school, {
    weights,
    maxTravelMinutes: 20,
    dropMinutes: 8,
    pickupMinutes: 8,
  });

  const factsList = Object.values(school.facts);

  return (
    <div className="min-h-screen bg-bg flex">
      <DesktopSidebar />

      <div className="flex-1 flex flex-col min-w-0 pb-20 lg:pb-8">
        <Header userName="Divya" areaLabel="Sector 47, Gurugram" />

        <main className="max-w-4xl w-full mx-auto px-4 sm:px-6 py-6">
          {/* Back link */}
          <Link
            href="/shortlist"
            className="min-h-touch inline-flex items-center gap-1.5 text-xs font-semibold text-teal-text hover:text-teal-primary mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to shortlist</span>
          </Link>

          {/* School Hero Header */}
          <div className="bg-bg-card rounded-card border border-border-light shadow-card p-6 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div>
                <span className="text-xs font-semibold text-teal-text uppercase tracking-wider block mb-1">
                  {school.sector} · Gurugram
                </span>
                <h1 className="text-2xl sm:text-3xl font-heading font-bold text-text-main mb-2">
                  {school.name}
                </h1>
                <p className="text-xs text-text-muted leading-relaxed max-w-xl">
                  {school.address}
                </p>

                {/* External Links */}
                <div className="flex items-center gap-4 mt-3 text-xs">
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      school.name + " " + school.address
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-teal-primary hover:underline font-medium"
                  >
                    <span>Open in Google Maps</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              <FitScoreBadge score={scoreResult.totalScore} size="lg" />
            </div>

            {/* Quick Contact Action Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6 pt-6 border-t border-border-light">
              {phone ? (
                <a
                  href={`tel:${phone}`}
                  className="min-h-touch flex items-center justify-center gap-2 px-4 py-2.5 rounded-btn border border-border text-xs font-semibold text-text-main hover:bg-bg transition-colors"
                >
                  <Phone className="w-4 h-4 text-teal-primary" />
                  <span>Call {phone}</span>
                </a>
              ) : (
                <div className="min-h-touch flex items-center justify-center gap-2 px-4 py-2.5 rounded-btn border border-dashed border-border-light text-xs text-text-muted">
                  No phone listed
                </div>
              )}

              {whatsapp ? (
                <a
                  href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-h-touch flex items-center justify-center gap-2 px-4 py-2.5 rounded-btn border border-teal-text/30 bg-teal-tint text-xs font-semibold text-teal-text hover:bg-teal-tint/80 transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>WhatsApp</span>
                </a>
              ) : (
                <div className="min-h-touch flex items-center justify-center gap-2 px-4 py-2.5 rounded-btn border border-dashed border-border-light text-xs text-text-muted">
                  No WhatsApp listed
                </div>
              )}

              {email ? (
                <a
                  href={`mailto:${email}`}
                  className="min-h-touch flex items-center justify-center gap-2 px-4 py-2.5 rounded-btn border border-border text-xs font-semibold text-text-main hover:bg-bg transition-colors"
                >
                  <Mail className="w-4 h-4 text-teal-primary" />
                  <span>Email</span>
                </a>
              ) : (
                <div className="min-h-touch flex items-center justify-center gap-2 px-4 py-2.5 rounded-btn border border-dashed border-border-light text-xs text-text-muted">
                  No email listed
                </div>
              )}
            </div>

            {/* Primary Action: Ask School */}
            <div className="mt-4">
              <button
                onClick={() => {
                  alert(
                    "Message Composer (WhatsApp / Email / Call Script) will be implemented in Phase 4."
                  );
                }}
                className="w-full min-h-touch inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-btn bg-teal-primary hover:bg-teal-hover text-white text-sm font-semibold shadow-sm transition-colors"
              >
                <Send className="w-4 h-4" />
                <span>Ask the school (AI drafts questions for approval)</span>
              </button>
            </div>
          </div>

          {/* Dynamic Score Breakdown (Section 6.5) */}
          <div className="bg-bg-card rounded-card border border-border-light shadow-card p-6 mb-6">
            <div className="flex items-center justify-between gap-2 mb-4">
              <div>
                <h2 className="text-lg font-heading font-bold text-text-main">
                  Fit Score Breakdown ({scoreResult.totalScore} / 100)
                </h2>
                <span className="text-xs text-text-muted">
                  Computed dynamically based on your custom weightages.
                </span>
              </div>
              <Link
                href="/settings/needs"
                className="text-xs font-semibold text-teal-text hover:underline inline-flex items-center gap-1"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Calibrate</span>
              </Link>
            </div>

            <div className="space-y-4">
              {WEIGHT_KEYS.map((k) => {
                const item = scoreResult.breakdown[k];
                const info = WEIGHT_LABELS[k];
                const pct =
                  item.maxPoints > 0
                    ? Math.round((item.earnedPoints / item.maxPoints) * 100)
                    : 0;

                return (
                  <div key={k}>
                    <div className="flex justify-between text-xs font-medium mb-1">
                      <span className="font-semibold text-text-main">
                        {info.title} ({item.maxPoints}%)
                      </span>
                      <span className="font-semibold text-teal-text">
                        {item.earnedPoints} / {item.maxPoints} pts
                      </span>
                    </div>
                    <div className="w-full bg-bg h-2 rounded-full overflow-hidden shadow-inner">
                      <div
                        className="h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${pct}%`,
                          backgroundColor: info.color,
                        }}
                      />
                    </div>
                    <span className="text-[11px] text-text-muted mt-0.5 block">
                      {item.reason}
                    </span>
                  </div>
                );
              })}

              {scoreResult.confidencePenalty > 0 && (
                <div className="pt-2 border-t border-border-light text-xs text-amber-text flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>
                    −{scoreResult.confidencePenalty} pts confidence adjustment applied for conflicting/old listing data. Score may improve once verified by the school.
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Provenance Facts Table */}
          <div className="bg-bg-card rounded-card border border-border-light shadow-card p-6 mb-6">
            <h2 className="text-lg font-heading font-bold text-text-main mb-1">
              Verified Facts & Source Provenance
            </h2>
            <p className="text-xs text-text-muted mb-4">
              Every detail is tracked with its origin source and timestamp.
            </p>

            <div className="divide-y divide-border-light">
              {factsList.map((fact) => (
                <div
                  key={fact.key}
                  className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                >
                  <div className="flex-1">
                    <span className="text-xs font-semibold text-text-main block">
                      {fact.displayText}
                    </span>
                    {fact.conflictNote && (
                      <span className="text-[11px] text-amber-text flex items-center gap-1 mt-0.5">
                        <AlertTriangle className="w-3 h-3" />
                        {fact.conflictNote}
                      </span>
                    )}
                    {fact.sources.length > 0 && (
                      <span className="text-[11px] text-text-muted mt-0.5 block">
                        Source: {fact.sources[0].name} ({fact.sources[0].quote})
                      </span>
                    )}
                  </div>
                  <div className="self-start sm:self-center">
                    <StatusTag status={fact.status} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Notes Section */}
          <div className="bg-bg-card rounded-card border border-border-light shadow-card p-6">
            <h2 className="text-lg font-heading font-bold text-text-main mb-2">
              My Notes & Observations
            </h2>
            <p className="text-xs text-text-muted mb-4">
              Private notes stored securely on your account.
            </p>
            <textarea
              className="w-full h-24 p-3 rounded-xl border border-border text-xs focus:ring-1 focus:ring-teal-primary focus:outline-none"
              placeholder="Record impressions, questions asked on call, or grandparent drop-off notes..."
            />
            <div className="flex justify-end gap-2 mt-3">
              <button
                type="button"
                className="min-h-touch inline-flex items-center gap-1.5 px-3 py-1.5 rounded-btn border border-border text-xs font-medium text-text-muted hover:text-text-main"
              >
                <Mic className="w-4 h-4 text-teal-primary" />
                <span>Voice Note</span>
              </button>
              <button
                type="button"
                className="min-h-touch inline-flex items-center px-4 py-1.5 rounded-btn bg-teal-primary text-white text-xs font-semibold hover:bg-teal-hover"
              >
                Save Notes
              </button>
            </div>
          </div>
        </main>
      </div>

      <BottomNav />
    </div>
  );
}
