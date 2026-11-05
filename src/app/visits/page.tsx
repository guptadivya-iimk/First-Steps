"use client";

import React from "react";
import Link from "next/link";
import { Header } from "@/components/navigation/Header";
import { BottomNav } from "@/components/navigation/BottomNav";
import { DesktopSidebar } from "@/components/navigation/DesktopSidebar";
import { CalendarCheck, ArrowRight } from "lucide-react";

export default function VisitsPage() {
  const stages = [
    { label: "To Ask", count: 8 },
    { label: "Asked", count: 2 },
    { label: "Replied", count: 1 },
    { label: "Visit Booked", count: 1 },
    { label: "Visited", count: 0 },
    { label: "Decided", count: 0 },
  ];

  return (
    <div className="min-h-screen bg-bg flex">
      <DesktopSidebar />
      <div className="flex-1 flex flex-col min-w-0 pb-20 lg:pb-8">
        <Header userName="Divya" areaLabel="Sector 47, Gurugram" />
        <main className="max-w-4xl w-full mx-auto px-4 sm:px-6 py-6">
          <div className="mb-6">
            <h1 className="text-2xl font-heading font-bold text-text-main">
              Visits & Pipeline Tracker
            </h1>
            <p className="text-xs text-text-muted mt-0.5">
              Track outreach, manage scheduled morning campus tours, and log visit notes.
            </p>
          </div>

          {/* Stage Counters Bar */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-6">
            {stages.map((stage) => (
              <div
                key={stage.label}
                className="bg-bg-card rounded-card border border-border-light p-3 text-center shadow-card"
              >
                <span className="text-xl font-heading font-bold text-teal-text block">
                  {stage.count}
                </span>
                <span className="text-[11px] font-medium text-text-muted">
                  {stage.label}
                </span>
              </div>
            ))}
          </div>

          <div className="bg-bg-card rounded-card border border-border-light shadow-card p-6 text-center">
            <CalendarCheck className="w-10 h-10 text-teal-primary mx-auto mb-3 stroke-[1.8]" />
            <h2 className="text-sm font-semibold text-text-main mb-1">
              Upcoming Visit: Productive Minds Montessori
            </h2>
            <p className="text-xs text-text-muted max-w-sm mx-auto mb-4">
              Scheduled tour on Thursday at 10:30 AM (Green St, Malibu Towne, Sector 47).
            </p>
            <Link
              href="/shortlist"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-btn bg-teal-primary text-white text-xs font-semibold hover:bg-teal-hover transition-colors"
            >
              <span>View School Profile</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
