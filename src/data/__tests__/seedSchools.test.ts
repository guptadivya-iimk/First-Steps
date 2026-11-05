import { describe, it, expect } from "vitest";
import { SEED_SCHOOLS, SECTOR_47_AREA } from "@/data/seedSchools";

describe("Sector 47 Seed Schools & Area Data", () => {
  it("should have exactly 14 seed schools for Gurugram", () => {
    expect(SEED_SCHOOLS).toHaveLength(14);
  });

  it("should have active Sector 47 service area configured with fee thresholds", () => {
    expect(SECTOR_47_AREA.id).toBe("gurugram-sec-47");
    expect(SECTOR_47_AREA.feeThresholds.lowMax).toBe(7000);
    expect(SECTOR_47_AREA.feeThresholds.mediumMax).toBe(12000);
  });

  it("should identify Productive Minds timings conflict", () => {
    const productiveMinds = SEED_SCHOOLS.find((s) => s.id === "productive-minds-sec-47");
    expect(productiveMinds).toBeDefined();
    expect(productiveMinds?.facts.timings?.status).toBe("conflicting");
    expect(productiveMinds?.facts.daycareAvailable?.status).toBe("conflicting");
  });

  it("should flag Pathways Early Years as possibly closed", () => {
    const pathways = SEED_SCHOOLS.find((s) => s.id === "pathways-early-years-sec-50");
    expect(pathways).toBeDefined();
    expect(pathways?.status).toBe("possibly_closed");
  });

  it("should flag iDiscoveri curriculum as XSEED conflicting with Montessori listing", () => {
    const idiscoveri = SEED_SCHOOLS.find((s) => s.id === "idiscoveri-sec-46");
    expect(idiscoveri).toBeDefined();
    expect(idiscoveri?.facts.curriculum?.status).toBe("conflicting");
  });

  it("should verify Footprints has HighScope curriculum with live parent CCTV app", () => {
    const footprints48 = SEED_SCHOOLS.find((s) => s.id === "footprints-sec-48");
    expect(footprints48).toBeDefined();
    expect(footprints48?.facts.curriculum?.value).toBe("HighScope");
    expect(footprints48?.facts.cctvParentAccess?.status).toBe("website");
  });
});
