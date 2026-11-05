"use client";

import React from "react";
import Link from "next/link";
import { Header } from "@/components/navigation/Header";
import { BottomNav } from "@/components/navigation/BottomNav";
import { DesktopSidebar } from "@/components/navigation/DesktopSidebar";
import { Columns3, ArrowRight } from "lucide-react";

export default function ComparePage() {
  return (
    <div className="min-h-screen bg-bg flex">
      <DesktopSidebar />
      <div className="flex-1 flex flex-col min-w-0 pb-20 lg:pb-8">
        <Header userName="Divya" areaLabel="Sector 47, Gurugram" />
        <main className="max-w-4xl w-full mx-auto px-4 sm:px-6 py-6">
          <div className="bg-bg-card rounded-card border border-border-light shadow-card p-8 text-center">
            <div className="w-12 h-12 rounded-2xl bg-teal-tint text-teal-text flex items-center justify-center mx-auto mb-4">
              <Columns3 className="w-6 h-6 stroke-[2]" />
            </div>
            <h1 className="text-xl font-heading font-bold text-text-main mb-2">
              Preschool Comparison Matrix
            </h1>
            <p className="text-xs text-text-muted max-w-md mx-auto mb-6 leading-relaxed">
              Side-by-side comparison across Montessori authenticity, live parent CCTV, flexible daycare hours, and cab travel times.
            </p>
            <Link
              href="/shortlist"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-btn bg-teal-primary text-white text-xs font-semibold hover:bg-teal-hover transition-colors"
            >
              <span>Back to Shortlist</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
