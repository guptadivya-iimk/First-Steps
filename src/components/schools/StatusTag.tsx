import React from "react";
import { FactStatus } from "@/lib/types";
import { CheckCircle2, Globe, AlertTriangle, HelpCircle, Clock } from "lucide-react";

interface StatusTagProps {
  status: FactStatus;
  customText?: string;
  size?: "sm" | "md";
}

export const StatusTag: React.FC<StatusTagProps> = ({
  status,
  customText,
  size = "sm",
}) => {
  const sizeClasses =
    size === "sm"
      ? "text-xs px-2.5 py-1 gap-1.5"
      : "text-sm px-3 py-1.5 gap-2";

  switch (status) {
    case "confirmed":
      return (
        <span
          className={`inline-flex items-center font-medium rounded-chip bg-teal-tint text-teal-text border border-teal-text/20 ${sizeClasses}`}
        >
          <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.2]" />
          <span>{customText || "Confirmed by school"}</span>
        </span>
      );
    case "website":
      return (
        <span
          className={`inline-flex items-center font-medium rounded-chip bg-teal-tint text-teal-text border border-teal-text/20 ${sizeClasses}`}
        >
          <Globe className="w-3.5 h-3.5 stroke-[2]" />
          <span>{customText || "From school website"}</span>
        </span>
      );
    case "listing":
      return (
        <span
          className={`inline-flex items-center font-medium rounded-chip bg-amber-tint text-amber-text border border-amber-text/20 ${sizeClasses}`}
        >
          <Clock className="w-3.5 h-3.5 stroke-[2]" />
          <span>{customText || "From listing site"}</span>
        </span>
      );
    case "conflicting":
      return (
        <span
          className={`inline-flex items-center font-medium rounded-chip bg-amber-tint text-amber-text border border-amber-text/20 ${sizeClasses}`}
        >
          <AlertTriangle className="w-3.5 h-3.5 stroke-[2.2]" />
          <span>{customText || "Conflicting"}</span>
        </span>
      );
    case "old":
      return (
        <span
          className={`inline-flex items-center font-medium rounded-chip bg-amber-tint text-amber-text border border-amber-text/20 ${sizeClasses}`}
        >
          <Clock className="w-3.5 h-3.5 stroke-[2]" />
          <span>{customText || "Old data"}</span>
        </span>
      );
    case "unknown":
    default:
      return (
        <span
          className={`inline-flex items-center font-medium rounded-chip bg-blue-tint text-blue-text border border-blue-text/20 ${sizeClasses}`}
        >
          <HelpCircle className="w-3.5 h-3.5 stroke-[2]" />
          <span>{customText || "Ask school"}</span>
        </span>
      );
  }
};
