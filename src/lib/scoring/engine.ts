import { School } from "../types";
import { UserWeights } from "./weights";

export interface ScoreBreakdownItem {
  earnedPoints: number;
  maxPoints: number;
  subScore: number; // 0 to 1
  reason: string;
}

export interface FitScoreResult {
  totalScore: number;
  subScores: {
    montessori: number;
    safety: number;
    daycare: number;
    travel: number;
    fees: number;
  };
  breakdown: Record<keyof UserWeights, ScoreBreakdownItem>;
  confidencePenalty: number;
  isExcluded: boolean;
  exclusionReason?: string;
  feeBucket: "Low" | "Medium" | "High";
}

export interface ScoringContext {
  weights: UserWeights;
  maxTravelMinutes?: number;
  dropMinutes?: number;
  pickupMinutes?: number;
  mustHaves?: {
    montessori?: boolean;
    cctvParentAccess?: boolean;
    flexibleDaycare?: boolean;
  };
  childAgeMonths?: number;
}

export function computeFitScore(
  school: School,
  context: ScoringContext
): FitScoreResult {
  const {
    weights,
    maxTravelMinutes = 20,
    dropMinutes = 8,
    pickupMinutes = 8,
    mustHaves = { montessori: true, cctvParentAccess: true, flexibleDaycare: true },
    childAgeMonths = 30,
  } = context;

  // 1. Hard filters
  const maxCab = Math.max(dropMinutes, pickupMinutes);
  if (maxCab > maxTravelMinutes) {
    return createExcludedResult(school, weights, `Travel time of ${maxCab} min exceeds your ${maxTravelMinutes} min limit.`);
  }

  if (school.status === "possibly_closed") {
    return createExcludedResult(school, weights, "School status marked as possibly closed.");
  }

  const daycareVal = school.facts.daycareAvailable?.value;
  if (mustHaves.flexibleDaycare && daycareVal === false) {
    return createExcludedResult(school, weights, "Confirmed no daycare facility available.");
  }

  const currText = school.facts.curriculum?.displayText?.toLowerCase() || "";
  const isExplicitlyNotMontessori =
    currText.includes("not montessori") || school.facts.curriculum?.value === "HighScope";
  if (mustHaves.montessori && isExplicitlyNotMontessori) {
    return createExcludedResult(school, weights, "Confirmed non-Montessori curriculum (e.g. HighScope or XSEED).");
  }

  // 2. Sub-score: Montessori (0-1)
  // training 0.4, mixed age 0.2, work period 0.15, materials 0.15, says Montessori 0.1. Unknown = 30% of each.
  let montessoriSub = 0;
  let montessoriReason = "";

  const trainingFact = school.facts.montessoriTraining;
  if (trainingFact?.status === "confirmed" && trainingFact.value) {
    montessoriSub += 0.4;
    montessoriReason += "+ Verified AMI/AMS teachers. ";
  } else if (trainingFact?.value) {
    montessoriSub += 0.4 * 0.7;
    montessoriReason += "+ Montessori teachers mentioned. ";
  } else {
    montessoriSub += 0.4 * 0.3; // unknown 30%
    montessoriReason += "− Teacher training unverified. ";
  }

  const mixedAgeFact = school.facts.mixedAgeClass;
  if (mixedAgeFact?.value) {
    montessoriSub += 0.2;
  } else {
    montessoriSub += 0.2 * 0.3;
  }

  const workPeriodFact = school.facts.workPeriod;
  if (workPeriodFact?.value) {
    montessoriSub += 0.15;
  } else {
    montessoriSub += 0.15 * 0.3;
  }

  const materialsFact = school.facts.materials;
  if (materialsFact?.value) {
    montessoriSub += 0.15;
  } else {
    montessoriSub += 0.15 * 0.3;
  }

  const curriculumFact = school.facts.curriculum;
  if (curriculumFact && !isExplicitlyNotMontessori) {
    montessoriSub += 0.1;
    montessoriReason = "+ Follows Montessori curriculum; " + montessoriReason;
  } else if (isExplicitlyNotMontessori) {
    montessoriSub = 0.05;
    montessoriReason = "Alternative early years curriculum. ";
  }
  montessoriSub = Math.min(1.0, Math.max(0, montessoriSub));

  // 3. Sub-score: Safety (0-1)
  // CCTV 0.3, women toileting 0.2, police verification 0.2, pickup auth 0.15, ratio 0.1, fire/first aid 0.05. Unknown = 30%.
  let safetySub = 0;
  let safetyReason = "";

  const cctvFact = school.facts.cctvParentAccess;
  if (cctvFact?.value === true) {
    safetySub += 0.3;
    safetyReason += "+ Parent CCTV access available. ";
  } else if (cctvFact?.value === false) {
    safetyReason += "− No live parent CCTV. ";
  } else {
    safetySub += 0.3 * 0.3;
    safetyReason += "− CCTV parent access unconfirmed. ";
  }

  // female staff toileting
  const toiletingFact = school.facts.femaleStaffForToileting;
  if (toiletingFact?.value === true) {
    safetySub += 0.2;
  } else {
    safetySub += 0.2 * 0.3;
  }

  // police verification
  const policeFact = school.facts.staffPoliceVerified;
  if (policeFact?.value === true) {
    safetySub += 0.2;
  } else {
    safetySub += 0.2 * 0.3;
  }

  // pickup auth
  const pickupAuth = school.facts.pickupAuthorisation;
  if (pickupAuth?.value === true) {
    safetySub += 0.15;
  } else {
    safetySub += 0.15 * 0.3;
  }

  // ratio
  const ratioFact = school.facts.ratioToddler;
  if (ratioFact?.value) {
    safetySub += 0.1;
    safetyReason += `+ ${ratioFact.displayText}. `;
  } else {
    safetySub += 0.1 * 0.3;
  }

  safetySub += 0.05 * 0.3; // first aid baseline
  safetySub = Math.min(1.0, Math.max(0, safetySub));

  // 4. Sub-score: Daycare (0-1)
  let daycareSub = 0.3; // unknown default
  let daycareReason = "";
  const daycareHours = school.facts.daycareHours?.value;

  if (daycareVal === false) {
    daycareSub = 0;
    daycareReason = "No daycare facility offered.";
  } else if (daycareVal === true || daycareHours) {
    if (school.facts.daycareAvailable?.displayText?.includes("flexible") || daycareHours?.includes("6")) {
      daycareSub = 1.0;
      daycareReason = "Extended hours with flexible time slots.";
    } else if (daycareHours?.includes("1:30")) {
      daycareSub = 0.4;
      daycareReason = "Half-day daycare only (till 1:30 PM).";
    } else {
      daycareSub = 0.7;
      daycareReason = "Daycare available, flexibility to verify.";
    }
  } else {
    daycareReason = "Daycare availability unconfirmed (Ask school).";
  }

  // 5. Sub-score: Travel (0-1)
  // 1 - (max(drop, pickup) / maxTravelMinutes), floored at 0.1
  const travelSub = Math.max(0.1, Math.min(1.0, 1 - maxCab / maxTravelMinutes));
  const travelReason = `${maxCab} min cab commute at peak hours (limit: ${maxTravelMinutes} min).`;

  // 6. Sub-score: Fees (0-1)
  // Low (< 7k) = 1.0, Med (7-12k) = 0.7, High (> 12k) = 0.4, Unknown = 0.5
  let feeBucket: "Low" | "Medium" | "High" = "Medium";
  let feeSub = 0.7;
  let feeReason = "";

  const feeMonthlyFact = school.facts.feeMonthly?.value;
  const feeAnnualFact = school.facts.feeAnnual?.value;

  let monthlyAmount: number | null = null;
  if (typeof feeMonthlyFact === "number") {
    monthlyAmount = feeMonthlyFact;
  } else if (typeof feeAnnualFact === "string") {
    // parse range e.g. "20000-45000"
    const parts = feeAnnualFact.split("-").map((p) => Number(p.trim()));
    if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
      monthlyAmount = (parts[0] + parts[1]) / 2 / 12;
    }
  }

  if (monthlyAmount !== null) {
    if (monthlyAmount < 7000) {
      feeBucket = "Low";
      feeSub = 1.0;
      feeReason = `Low fee bracket (≈ ₹${Math.round(monthlyAmount).toLocaleString("en-IN")}/mo).`;
    } else if (monthlyAmount <= 12000) {
      feeBucket = "Medium";
      feeSub = 0.7;
      feeReason = `Medium fee bracket (≈ ₹${Math.round(monthlyAmount).toLocaleString("en-IN")}/mo).`;
    } else {
      feeBucket = "High";
      feeSub = 0.4;
      feeReason = `High fee bracket (≈ ₹${Math.round(monthlyAmount).toLocaleString("en-IN")}/mo).`;
    }
  } else {
    feeSub = 0.5;
    feeReason = "Fees unconfirmed (indicative medium benchmark used).";
  }

  // 7. Confidence Penalty
  // Subtract up to 5 points when more than half of the facts are listing-only, old, or conflicting
  const allFacts = Object.values(school.facts);
  const uncertainCount = allFacts.filter(
    (f) => f.status === "listing" || f.status === "old" || f.status === "conflicting" || f.status === "unknown"
  ).length;

  let confidencePenalty = 0;
  if (allFacts.length > 0 && uncertainCount / allFacts.length > 0.5) {
    confidencePenalty = 4;
  }

  // Weighted total: sum(subScore * weight)
  const weightedSum =
    montessoriSub * weights.montessori +
    safetySub * weights.safety +
    daycareSub * weights.daycare +
    travelSub * weights.travel +
    feeSub * weights.fees;

  const totalScore = Math.max(0, Math.min(100, Math.round(weightedSum - confidencePenalty)));

  return {
    totalScore,
    subScores: {
      montessori: montessoriSub,
      safety: safetySub,
      daycare: daycareSub,
      travel: travelSub,
      fees: feeSub,
    },
    breakdown: {
      montessori: {
        earnedPoints: Math.round(montessoriSub * weights.montessori),
        maxPoints: weights.montessori,
        subScore: montessoriSub,
        reason: montessoriReason.trim(),
      },
      safety: {
        earnedPoints: Math.round(safetySub * weights.safety),
        maxPoints: weights.safety,
        subScore: safetySub,
        reason: safetyReason.trim(),
      },
      daycare: {
        earnedPoints: Math.round(daycareSub * weights.daycare),
        maxPoints: weights.daycare,
        subScore: daycareSub,
        reason: daycareReason.trim(),
      },
      travel: {
        earnedPoints: Math.round(travelSub * weights.travel),
        maxPoints: weights.travel,
        subScore: travelSub,
        reason: travelReason.trim(),
      },
      fees: {
        earnedPoints: Math.round(feeSub * weights.fees),
        maxPoints: weights.fees,
        subScore: feeSub,
        reason: feeReason.trim(),
      },
    },
    confidencePenalty,
    isExcluded: false,
    feeBucket,
  };
}

function createExcludedResult(
  school: School,
  weights: UserWeights,
  reason: string
): FitScoreResult {
  return {
    totalScore: 0,
    subScores: { montessori: 0, safety: 0, daycare: 0, travel: 0, fees: 0 },
    breakdown: {
      montessori: { earnedPoints: 0, maxPoints: weights.montessori, subScore: 0, reason: "Excluded" },
      safety: { earnedPoints: 0, maxPoints: weights.safety, subScore: 0, reason: "Excluded" },
      daycare: { earnedPoints: 0, maxPoints: weights.daycare, subScore: 0, reason: "Excluded" },
      travel: { earnedPoints: 0, maxPoints: weights.travel, subScore: 0, reason: "Excluded" },
      fees: { earnedPoints: 0, maxPoints: weights.fees, subScore: 0, reason: "Excluded" },
    },
    confidencePenalty: 0,
    isExcluded: true,
    exclusionReason: reason,
    feeBucket: "Medium",
  };
}
