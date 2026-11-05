import * as React from "react";
import { cn } from "@/lib/utils";
import { Star } from "@/components/doodles";

/**
 * The score ring. A star appears at 85 and above, which is the only place in
 * the product where a decoration means something.
 */
export function FitScoreBadge({
  score,
  size = "md",
  className,
}: {
  score: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const rounded = Math.round(score);

  const tone =
    rounded >= 75
      ? "bg-teal text-white"
      : rounded >= 55
        ? "bg-teal-pale text-teal-ink ring-1 ring-teal/30"
        : "bg-marigold-pale text-marigold-ink ring-1 ring-marigold/40";

  const box =
    size === "sm"
      ? "size-11 text-step-4"
      : size === "lg"
        ? "size-18 text-step-8"
        : "size-14 text-step-6";

  return (
    <div className={cn("flex flex-col items-center gap-1", className)}>
      <div className="relative">
        <div
          className={cn(
            "flex items-center justify-center rounded-[var(--radius-chip)] font-display font-extrabold tabular-nums",
            box,
            tone
          )}
        >
          {rounded}
        </div>
        {rounded >= 85 && (
          <Star
            className="absolute -top-1 -right-1 size-4 text-marigold drop-shadow-sm"
            aria-hidden="true"
          />
        )}
      </div>
      <span className="text-step-1 font-semibold tracking-wide text-ink-faint uppercase">
        Fit
      </span>
      <span className="sr-only">{rounded} out of 100</span>
    </div>
  );
}
