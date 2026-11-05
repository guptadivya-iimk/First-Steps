import { describe, it, expect } from "vitest";
import { SEED_SCHOOLS, SECTOR_47_AREA } from "@/data/seedSchools";
import {
  DEFAULT_WEIGHTS,
  estimateCabMinutes,
  feeBucket,
  scoreSchool,
  type Weights,
} from "@/lib/scoring";

const base = {
  weights: DEFAULT_WEIGHTS,
  maxTravelMinutes: 20,
  budgetBuckets: ["low", "medium", "high"] as Array<"low" | "medium" | "high">,
  feeThresholds: SECTOR_47_AREA.feeThresholds,
};

function school(id: string) {
  const found = SEED_SCHOOLS.find((s) => s.id === id);
  if (!found) throw new Error(`No seed school ${id}`);
  return found;
}

function scoreFor(id: string, weights: Weights = DEFAULT_WEIGHTS) {
  const s = school(id);
  const cabMinutes = estimateCabMinutes(SECTOR_47_AREA.center, s.location);
  return scoreSchool({ ...base, weights, school: s, cabMinutes });
}

describe("fee buckets", () => {
  const t = SECTOR_47_AREA.feeThresholds;

  it("splits at the area thresholds", () => {
    expect(feeBucket(6000, t)).toBe("low");
    expect(feeBucket(7000, t)).toBe("low");
    expect(feeBucket(7001, t)).toBe("medium");
    expect(feeBucket(12000, t)).toBe("medium");
    expect(feeBucket(12001, t)).toBe("high");
  });

  it("says so when a fee is missing rather than guessing", () => {
    expect(feeBucket(undefined, t)).toBe("unknown");
  });
});

describe("cab time estimate", () => {
  it("grows with distance", () => {
    const near = estimateCabMinutes(SECTOR_47_AREA.center, school("productive-minds-sec-47").location);
    const far = estimateCabMinutes(SECTOR_47_AREA.center, school("gd-goenka-sec-38").location);
    expect(far).toBeGreaterThan(near);
  });

  it("never returns less than three minutes", () => {
    const same = estimateCabMinutes(SECTOR_47_AREA.center, SECTOR_47_AREA.center);
    expect(same).toBeGreaterThanOrEqual(3);
  });
});

describe("fit score", () => {
  it("stays between 0 and 100", () => {
    for (const s of SEED_SCHOOLS) {
      const result = scoreFor(s.id);
      expect(result.total).toBeGreaterThanOrEqual(0);
      expect(result.total).toBeLessThanOrEqual(100);
    }
  });

  it("ranks a Montessori school above a HighScope one on method", () => {
    const montessori = scoreFor("our-montessori-house-sec-48");
    const highScope = scoreFor("footprints-sec-48");

    const m = montessori.components.find((c) => c.key === "montessori")!;
    const h = highScope.components.find((c) => c.key === "montessori")!;

    expect(m.points).toBeGreaterThan(h.points);
  });

  it("gives every component out of its own weight", () => {
    const result = scoreFor("productive-minds-sec-47");
    for (const c of result.components) {
      expect(c.points).toBeLessThanOrEqual(c.weight);
      expect(c.points).toBeGreaterThanOrEqual(0);
    }
  });

  it("follows the weights it is given", () => {
    const feesOnly: Weights = {
      montessori: 0,
      safety: 0,
      daycare: 0,
      travel: 0,
      fees: 100,
    };
    const result = scoreFor("footprints-sec-48", feesOnly);
    const fees = result.components.find((c) => c.key === "fees")!;
    expect(fees.weight).toBe(100);
    expect(result.total).toBe(Math.round(fees.points));
  });

  it("raises a question when a fee is not published", () => {
    const result = scoreFor("productive-minds-sec-47");
    expect(result.openQuestions).toContain("What are the monthly fees?");
  });

  it("surfaces conflicting facts as questions to ask", () => {
    const result = scoreFor("productive-minds-sec-47");
    expect(result.openQuestions.length).toBeGreaterThan(0);
  });

  it("trusts a confirmed fact more than a listing", () => {
    // Same curriculum wording, different provenance.
    const s = school("our-montessori-house-sec-48");
    const cabMinutes = estimateCabMinutes(SECTOR_47_AREA.center, s.location);

    const asListing = scoreSchool({
      ...base,
      school: {
        ...s,
        facts: {
          ...s.facts,
          curriculum: { ...s.facts.curriculum, status: "listing" },
        },
      },
      cabMinutes,
    });
    const asConfirmed = scoreSchool({
      ...base,
      school: {
        ...s,
        facts: {
          ...s.facts,
          curriculum: { ...s.facts.curriculum, status: "confirmed" },
        },
      },
      cabMinutes,
    });

    expect(asConfirmed.total).toBeGreaterThan(asListing.total);
  });
});
