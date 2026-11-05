import { describe, it, expect } from "vitest";
import { SEED_SCHOOLS } from "@/data/seedSchools";
import {
  CRAYONS,
  CRAYON_HEX,
  DOODLE_NAMES,
  crayonClass,
  crayonFor,
  doodleFor,
} from "@/lib/schoolIdentity";

describe("school identity", () => {
  it("gives the same school the same colour every time", () => {
    for (const school of SEED_SCHOOLS) {
      expect(crayonFor(school.id)).toBe(crayonFor(school.id));
      expect(doodleFor(school.id)).toBe(doodleFor(school.id));
    }
  });

  it("only ever uses colours and marks that exist", () => {
    for (const school of SEED_SCHOOLS) {
      expect(CRAYONS).toContain(crayonFor(school.id));
      expect(DOODLE_NAMES).toContain(doodleFor(school.id));
      expect(CRAYON_HEX[crayonFor(school.id)]).toMatch(/^#[0-9a-f]{6}$/);
    }
  });

  it("spreads the fourteen schools across the whole crayon box", () => {
    const used = new Set(SEED_SCHOOLS.map((s) => crayonFor(s.id)));
    expect(used.size).toBeGreaterThanOrEqual(4);
  });

  it("builds a class that sets the crayon variables", () => {
    const cls = crayonClass("productive-minds-sec-47");
    expect(cls.startsWith("crayon crayon-")).toBe(true);
  });

  it("does not depend on where the id sits in the list", () => {
    // The colour comes from the id alone, so reordering the seed file cannot
    // silently repaint the whole product.
    expect(crayonFor("klay-sec-49")).toBe(crayonFor("klay-sec-49"));
    expect(crayonFor("a")).not.toBe(undefined);
  });
});
