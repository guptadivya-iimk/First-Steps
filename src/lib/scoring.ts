import type { School, SchoolFact, FactStatus } from "@/lib/types";

/**
 * Fit scoring.
 *
 * A score is only as good as the facts under it, so every component carries
 * the confidence of the fact it came from. A school that says it is Montessori
 * on a listing site scores lower than one whose website says so, which scores
 * lower than one that told us directly.
 */

export interface Weights {
  montessori: number;
  safety: number;
  daycare: number;
  travel: number;
  fees: number;
}

export const DEFAULT_WEIGHTS: Weights = {
  montessori: 30,
  safety: 30,
  daycare: 15,
  travel: 15,
  fees: 10,
};

export interface ScoreComponent {
  key: keyof Weights;
  label: string;
  weight: number;
  /** 0 to 1, before the weight is applied. */
  ratio: number;
  /** Points earned out of `weight`. */
  points: number;
  note: string;
}

export interface ScoreResult {
  total: number;
  components: ScoreComponent[];
  /** Facts that disagree with each other, or that nobody has confirmed. */
  openQuestions: string[];
}

/** How much we trust a fact, by where it came from. */
const STATUS_CONFIDENCE: Record<FactStatus, number> = {
  confirmed: 1,
  website: 0.9,
  listing: 0.7,
  conflicting: 0.55,
  old: 0.6,
  unknown: 0.5,
};

function confidenceOf(fact?: SchoolFact): number {
  if (!fact) return 0.5;
  return STATUS_CONFIDENCE[fact.status] ?? 0.5;
}

/** How closely a curriculum matches real Montessori practice. */
function montessoriAffinity(raw: unknown): { ratio: number; note: string } {
  const value = String(raw ?? "").toLowerCase();

  if (value.includes("pure_montessori")) {
    return { ratio: 1, note: "Describes itself as pure Montessori" };
  }
  if (value.includes("montessori_reggio")) {
    return { ratio: 0.82, note: "Montessori blended with Reggio Emilia" };
  }
  if (value.includes("montessori_playway") || value.includes("montessori_other")) {
    return { ratio: 0.62, note: "Montessori mixed with other methods" };
  }
  if (value.includes("montessori")) {
    return { ratio: 0.92, note: "Follows a Montessori programme" };
  }
  if (value.includes("highscope")) {
    return { ratio: 0.3, note: "HighScope, which is not Montessori" };
  }
  if (value.includes("xseed")) {
    return { ratio: 0.2, note: "XSEED, which is not Montessori" };
  }
  return { ratio: 0.25, note: "Uses another method" };
}

const EARTH_RADIUS_KM = 6371;

export function distanceKm(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number }
): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(h));
}

/**
 * Cab minutes at weekday morning drop-off.
 *
 * This is an estimate from distance, not a routed time. Gurugram roads bend,
 * so we add a detour factor, then drive the result at the speed traffic
 * actually allows around 9am. The Routes API replaces this in Phase 2 and the
 * UI labels the number as an estimate until it does.
 */
export function estimateCabMinutes(
  home: { lat: number; lng: number },
  school: { lat: number; lng: number }
): number {
  const straight = distanceKm(home, school);
  const roadKm = straight * 1.35;
  const kmPerHour = 17;
  const pickupOverhead = 3;
  return Math.max(3, Math.round((roadKm / kmPerHour) * 60 + pickupOverhead));
}

export interface ScoreInput {
  school: School;
  weights: Weights;
  cabMinutes: number;
  maxTravelMinutes: number;
  /** Fee buckets the parent is willing to look at. */
  budgetBuckets: Array<"low" | "medium" | "high">;
  feeThresholds: { lowMax: number; mediumMax: number };
}

export function feeBucket(
  monthly: number | undefined,
  thresholds: { lowMax: number; mediumMax: number }
): "low" | "medium" | "high" | "unknown" {
  if (typeof monthly !== "number") return "unknown";
  if (monthly <= thresholds.lowMax) return "low";
  if (monthly <= thresholds.mediumMax) return "medium";
  return "high";
}

export function scoreSchool(input: ScoreInput): ScoreResult {
  const {
    school,
    weights,
    cabMinutes,
    maxTravelMinutes,
    budgetBuckets,
    feeThresholds,
  } = input;

  const facts = school.facts;
  const openQuestions: string[] = [];

  for (const fact of Object.values(facts)) {
    if (fact.status === "conflicting") {
      openQuestions.push(fact.conflictNote || fact.displayText);
    }
  }

  // --- Montessori -------------------------------------------------------
  const currFact = facts.curriculum;
  const affinity = montessoriAffinity(currFact?.value);
  const montessoriRatio = affinity.ratio * confidenceOf(currFact);

  // --- Safety -----------------------------------------------------------
  const cctvFact = facts.cctvParentAccess;
  const hasCctv = cctvFact?.value === true;
  const safetyBase = hasCctv ? 1 : cctvFact ? 0.3 : 0.25;
  const safetyRatio = safetyBase * confidenceOf(cctvFact);
  if (!cctvFact) openQuestions.push("Can parents see the CCTV feed?");

  // --- Daycare ----------------------------------------------------------
  const daycareFact = facts.daycareAvailable;
  const hoursFact = facts.daycareHours;
  const hasDaycare = daycareFact?.value === true;
  let daycareBase = hasDaycare ? 0.85 : daycareFact ? 0.2 : 0.3;
  if (hasDaycare && hoursFact) daycareBase = 1;
  const daycareRatio = daycareBase * confidenceOf(daycareFact);
  if (!daycareFact) openQuestions.push("Is there daycare after school hours?");

  // --- Travel -----------------------------------------------------------
  // Full marks at half the limit, nothing at twice it.
  const travelRatio = clamp01(
    1 - (cabMinutes - maxTravelMinutes * 0.5) / (maxTravelMinutes * 1.5)
  );

  // --- Fees -------------------------------------------------------------
  const feeFact = facts.feeMonthly;
  const monthly = typeof feeFact?.value === "number" ? feeFact.value : undefined;
  const bucket = feeBucket(monthly, feeThresholds);
  let feeBase: number;
  if (bucket === "unknown") {
    feeBase = 0.4;
    openQuestions.push("What are the monthly fees?");
  } else if (budgetBuckets.includes(bucket)) {
    feeBase = bucket === "low" ? 1 : bucket === "medium" ? 0.85 : 0.65;
  } else {
    feeBase = 0.2;
  }
  const feesRatio = feeBase * confidenceOf(feeFact);

  const rows: Array<Omit<ScoreComponent, "points">> = [
    {
      key: "montessori",
      label: "Montessori",
      weight: weights.montessori,
      ratio: montessoriRatio,
      note: affinity.note,
    },
    {
      key: "safety",
      label: "Safety",
      weight: weights.safety,
      ratio: safetyRatio,
      note: hasCctv
        ? "Parents can watch the CCTV feed"
        : "No confirmed parent CCTV access",
    },
    {
      key: "daycare",
      label: "Daycare",
      weight: weights.daycare,
      ratio: daycareRatio,
      note: hasDaycare
        ? hoursFact?.displayText || "Daycare available"
        : "No confirmed daycare",
    },
    {
      key: "travel",
      label: "Travel",
      weight: weights.travel,
      ratio: travelRatio,
      note: `About ${cabMinutes} min by cab`,
    },
    {
      key: "fees",
      label: "Fees",
      weight: weights.fees,
      ratio: feesRatio,
      note:
        bucket === "unknown"
          ? "Fees not published"
          : `${bucket[0].toUpperCase()}${bucket.slice(1)} for this area`,
    },
  ];

  const components: ScoreComponent[] = rows.map((row) => ({
    ...row,
    points: Math.round(row.ratio * row.weight * 10) / 10,
  }));

  const weightTotal = components.reduce((sum, c) => sum + c.weight, 0) || 1;
  const earned = components.reduce((sum, c) => sum + c.points, 0);
  const total = Math.round((earned / weightTotal) * 100);

  return {
    total: Math.max(0, Math.min(100, total)),
    components,
    openQuestions: Array.from(new Set(openQuestions)).slice(0, 4),
  };
}

function clamp01(n: number): number {
  return Math.max(0, Math.min(1, n));
}
