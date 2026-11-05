export interface UserWeights {
  montessori: number;
  safety: number;
  daycare: number;
  travel: number;
  fees: number;
}

export const DEFAULT_WEIGHTS: UserWeights = {
  montessori: 30,
  safety: 30,
  daycare: 15,
  travel: 15,
  fees: 10,
};

export const WEIGHT_KEYS: (keyof UserWeights)[] = [
  "montessori",
  "safety",
  "daycare",
  "travel",
  "fees",
];

export const WEIGHT_LABELS: Record<keyof UserWeights, { title: string; desc: string; color: string }> = {
  montessori: {
    title: "Montessori Authenticity",
    desc: "AMI/AMS certified teachers, mixed age classrooms, prepared materials",
    color: "#0E5E5A", // Teal primary
  },
  safety: {
    title: "Child Safety & CCTV",
    desc: "Parent-accessible live CCTV, female toileting staff, police background checks",
    color: "#0B4F4B", // Dark teal
  },
  daycare: {
    title: "Daycare Flexibility",
    desc: "Flexible transition hours (start till 12:30, extend to 4-6 PM)",
    color: "#4B3A86", // Purple
  },
  travel: {
    title: "Travel Time by Cab",
    desc: "Weekday commute time with traffic for morning drop-off and pickup",
    color: "#1D4F91", // Blue
  },
  fees: {
    title: "Fee Bracket",
    desc: "Affordability relative to Sector 47 monthly preschool benchmarks",
    color: "#7A4A00", // Amber
  },
};

export const STORAGE_KEY_WEIGHTS = "firststeps_user_weights";

export function getWeightsSum(weights: UserWeights): number {
  return (
    Number(weights.montessori || 0) +
    Number(weights.safety || 0) +
    Number(weights.daycare || 0) +
    Number(weights.travel || 0) +
    Number(weights.fees || 0)
  );
}

/**
 * Proportionally adjusts other weights when one weight is modified,
 * ensuring the total sum strictly remains 100%.
 */
export function rebalanceWeights(
  current: UserWeights,
  changedKey: keyof UserWeights,
  targetValue: number
): UserWeights {
  // Clamp target value between 0 and 100
  const clampedTarget = Math.max(0, Math.min(100, Math.round(targetValue)));
  const otherKeys = WEIGHT_KEYS.filter((k) => k !== changedKey);
  const remainingBudget = 100 - clampedTarget;

  if (clampedTarget === 100) {
    const result: UserWeights = { ...current, [changedKey]: 100 };
    for (const k of otherKeys) {
      result[k] = 0;
    }
    return result;
  }

  // Calculate current sum of other keys
  const currentOtherSum = otherKeys.reduce((sum, k) => sum + current[k], 0);

  const result: UserWeights = { ...current, [changedKey]: clampedTarget };

  if (currentOtherSum === 0) {
    // Distribute remaining evenly across other keys
    const baseShare = Math.floor(remainingBudget / otherKeys.length);
    let remainder = remainingBudget - baseShare * otherKeys.length;
    for (const k of otherKeys) {
      result[k] = baseShare + (remainder > 0 ? 1 : 0);
      if (remainder > 0) remainder--;
    }
    return result;
  }

  // Distribute remainingBudget proportionally based on existing weights
  let distributed = 0;
  otherKeys.forEach((k, idx) => {
    if (idx === otherKeys.length - 1) {
      // Last item gets the exact difference to guarantee sum is exactly 100
      result[k] = Math.max(0, remainingBudget - distributed);
    } else {
      const share = Math.round((current[k] / currentOtherSum) * remainingBudget);
      result[k] = Math.max(0, share);
      distributed += result[k];
    }
  });

  // Verify and fix any small rounding anomaly
  const total = getWeightsSum(result);
  if (total !== 100) {
    const diff = 100 - total;
    // Add diff to the largest other key
    const largestKey = otherKeys.reduce((maxKey, k) =>
      result[k] > result[maxKey] ? k : maxKey
    , otherKeys[0]);
    result[largestKey] = Math.max(0, result[largestKey] + diff);
  }

  return result;
}

/**
 * Normalizes any given set of weights so they scale to sum to exactly 100.
 */
export function normalizeWeightsToHundred(weights: UserWeights): UserWeights {
  const sum = getWeightsSum(weights);
  if (sum === 0) {
    return { ...DEFAULT_WEIGHTS };
  }
  if (sum === 100) {
    return { ...weights };
  }

  const result: UserWeights = { ...weights };
  let currentSum = 0;
  const keys = WEIGHT_KEYS;

  keys.forEach((k, idx) => {
    if (idx === keys.length - 1) {
      result[k] = Math.max(0, 100 - currentSum);
    } else {
      const scaled = Math.round((weights[k] / sum) * 100);
      result[k] = Math.max(0, scaled);
      currentSum += result[k];
    }
  });

  return result;
}

/**
 * Loads weights from localStorage (browser-only) or returns defaults.
 */
export function loadSavedWeights(): UserWeights {
  if (typeof window === "undefined") {
    return DEFAULT_WEIGHTS;
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY_WEIGHTS);
    if (!raw) return DEFAULT_WEIGHTS;
    const parsed = JSON.parse(raw);
    if (
      typeof parsed.montessori === "number" &&
      typeof parsed.safety === "number" &&
      typeof parsed.daycare === "number" &&
      typeof parsed.travel === "number" &&
      typeof parsed.fees === "number"
    ) {
      return normalizeWeightsToHundred(parsed);
    }
  } catch {
    // ignore parse error and return default
  }

  return DEFAULT_WEIGHTS;
}

/**
 * Persists weights to localStorage and dispatches a custom event
 * so all components update immediately without a full page reload.
 */
export function saveWeightsToStorage(weights: UserWeights): void {
  if (typeof window === "undefined") return;
  const normalized = normalizeWeightsToHundred(weights);
  localStorage.setItem(STORAGE_KEY_WEIGHTS, JSON.stringify(normalized));
  window.dispatchEvent(new CustomEvent("firststeps:weights_updated", { detail: normalized }));
}
