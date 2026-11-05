import React from "react";

interface FitScoreBadgeProps {
  score: number;
  size?: "sm" | "md" | "lg";
}

export const FitScoreBadge: React.FC<FitScoreBadgeProps> = ({
  score,
  size = "md",
}) => {
  let colorStyles = "bg-teal-primary text-white";
  if (score < 50) {
    colorStyles = "bg-amber-text text-white";
  } else if (score < 75) {
    colorStyles = "bg-[#0B4F4B] text-white";
  }

  const dimensions =
    size === "sm"
      ? "w-10 h-10 text-xs"
      : size === "lg"
      ? "w-16 h-16 text-xl"
      : "w-12 h-12 text-sm";

  return (
    <div className="flex flex-col items-center">
      <div
        className={`rounded-full flex items-center justify-center font-heading font-bold shadow-card ${dimensions} ${colorStyles}`}
        aria-label={`Fit score ${score} out of 100`}
      >
        {Math.round(score)}
      </div>
      <span className="text-[10px] font-medium text-text-muted mt-0.5 uppercase tracking-wide">
        Fit Score
      </span>
    </div>
  );
};
