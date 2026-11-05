"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/navigation/Header";
import { BottomNav } from "@/components/navigation/BottomNav";
import { DesktopSidebar } from "@/components/navigation/DesktopSidebar";
import { SlidersHorizontal, MapPin, Car, ShieldCheck, Check, ArrowLeft } from "lucide-react";

export default function MyNeedsPage() {
  const [montessoriWeight, setMontessoriWeight] = useState(30);
  const [safetyWeight, setSafetyWeight] = useState(30);
  const [daycareWeight, setDaycareWeight] = useState(15);
  const [travelWeight, setTravelWeight] = useState(15);
  const [feesWeight, setFeesWeight] = useState(10);

  return (
    <div className="min-h-screen bg-bg flex">
      <DesktopSidebar />
      <div className="flex-1 flex flex-col min-w-0 pb-20 lg:pb-8">
        <Header userName="Divya" areaLabel="Sector 47, Gurugram" />
        <main className="max-w-3xl w-full mx-auto px-4 sm:px-6 py-6">
          <Link
            href="/shortlist"
            className="min-h-touch inline-flex items-center gap-1.5 text-xs font-semibold text-teal-text hover:text-teal-primary mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to shortlist</span>
          </Link>

          <div className="bg-bg-card rounded-card border border-border-light shadow-card p-6 mb-6">
            <h1 className="text-xl sm:text-2xl font-heading font-bold text-text-main mb-1">
              Search Profile & Preferences
            </h1>
            <p className="text-xs text-text-muted mb-6">
              Parameters used to compute cab travel times and fit scores.
            </p>

            <div className="space-y-6">
              {/* Home & Travel */}
              <div className="p-4 bg-bg rounded-xl border border-border-light space-y-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-text-main">
                  <MapPin className="w-4 h-4 text-teal-primary" />
                  <span>Home & Commute</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-text-muted block">Home Location:</span>
                    <span className="font-semibold text-text-main">
                      Sector 47, Gurugram (Near Malibu Towne)
                    </span>
                  </div>
                  <div>
                    <span className="text-text-muted block">Max Travel Time:</span>
                    <span className="font-semibold text-text-main">
                      20 minutes by cab (Grandparent drop/pickup)
                    </span>
                  </div>
                  <div>
                    <span className="text-text-muted block">Drop-off Time:</span>
                    <span className="font-semibold text-text-main">09:00 AM (Weekday traffic)</span>
                  </div>
                  <div>
                    <span className="text-text-muted block">Pickup Time:</span>
                    <span className="font-semibold text-text-main">01:00 PM (Weekday traffic)</span>
                  </div>
                </div>
              </div>

              {/* Child Details */}
              <div className="p-4 bg-bg rounded-xl border border-border-light space-y-2">
                <span className="text-sm font-semibold text-text-main block">
                  Child Joining Profile
                </span>
                <p className="text-xs text-text-muted">
                  Daughter joining preschool at <span className="font-semibold text-text-main">2.5 years (30 months)</span>.
                </p>
              </div>

              {/* Must-Haves */}
              <div className="p-4 bg-bg rounded-xl border border-border-light space-y-3">
                <span className="text-sm font-semibold text-text-main block">
                  Must-Have Criteria (Non-Negotiable)
                </span>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-teal-primary" />
                    <span className="text-text-main font-medium">
                      Montessori Methodology (Trained teachers, prepared environment)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-teal-primary" />
                    <span className="text-text-main font-medium">
                      Parent-accessible Live CCTV streaming
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-teal-primary" />
                    <span className="text-text-main font-medium">
                      Flexible Daycare (Option to start till 12:30, extend to 4–6 PM)
                    </span>
                  </div>
                </div>
              </div>

              {/* Weight Distribution */}
              <div className="p-4 bg-bg rounded-xl border border-border-light space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-text-main">
                    Fit Score Weights (Sum: 100%)
                  </span>
                  <span className="text-xs text-teal-text font-semibold bg-teal-tint px-2.5 py-0.5 rounded-chip">
                    Auto-Balanced
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Montessori Authenticity</span>
                      <span className="font-semibold">{montessoriWeight}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={montessoriWeight}
                      onChange={(e) => setMontessoriWeight(Number(e.target.value))}
                      className="w-full accent-teal-primary"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Child Safety & CCTV</span>
                      <span className="font-semibold">{safetyWeight}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={safetyWeight}
                      onChange={(e) => setSafetyWeight(Number(e.target.value))}
                      className="w-full accent-teal-primary"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Daycare Flexibility</span>
                      <span className="font-semibold">{daycareWeight}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={daycareWeight}
                      onChange={(e) => setDaycareWeight(Number(e.target.value))}
                      className="w-full accent-teal-primary"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Travel Time by Cab</span>
                      <span className="font-semibold">{travelWeight}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={travelWeight}
                      onChange={(e) => setTravelWeight(Number(e.target.value))}
                      className="w-full accent-teal-primary"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Fee Bracket</span>
                      <span className="font-semibold">{feesWeight}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={feesWeight}
                      onChange={(e) => setFeesWeight(Number(e.target.value))}
                      className="w-full accent-teal-primary"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <Link
                href="/shortlist"
                className="min-h-touch inline-flex items-center px-6 py-3 rounded-btn bg-teal-primary text-white text-xs font-semibold hover:bg-teal-hover transition-colors shadow-sm"
              >
                Save & Recompute Scores
              </Link>
            </div>
          </div>
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
