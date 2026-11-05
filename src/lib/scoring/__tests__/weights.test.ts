import { describe, it, expect } from "vitest";
import {
  DEFAULT_WEIGHTS,
  rebalanceWeights,
  getWeightsSum,
  normalizeWeightsToHundred,
  UserWeights,
} from "../weights";

describe("Weights Calibration Engine", () => {
  it("default weights should sum to exactly 100", () => {
    expect(getWeightsSum(DEFAULT_WEIGHTS)).toBe(100);
  });

  it("should maintain sum of 100 when increasing a single weight", () => {
    // Increase montessori from 30 to 50
    const rebalanced = rebalanceWeights(DEFAULT_WEIGHTS, "montessori", 50);
    expect(rebalanced.montessori).toBe(50);
    expect(getWeightsSum(rebalanced)).toBe(100);
    expect(rebalanced.safety).toBeLessThan(DEFAULT_WEIGHTS.safety);
  });

  it("should maintain sum of 100 when decreasing a single weight", () => {
    // Decrease safety from 30 to 10
    const rebalanced = rebalanceWeights(DEFAULT_WEIGHTS, "safety", 10);
    expect(rebalanced.safety).toBe(10);
    expect(getWeightsSum(rebalanced)).toBe(100);
    expect(rebalanced.montessori).toBeGreaterThan(DEFAULT_WEIGHTS.montessori);
  });

  it("should handle setting a weight to 100 by zeroing out the rest", () => {
    const rebalanced = rebalanceWeights(DEFAULT_WEIGHTS, "montessori", 100);
    expect(rebalanced.montessori).toBe(100);
    expect(rebalanced.safety).toBe(0);
    expect(rebalanced.daycare).toBe(0);
    expect(rebalanced.travel).toBe(0);
    expect(rebalanced.fees).toBe(0);
    expect(getWeightsSum(rebalanced)).toBe(100);
  });

  it("should handle setting a weight to 0 and redistributing to others", () => {
    const rebalanced = rebalanceWeights(DEFAULT_WEIGHTS, "fees", 0);
    expect(rebalanced.fees).toBe(0);
    expect(getWeightsSum(rebalanced)).toBe(100);
  });

  it("should clamp values outside 0-100", () => {
    const rebalancedOver = rebalanceWeights(DEFAULT_WEIGHTS, "montessori", 150);
    expect(rebalancedOver.montessori).toBe(100);
    expect(getWeightsSum(rebalancedOver)).toBe(100);

    const rebalancedUnder = rebalanceWeights(DEFAULT_WEIGHTS, "montessori", -20);
    expect(rebalancedUnder.montessori).toBe(0);
    expect(getWeightsSum(rebalancedUnder)).toBe(100);
  });

  it("should normalize any uncalibrated sum to 100", () => {
    const arbitrary: UserWeights = {
      montessori: 40,
      safety: 40,
      daycare: 20,
      travel: 20,
      fees: 20,
    };
    expect(getWeightsSum(arbitrary)).toBe(140);
    const normalized = normalizeWeightsToHundred(arbitrary);
    expect(getWeightsSum(normalized)).toBe(100);
  });
});
