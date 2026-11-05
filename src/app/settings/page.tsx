"use client";

import React from "react";
import Link from "next/link";
import { Header } from "@/components/navigation/Header";
import { BottomNav } from "@/components/navigation/BottomNav";
import { DesktopSidebar } from "@/components/navigation/DesktopSidebar";
import { User, Download, Trash2, Shield, ArrowLeft } from "lucide-react";

export default function SettingsPage() {
  const handleExport = () => {
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(
        JSON.stringify(
          {
            user: "Divya",
            home: "Sector 47, Gurugram",
            childAgeMonths: 30,
            exportedAt: new Date().toISOString(),
          },
          null,
          2
        )
      );
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "firststeps-data.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

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
              Account & Privacy Controls
            </h1>
            <p className="text-xs text-text-muted mb-6">
              Manage your personal data in compliance with India&apos;s DPDP Act.
            </p>

            <div className="space-y-4">
              <div className="p-4 bg-bg rounded-xl border border-border-light flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-teal-tint text-teal-text flex items-center justify-center font-bold">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-text-main block">
                      Divya Gupta
                    </span>
                    <span className="text-xs text-text-muted">
                      gupta.divyaIIMK@gmail.com
                    </span>
                  </div>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-chip bg-teal-tint text-teal-text border border-teal-text/20">
                  Parent Account
                </span>
              </div>

              <div className="p-4 bg-bg rounded-xl border border-border-light flex items-center justify-between">
                <div>
                  <span className="text-sm font-semibold text-text-main block">
                    Export My Data
                  </span>
                  <span className="text-xs text-text-muted">
                    Download a full JSON record of your search profile, shortlist, and notes.
                  </span>
                </div>
                <button
                  onClick={handleExport}
                  className="min-h-touch inline-flex items-center gap-1.5 px-3.5 py-2 rounded-btn border border-border text-xs font-semibold text-text-main hover:bg-bg-card transition-colors"
                >
                  <Download className="w-4 h-4 text-teal-primary" />
                  <span>Export</span>
                </button>
              </div>

              <div className="p-4 bg-amber-tint/40 rounded-xl border border-amber-text/20 flex items-center justify-between">
                <div>
                  <span className="text-sm font-semibold text-amber-text block">
                    Delete Account & All Data
                  </span>
                  <span className="text-xs text-text-muted">
                    Permanently delete your profile, preferences, and saved school facts.
                  </span>
                </div>
                <button
                  onClick={() => {
                    if (confirm("Are you sure you want to delete your account? All data will be erased.")) {
                      localStorage.clear();
                      window.location.href = "/";
                    }
                  }}
                  className="min-h-touch inline-flex items-center gap-1.5 px-3.5 py-2 rounded-btn border border-amber-text/40 bg-white text-xs font-semibold text-amber-text hover:bg-amber-tint transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete</span>
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
