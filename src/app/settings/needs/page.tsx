"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Header } from "@/components/navigation/Header";
import { BottomNav } from "@/components/navigation/BottomNav";
import { DesktopSidebar } from "@/components/navigation/DesktopSidebar";
import {
  UserWeights,
  DEFAULT_WEIGHTS,
  WEIGHT_KEYS,
  WEIGHT_LABELS,
  getWeightsSum,
  rebalanceWeights,
  normalizeWeightsToHundred,
  loadSavedWeights,
  saveWeightsToStorage,
} from "@/lib/scoring/weights";
import {
  MapPin,
  Check,
  ArrowLeft,
  RotateCcw,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Sliders,
  Plus,
  Minus,
} from "lucide-react";

export default function MyNeedsPage() {
  const [weights, setWeights] = useState<UserWeights>(DEFAULT_WEIGHTS);
  const [autoRebalance, setAutoRebalance] = useState<boolean>(true);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);
  const [isClient, setIsClient] = useState<boolean>(false);

  // Load persisted weights on initial client render
  useEffect(() => {
    setIsClient(true);
    setWeights(loadSavedWeights());
  }, []);

  const totalSum = getWeightsSum(weights);
  const isBalanced = totalSum === 100;
  const difference = 100 - totalSum;

  const handleWeightChange = (key: keyof UserWeights, newValue: number) => {
    const clamped = Math.max(0, Math.min(100, newValue));
    if (autoRebalance) {
      const updated = rebalanceWeights(weights, key, clamped);
      setWeights(updated);
    } else {
      setWeights((prev) => ({ ...prev, [key]: clamped }));
    }
    setSavedSuccess(false);
  };

  const handleStep = (key: keyof UserWeights, delta: number) => {
    const current = weights[key];
    handleWeightChange(key, current + delta);
  };

  const handleAutoBalanceClick = () => {
    const normalized = normalizeWeightsToHundred(weights);
    setWeights(normalized);
    setSavedSuccess(false);
  };

  const handleResetToDefaults = () => {
    setWeights({ ...DEFAULT_WEIGHTS });
    setSavedSuccess(false);
  };

  const handleSave = () => {
    const finalWeights = isBalanced ? weights : normalizeWeightsToHundred(weights);
    setWeights(finalWeights);
    saveWeightsToStorage(finalWeights);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
    }, 3000);
  };

  const presets = [
    {
      label: "Default (Balanced Fit)",
      weights: { montessori: 30, safety: 30, daycare: 15, travel: 15, fees: 10 },
    },
    {
      label: "Commute First (Cab Focus)",
      weights: { montessori: 20, safety: 25, daycare: 15, travel: 30, fees: 10 },
    },
    {
      label: "Daycare Extended",
      weights: { montessori: 25, safety: 25, daycare: 30, travel: 10, fees: 10 },
    },
  ];

  if (!isClient) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="text-xs text-text-muted">Loading preferences...</div>
      </div>
    );
  }

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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1">
              <h1 className="text-xl sm:text-2xl font-heading font-bold text-text-main">
                Search Profile & Weight Calibration
              </h1>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-chip bg-teal-tint text-teal-text border border-teal-text/20 self-start sm:self-auto">
                Sector 47 Active
              </span>
            </div>
            <p className="text-xs text-text-muted mb-6">
              Adjust how much each priority influences school fit scores. All weights must sum to exactly 100%.
            </p>

            <div className="space-y-6">
              {/* Home & Travel Summary */}
              <div className="p-4 bg-bg rounded-xl border border-border-light space-y-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-text-main">
                  <MapPin className="w-4 h-4 text-teal-primary" />
                  <span>Home & Commute Parameters</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-text-muted block">Home Point:</span>
                    <span className="font-semibold text-text-main">
                      Sector 47, Gurugram (Near Malibu Towne)
                    </span>
                  </div>
                  <div>
                    <span className="text-text-muted block">Max Cab Commute:</span>
                    <span className="font-semibold text-text-main">
                      20 minutes (Weekday traffic)
                    </span>
                  </div>
                  <div>
                    <span className="text-text-muted block">Morning Drop:</span>
                    <span className="font-semibold text-text-main">09:00 AM</span>
                  </div>
                  <div>
                    <span className="text-text-muted block">Afternoon Pickup:</span>
                    <span className="font-semibold text-text-main">01:00 PM</span>
                  </div>
                </div>
              </div>

              {/* Child Details */}
              <div className="p-4 bg-bg rounded-xl border border-border-light space-y-2">
                <span className="text-sm font-semibold text-text-main block">
                  Child Joining Profile
                </span>
                <p className="text-xs text-text-muted">
                  Daughter joining preschool at{" "}
                  <span className="font-semibold text-text-main">2.5 years (30 months)</span>.
                </p>
              </div>

              {/* Weight Distribution Section */}
              <div className="p-4 sm:p-5 bg-bg rounded-xl border border-border-light space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-heading font-bold text-text-main">
                      Priority Weightages (Total: 100%)
                    </h3>
                    <p className="text-xs text-text-muted">
                      Use the plus/minus buttons, slider, or type percentages directly.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleResetToDefaults}
                      className="min-h-touch inline-flex items-center gap-1.5 px-3 py-1.5 rounded-chip border border-border text-xs font-semibold text-text-muted hover:text-text-main hover:bg-bg-card transition-colors"
                      title="Reset weights to default 30/30/15/15/10"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reset</span>
                    </button>
                  </div>
                </div>

                {/* Total Sum Status Banner */}
                <div
                  className={`p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
                    isBalanced
                      ? "bg-teal-tint border-teal-text/20 text-teal-text"
                      : "bg-amber-tint border-amber-text/30 text-amber-text"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {isBalanced ? (
                      <CheckCircle2 className="w-5 h-5 flex-shrink-0 stroke-[2.2]" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 flex-shrink-0 stroke-[2.2]" />
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-heading font-bold text-sm">
                          Total: {totalSum}%
                        </span>
                        <span className="text-xs font-medium">
                          {isBalanced ? "(Strictly Balanced)" : `(Target: 100%)`}
                        </span>
                      </div>
                      <p className="text-xs opacity-90 mt-0.5">
                        {isBalanced
                          ? "Your weights sum to exactly 100%. Ready to save."
                          : difference > 0
                          ? `You have ${difference}% remaining to assign across categories.`
                          : `Total exceeds 100% by ${Math.abs(difference)}%. Please reduce weights or auto-balance.`}
                      </p>
                    </div>
                  </div>

                  {!isBalanced && (
                    <button
                      type="button"
                      onClick={handleAutoBalanceClick}
                      className="min-h-touch inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-btn bg-white border border-amber-text/40 text-xs font-bold text-amber-text hover:bg-amber-tint transition-colors shadow-sm self-start sm:self-auto"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Auto-balance to 100%</span>
                    </button>
                  )}
                </div>

                {/* Visual Segmented Distribution Bar */}
                <div>
                  <div className="flex justify-between text-[11px] text-text-muted mb-1 font-medium">
                    <span>Distribution Bar</span>
                    <span>100% Allocated</span>
                  </div>
                  <div className="w-full h-3 bg-border-light rounded-full overflow-hidden flex shadow-inner">
                    {WEIGHT_KEYS.map((key) => {
                      const share = weights[key];
                      if (share <= 0) return null;
                      return (
                        <div
                          key={key}
                          style={{
                            width: `${(share / Math.max(100, totalSum)) * 100}%`,
                            backgroundColor: WEIGHT_LABELS[key].color,
                          }}
                          className="h-full transition-all duration-300"
                          title={`${WEIGHT_LABELS[key].title}: ${share}%`}
                        />
                      );
                    })}
                  </div>
                </div>

                {/* Auto-rebalance Mode Toggle */}
                <div className="flex items-center justify-between p-3 bg-bg-card rounded-xl border border-border-light">
                  <div className="flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-teal-primary" />
                    <div>
                      <span className="text-xs font-semibold text-text-main block">
                        Auto-rebalance other weights while sliding
                      </span>
                      <span className="text-[11px] text-text-muted">
                        Automatically adjusts remaining categories proportionally so sum stays 100.
                      </span>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={autoRebalance}
                      onChange={(e) => setAutoRebalance(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-border-light peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-teal-primary"></div>
                  </label>
                </div>

                {/* 5 Categories Inputs */}
                <div className="space-y-4 pt-1">
                  {WEIGHT_KEYS.map((key) => {
                    const info = WEIGHT_LABELS[key];
                    const val = weights[key];

                    return (
                      <div
                        key={key}
                        className="p-3.5 bg-bg-card rounded-card border border-border-light shadow-sm"
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex items-start gap-2">
                            <span
                              className="w-3 h-3 rounded-full mt-1 flex-shrink-0"
                              style={{ backgroundColor: info.color }}
                            />
                            <div>
                              <span className="text-xs font-bold text-text-main block">
                                {info.title}
                              </span>
                              <span className="text-[11px] text-text-muted">
                                {info.desc}
                              </span>
                            </div>
                          </div>

                          {/* Direct Number Input */}
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              step="5"
                              value={val}
                              onChange={(e) =>
                                handleWeightChange(key, Number(e.target.value))
                              }
                              className="w-14 h-8 px-1 text-center font-heading font-bold text-sm rounded-lg border border-border focus:ring-1 focus:ring-teal-primary focus:outline-none bg-bg"
                            />
                            <span className="text-xs font-semibold text-text-muted">
                              %
                            </span>
                          </div>
                        </div>

                        {/* Interactive Row: Minus Button, Slider, Plus Button */}
                        <div className="flex items-center gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => handleStep(key, -5)}
                            disabled={val <= 0}
                            className="min-h-touch min-w-touch flex items-center justify-center rounded-btn border border-border bg-bg text-text-main hover:bg-border-light active:bg-border disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            aria-label={`Decrease ${info.title} by 5%`}
                          >
                            <Minus className="w-4 h-4" />
                          </button>

                          <div className="flex-1 px-1">
                            <input
                              type="range"
                              min="0"
                              max="100"
                              step="5"
                              value={val}
                              onChange={(e) =>
                                handleWeightChange(key, Number(e.target.value))
                              }
                              className="w-full h-2 rounded-lg accent-teal-primary cursor-pointer"
                              aria-label={info.title}
                            />
                          </div>

                          <button
                            type="button"
                            onClick={() => handleStep(key, 5)}
                            disabled={val >= 100}
                            className="min-h-touch min-w-touch flex items-center justify-center rounded-btn border border-border bg-bg text-text-main hover:bg-border-light active:bg-border disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            aria-label={`Increase ${info.title} by 5%`}
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Quick Presets */}
                <div className="pt-2">
                  <span className="text-xs font-semibold text-text-muted block mb-2">
                    Quick Preset Profiles:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {presets.map((p) => (
                      <button
                        key={p.label}
                        type="button"
                        onClick={() => {
                          setWeights(p.weights);
                          setSavedSuccess(false);
                        }}
                        className="min-h-touch px-3 py-1.5 rounded-chip text-xs font-medium border border-border bg-bg-card hover:border-teal-primary hover:text-teal-primary transition-colors"
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Save Action Footer */}
            <div className="mt-6 pt-4 border-t border-border-light flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                {savedSuccess && (
                  <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-text bg-teal-tint px-3 py-1.5 rounded-chip border border-teal-text/20">
                    <Check className="w-4 h-4" />
                    <span>Preferences saved! Fit scores updated.</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3">
                <Link
                  href="/shortlist"
                  className="min-h-touch inline-flex items-center px-4 py-2.5 rounded-btn border border-border text-xs font-semibold text-text-main hover:bg-bg transition-colors"
                >
                  Cancel
                </Link>

                <button
                  type="button"
                  onClick={handleSave}
                  className="min-h-touch inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-btn bg-teal-primary hover:bg-teal-hover active:bg-teal-hover text-white text-xs font-semibold shadow-sm transition-colors cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Save & Recompute Scores</span>
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
