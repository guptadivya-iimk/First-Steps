import { describe, it, expect } from "vitest";
import { computeFitScore } from "../engine";
import { DEFAULT_WEIGHTS, UserWeights } from "../weights";
import { SEED_SCHOOLS } from "@/data/seedSchools";

describe("Scoring Engine & Fit Score Calculations", () => {
  const baseContext = {
    weights: DEFAULT_WEIGHTS,
    maxTravelMinutes: 20,
    dropMinutes: 8,
    pickupMinutes: 8,
    mustHaves: { montessori: true, cctvParentAccess: true, flexibleDaycare: true },
    childAgeMonths: 30,
  };

  it("1. should exclude schools that exceed max cab travel time", () => {
    const school = SEED_SCHOOLS[0];
    const result = computeFitScore(school, {
      ...baseContext,
      dropMinutes: 25,
      maxTravelMinutes: 20,
    });
    expect(result.isExcluded).toBe(true);
    expect(result.exclusionReason).toContain("exceeds your 20 min limit");
  });

  it("2. should exclude schools marked as possibly closed", () => {
    const closedSchool = SEED_SCHOOLS.find((s) => s.id === "pathways-early-years-sec-50")!;
    const result = computeFitScore(closedSchool, baseContext);
    expect(result.isExcluded).toBe(true);
    expect(result.exclusionReason).toContain("possibly closed");
  });

  it("3. should exclude schools confirmed to have no daycare when daycare is a must-have", () => {
    const pallavan = SEED_SCHOOLS.find((s) => s.id === "pallavan-sec-48")!;
    const result = computeFitScore(pallavan, baseContext);
    expect(result.isExcluded).toBe(true);
    expect(result.exclusionReason).toContain("no daycare facility");
  });

  it("4. should not exclude school with no daycare if daycare must-have is false", () => {
    const pallavan = SEED_SCHOOLS.find((s) => s.id === "pallavan-sec-48")!;
    const result = computeFitScore(pallavan, {
      ...baseContext,
      mustHaves: { montessori: true, cctvParentAccess: true, flexibleDaycare: false },
    });
    expect(result.isExcluded).toBe(false);
  });

  it("5. should exclude confirmed non-Montessori schools when Montessori is a must-have", () => {
    const footprints = SEED_SCHOOLS.find((s) => s.id === "footprints-sec-48")!;
    const result = computeFitScore(footprints, baseContext);
    expect(result.isExcluded).toBe(true);
    expect(result.exclusionReason).toContain("non-Montessori");
  });

  it("6. should not exclude non-Montessori school when Montessori must-have is toggled off", () => {
    const footprints = SEED_SCHOOLS.find((s) => s.id === "footprints-sec-48")!;
    const result = computeFitScore(footprints, {
      ...baseContext,
      mustHaves: { montessori: false, cctvParentAccess: true, flexibleDaycare: true },
    });
    expect(result.isExcluded).toBe(false);
  });

  it("7. should score Productive Minds high on Montessori and indicate low fee bucket", () => {
    const productiveMinds = SEED_SCHOOLS.find((s) => s.id === "productive-minds-sec-47")!;
    const result = computeFitScore(productiveMinds, {
      ...baseContext,
      mustHaves: { montessori: true, cctvParentAccess: true, flexibleDaycare: false },
    });
    expect(result.isExcluded).toBe(false);
    expect(result.feeBucket).toBe("Low");
    expect(result.totalScore).toBeGreaterThanOrEqual(45);
  });

  it("8. should dynamically re-weight score when Montessori weight is raised to 60", () => {
    const productiveMinds = SEED_SCHOOLS.find((s) => s.id === "productive-minds-sec-47")!;
    const customWeights: UserWeights = {
      montessori: 60,
      safety: 10,
      daycare: 10,
      travel: 10,
      fees: 10,
    };
    const result = computeFitScore(productiveMinds, {
      ...baseContext,
      weights: customWeights,
      mustHaves: { montessori: true, cctvParentAccess: true, flexibleDaycare: false },
    });
    expect(result.breakdown.montessori.maxPoints).toBe(60);
  });

  it("9. should dynamically re-weight score when Travel weight is raised to 50", () => {
    const productiveMinds = SEED_SCHOOLS.find((s) => s.id === "productive-minds-sec-47")!;
    const customWeights: UserWeights = {
      montessori: 10,
      safety: 10,
      daycare: 10,
      travel: 50,
      fees: 20,
    };
    const result = computeFitScore(productiveMinds, {
      ...baseContext,
      weights: customWeights,
      dropMinutes: 6,
      pickupMinutes: 6,
      mustHaves: { montessori: true, cctvParentAccess: true, flexibleDaycare: false },
    });
    expect(result.breakdown.travel.maxPoints).toBe(50);
    expect(result.breakdown.travel.earnedPoints).toBeGreaterThanOrEqual(30);
  });

  it("10. should assign correct Medium fee bucket for schools between 7k and 12k", () => {
    const appleBlossom = SEED_SCHOOLS.find((s) => s.id === "apple-blossom-sec-46")!;
    const result = computeFitScore(appleBlossom, {
      ...baseContext,
      mustHaves: { montessori: false, cctvParentAccess: true, flexibleDaycare: false },
    });
    expect(result.feeBucket).toBe("Medium");
  });

  it("11. should assign High fee bucket for schools over 12k", () => {
    const klay = SEED_SCHOOLS.find((s) => s.id === "klay-sec-49")!;
    const result = computeFitScore(klay, {
      ...baseContext,
      mustHaves: { montessori: false, cctvParentAccess: false, flexibleDaycare: false },
    });
    expect(result.feeBucket).toBe("High");
  });

  it("12. should apply confidence penalty when facts are conflicting/old", () => {
    const productiveMinds = SEED_SCHOOLS.find((s) => s.id === "productive-minds-sec-47")!;
    const result = computeFitScore(productiveMinds, {
      ...baseContext,
      mustHaves: { montessori: true, cctvParentAccess: true, flexibleDaycare: false },
    });
    expect(result.confidencePenalty).toBe(4);
  });

  it("13. should handle all-zero travel time gracefully with max travel subscore", () => {
    const school = SEED_SCHOOLS[0];
    const result = computeFitScore(school, {
      ...baseContext,
      dropMinutes: 0,
      pickupMinutes: 0,
      mustHaves: { montessori: false, cctvParentAccess: false, flexibleDaycare: false },
    });
    expect(result.subScores.travel).toBe(1.0);
  });

  it("14. should floor travel subscore at 0.1 when right on travel limit", () => {
    const school = SEED_SCHOOLS[0];
    const result = computeFitScore(school, {
      ...baseContext,
      dropMinutes: 20,
      pickupMinutes: 20,
      maxTravelMinutes: 20,
      mustHaves: { montessori: false, cctvParentAccess: false, flexibleDaycare: false },
    });
    expect(result.isExcluded).toBe(false);
    expect(result.subScores.travel).toBe(0.1);
  });

  it("15. score breakdown sum must equal unpenalized total", () => {
    const school = SEED_SCHOOLS[1];
    const result = computeFitScore(school, {
      ...baseContext,
      mustHaves: { montessori: false, cctvParentAccess: false, flexibleDaycare: false },
    });
    const sumPoints =
      result.breakdown.montessori.earnedPoints +
      result.breakdown.safety.earnedPoints +
      result.breakdown.daycare.earnedPoints +
      result.breakdown.travel.earnedPoints +
      result.breakdown.fees.earnedPoints;
    expect(Math.abs(sumPoints - (result.totalScore + result.confidencePenalty))).toBeLessThanOrEqual(2);
  });
});
