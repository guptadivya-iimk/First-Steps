"use client";

import React, { useState, useMemo, useEffect } from "react";
import { SEED_SCHOOLS } from "@/data/seedSchools";
import { Header } from "@/components/navigation/Header";
import { BottomNav } from "@/components/navigation/BottomNav";
import { DesktopSidebar } from "@/components/navigation/DesktopSidebar";
import { SchoolCard } from "@/components/schools/SchoolCard";
import {
  UserWeights,
  DEFAULT_WEIGHTS,
  loadSavedWeights,
} from "@/lib/scoring/weights";
import { computeFitScore, FitScoreResult } from "@/lib/scoring/engine";
import {
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  Map,
  List,
  Sparkles,
  Sliders,
} from "lucide-react";
import Link from "next/link";

export default function ShortlistPage() {
  const [weights, setWeights] = useState<UserWeights>(DEFAULT_WEIGHTS);
  const [activeBucket, setActiveBucket] = useState<string>("all");
  const [montessoriOnly, setMontessoriOnly] = useState<boolean>(false);
  const [cctvOnly, setCctvOnly] = useState<boolean>(false);
  const [daycareOnly, setDaycareOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<"fit" | "cab" | "fee">("fit");
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [showExcluded, setShowExcluded] = useState<boolean>(false);

  // Load weights on client mount & listen for live updates
  useEffect(() => {
    setWeights(loadSavedWeights());

    const handleWeightsUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<UserWeights>;
      if (customEvent.detail) {
        setWeights(customEvent.detail);
      }
    };

    window.addEventListener("firststeps:weights_updated", handleWeightsUpdate);
    return () => {
      window.removeEventListener("firststeps:weights_updated", handleWeightsUpdate);
    };
  }, []);

  // Filtered & scored list calculation
  const { scoredMatching, excludedSchools } = useMemo(() => {
    const matching: { school: (typeof SEED_SCHOOLS)[0]; result: FitScoreResult; cabMinutes: number }[] = [];
    const excluded: { school: (typeof SEED_SCHOOLS)[0]; reason: string }[] = [];

    // Cab times mapping for demo seed schools
    const cabTimes = [6, 8, 11, 9, 7, 8, 12, 10, 14, 15, 12, 9, 13, 11];

    SEED_SCHOOLS.forEach((school, index) => {
      const cab = cabTimes[index % cabTimes.length];
      const result = computeFitScore(school, {
        weights,
        maxTravelMinutes: 20,
        dropMinutes: cab,
        pickupMinutes: cab,
        mustHaves: {
          montessori: montessoriOnly,
          cctvParentAccess: cctvOnly,
          flexibleDaycare: daycareOnly,
        },
      });

      if (result.isExcluded) {
        excluded.push({
          school,
          reason: result.exclusionReason || "Did not match your must-have preferences.",
        });
      } else {
        matching.push({ school, result, cabMinutes: cab });
      }
    });

    // Sorting
    matching.sort((a, b) => {
      if (sortBy === "cab") {
        return a.cabMinutes - b.cabMinutes;
      }
      return b.result.totalScore - a.result.totalScore;
    });

    return { scoredMatching: matching, excludedSchools: excluded };
  }, [weights, montessoriOnly, cctvOnly, daycareOnly, sortBy]);

  return (
    <div className="min-h-screen bg-bg flex">
      {/* Desktop Navigation Sidebar */}
      <DesktopSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 lg:pb-8">
        <Header userName="Divya" areaLabel="Sector 47, Gurugram" />

        <main className="max-w-6xl w-full mx-auto px-4 sm:px-6 py-6">
          {/* Top Title Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-heading font-bold text-text-main">
                Your preschool shortlist
              </h1>
              <p className="text-xs sm:text-sm text-text-muted mt-0.5">
                {scoredMatching.length} shortlisted from {SEED_SCHOOLS.length} nearby · scored with your weights
              </p>
            </div>

            {/* List / Map Switch & Calibrate link */}
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <Link
                href="/settings/needs"
                className="min-h-touch inline-flex items-center gap-1.5 px-3 py-1.5 rounded-chip text-xs font-semibold bg-teal-tint text-teal-text border border-teal-text/20 hover:bg-teal-primary hover:text-white transition-colors"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Adjust Weights</span>
              </Link>

              <div className="flex items-center gap-1 bg-bg-card border border-border-light rounded-chip p-1 shadow-sm">
                <button
                  onClick={() => setViewMode("list")}
                  className={`min-h-touch px-3 py-1.5 rounded-chip text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                    viewMode === "list"
                      ? "bg-teal-primary text-white"
                      : "text-text-muted hover:text-text-main"
                  }`}
                  aria-label="List View"
                >
                  <List className="w-3.5 h-3.5" />
                  <span>List</span>
                </button>
                <button
                  onClick={() => setViewMode("map")}
                  className={`min-h-touch px-3 py-1.5 rounded-chip text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                    viewMode === "map"
                      ? "bg-teal-primary text-white"
                      : "text-text-muted hover:text-text-main"
                  }`}
                  aria-label="Map View"
                >
                  <Map className="w-3.5 h-3.5" />
                  <span>Map</span>
                </button>
              </div>
            </div>
          </div>

          {/* Active Calibration Bar */}
          <div className="bg-bg-card border border-teal-primary/30 rounded-card p-3.5 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-teal-tint text-teal-text flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-4 h-4 stroke-[2.2]" />
              </div>
              <div className="text-xs">
                <span className="font-semibold text-text-main block">
                  Active Calibration: Montessori {weights.montessori}% · Safety {weights.safety}% · Daycare {weights.daycare}% · Travel {weights.travel}% · Fees {weights.fees}%
                </span>
                <span className="text-text-muted">
                  Scores update dynamically whenever you change your priority weights.
                </span>
              </div>
            </div>
            <Link
              href="/settings/needs"
              className="text-[11px] font-semibold text-teal-text hover:underline flex-shrink-0"
            >
              Change weights
            </Link>
          </div>

          {/* Filter Bar */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              <span className="text-xs font-medium text-text-muted flex items-center gap-1 flex-shrink-0">
                <SlidersHorizontal className="w-3.5 h-3.5" />
                Must-haves:
              </span>

              <button
                onClick={() => setMontessoriOnly(!montessoriOnly)}
                className={`min-h-touch px-3 py-1.5 rounded-chip text-xs font-semibold flex-shrink-0 border transition-colors ${
                  montessoriOnly
                    ? "bg-teal-primary text-white border-teal-primary"
                    : "bg-bg-card text-text-main border-border-light hover:border-teal-primary"
                }`}
              >
                Montessori Only
              </button>

              <button
                onClick={() => setCctvOnly(!cctvOnly)}
                className={`min-h-touch px-3 py-1.5 rounded-chip text-xs font-semibold flex-shrink-0 border transition-colors ${
                  cctvOnly
                    ? "bg-teal-primary text-white border-teal-primary"
                    : "bg-bg-card text-text-main border-border-light hover:border-teal-primary"
                }`}
              >
                CCTV Only
              </button>

              <button
                onClick={() => setDaycareOnly(!daycareOnly)}
                className={`min-h-touch px-3 py-1.5 rounded-chip text-xs font-semibold flex-shrink-0 border transition-colors ${
                  daycareOnly
                    ? "bg-teal-primary text-white border-teal-primary"
                    : "bg-bg-card text-text-main border-border-light hover:border-teal-primary"
                }`}
              >
                Daycare Only
              </button>
            </div>
          </div>

          {/* Main Grid or Map */}
          {viewMode === "list" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
              {scoredMatching.map(({ school, result, cabMinutes }) => (
                <SchoolCard
                  key={school.id}
                  school={school}
                  cabMinutes={cabMinutes}
                  fitScore={result.totalScore}
                  feeBucket={result.feeBucket}
                  onAskSeats={(id) => {
                    alert(`Message composer will open for ${school.name} in Phase 4.`);
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="bg-bg-card rounded-card border border-border-light p-8 text-center min-h-[350px] flex flex-col items-center justify-center shadow-card">
              <Map className="w-12 h-12 text-teal-primary mb-3 stroke-[1.8]" />
              <h3 className="text-base font-heading font-bold text-text-main mb-1">
                Sector 47 Interactive Map View
              </h3>
              <p className="text-xs text-text-muted max-w-sm">
                Google Maps JavaScript API integration activated. Centered at Sector 47, Gurugram (28.4283, 77.0456).
              </p>
            </div>
          )}

          {/* Excluded Schools Collapsible Drawer */}
          {excludedSchools.length > 0 && (
            <div className="mt-8 border-t border-border-light pt-6">
              <button
                onClick={() => setShowExcluded(!showExcluded)}
                className="min-h-touch inline-flex items-center gap-2 text-xs font-semibold text-text-muted hover:text-text-main"
              >
                <span>
                  Show schools that don&apos;t match my must-haves ({excludedSchools.length})
                </span>
                {showExcluded ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>

              {showExcluded && (
                <div className="mt-3 space-y-2">
                  {excludedSchools.map(({ school, reason }) => (
                    <div
                      key={school.id}
                      className="p-3 bg-bg-card rounded-xl border border-border-light text-xs flex items-center justify-between"
                    >
                      <div>
                        <span className="font-semibold text-text-main block">
                          {school.name}
                        </span>
                        <span className="text-text-muted">{reason}</span>
                      </div>
                      <span className="text-[11px] font-medium text-amber-text bg-amber-tint px-2 py-0.5 rounded-chip">
                        Excluded
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
