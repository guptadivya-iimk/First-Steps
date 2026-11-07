import * as React from "react";
import { cn } from "@/lib/utils";
import { Star } from "@/components/doodles";

/**
 * The score block.
 *
 * A flat rectangle of colour with the number set in the display face, the
 * same move as the words on the landing page. A star appears at 85 and above,
 * the only place in the product where a decoration carries meaning.
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
      ? "bg-tangerine text-ink"
      : rounded >= 55
        ? "bg-sand text-ink"
        : "bg-paper-deep text-ink-soft";

  const box =
    size === "sm"
      ? "h-11 w-12 text-step-6"
      : size === "lg"
        ? "h-18 w-20 text-step-9"
        : "h-14 w-16 text-step-8";

  return (
    <div className={cn("relative shrink-0 text-center", className)}>
      <div
        className={cn(
          "flex items-center justify-center rounded-[var(--radius-sm)] font-display leading-none font-extrabold tabular-nums",
          box,
          tone
        )}
      >
        {rounded}
      </div>
      <span className="mt-1 block text-step-1 font-bold tracking-widest text-ink-faint uppercase">
        Fit
      </span>
      {rounded >= 85 && (
        <Star
          className="absolute -top-2 -right-2 size-4 text-sunshine"
          aria-hidden="true"
        />
      )}
      <span className="sr-only">{rounded} out of 100</span>
    </div>
  );
}
