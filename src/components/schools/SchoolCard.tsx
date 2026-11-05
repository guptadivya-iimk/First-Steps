import React from "react";
import Link from "next/link";
import { School } from "@/lib/types";
import { StatusTag } from "./StatusTag";
import { FitScoreBadge } from "./FitScoreBadge";
import {
  Phone,
  MessageSquare,
  AlertTriangle,
  Car,
  BookmarkPlus,
  ArrowRight,
} from "lucide-react";

interface SchoolCardProps {
  school: School;
  cabMinutes?: number;
  fitScore?: number;
  feeBucket?: "Low" | "Medium" | "High";
  onAskSeats?: (schoolId: string) => void;
  onCall?: (phone: string) => void;
}

export const SchoolCard: React.FC<SchoolCardProps> = ({
  school,
  cabMinutes = 8,
  fitScore = 84,
  feeBucket = "Medium",
  onAskSeats,
}) => {
  // Extract key facts safely
  const curriculumFact = school.facts.curriculum;
  const cctvFact = school.facts.cctvParentAccess;
  const daycareFact = school.facts.daycareHours || school.facts.daycareAvailable;
  const feeFact = school.facts.feeMonthly || school.facts.feeAnnual;

  // Identify any conflicting or old warnings
  const warnings: string[] = [];
  Object.values(school.facts).forEach((fact) => {
    if (fact.status === "conflicting" && fact.conflictNote) {
      warnings.push(fact.conflictNote);
    } else if (fact.status === "old" && fact.conflictNote) {
      warnings.push(fact.conflictNote);
    }
  });

  const primaryPhone = school.contacts.find((c) => c.type === "phone")?.value;
  const primaryWhatsApp = school.contacts.find((c) => c.type === "whatsapp")?.value || primaryPhone?.replace(/[^0-9]/g, "");

  return (
    <div className="bg-bg-card rounded-card border border-border-light shadow-card p-4 transition-all duration-200 hover:border-teal-primary/40 relative">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex-1 min-w-0">
          <Link
            href={`/school/${school.id}`}
            className="group inline-flex items-center gap-1.5 focus:outline-none focus:underline"
          >
            <h2 className="text-lg font-heading font-bold text-text-main group-hover:text-teal-primary transition-colors truncate">
              {school.name}
            </h2>
          </Link>
          <div className="flex items-center gap-2 text-xs text-text-muted mt-0.5">
            <span>{school.sector}</span>
            <span>·</span>
            <span className="inline-flex items-center gap-1 font-medium text-teal-text">
              <Car className="w-3.5 h-3.5" />
              {cabMinutes} min by cab
            </span>
          </div>
        </div>

        <FitScoreBadge score={fitScore} size="md" />
      </div>

      {/* Fact Status Tags */}
      <div className="flex flex-wrap gap-1.5 my-3">
        {curriculumFact && (
          <StatusTag
            status={curriculumFact.status}
            customText={curriculumFact.displayText}
          />
        )}
        {cctvFact && (
          <StatusTag
            status={cctvFact.status}
            customText={cctvFact.displayText}
          />
        )}
        {daycareFact && (
          <StatusTag
            status={daycareFact.status}
            customText={daycareFact.displayText}
          />
        )}
      </div>

      {/* Fee Line */}
      <div className="text-xs text-text-muted bg-bg p-2 rounded-lg mb-3 flex items-center justify-between">
        <div>
          <span className="font-semibold text-text-main">{feeBucket}</span>
          <span className="mx-1.5">·</span>
          <span>{feeFact ? feeFact.displayText : "Fees unconfirmed (Ask school)"}</span>
        </div>
        <Link
          href={`/school/${school.id}`}
          className="text-teal-primary hover:text-teal-hover font-medium inline-flex items-center gap-0.5 text-xs"
        >
          Details
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {/* Amber Warning Strip */}
      {warnings.length > 0 && (
        <div className="bg-amber-tint border border-amber-text/20 rounded-lg p-2 mb-3 flex items-start gap-2 text-xs text-amber-text">
          <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5 stroke-[2.2]" />
          <div>
            <span className="font-semibold">Verification Alert: </span>
            <span>{warnings[0]}</span>
          </div>
        </div>
      )}

      {/* Actions Row */}
      <div className="flex items-center gap-2 pt-1 border-t border-border-light">
        {primaryPhone && (
          <a
            href={`tel:${primaryPhone}`}
            className="min-h-touch min-w-touch flex items-center justify-center px-3 py-2 rounded-btn border border-border text-xs font-medium text-text-main hover:bg-bg active:bg-border-light transition-colors"
            aria-label={`Call ${school.name}`}
          >
            <Phone className="w-4 h-4" />
          </a>
        )}

        {primaryWhatsApp && (
          <a
            href={`https://wa.me/${primaryWhatsApp.replace(/[^0-9]/g, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="min-h-touch min-w-touch flex items-center justify-center px-3 py-2 rounded-btn border border-border text-xs font-medium text-teal-text hover:bg-teal-tint transition-colors"
            aria-label={`WhatsApp ${school.name}`}
          >
            <MessageSquare className="w-4 h-4" />
          </a>
        )}

        <button
          onClick={() => onAskSeats && onAskSeats(school.id)}
          className="min-h-touch flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-btn bg-teal-primary hover:bg-teal-hover active:bg-teal-hover text-white text-xs font-semibold shadow-sm transition-colors"
        >
          <BookmarkPlus className="w-4 h-4" />
          <span>Ask About Seats</span>
        </button>
      </div>
    </div>
  );
};
