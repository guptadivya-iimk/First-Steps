import { describe, it, expect } from "vitest";
import { SEED_SCHOOLS, SECTOR_47_AREA } from "@/data/seedSchools";
import { DEFAULT_WEIGHTS, estimateCabMinutes, scoreSchool } from "@/lib/scoring";
import { draftQuestions } from "@/lib/outreach";
import type { School } from "@/lib/types";

function scored(school: School) {
  const cabMinutes = estimateCabMinutes(SECTOR_47_AREA.center, school.location);
  return scoreSchool({
    school,
    weights: DEFAULT_WEIGHTS,
    cabMinutes,
    maxTravelMinutes: 20,
    budgetBuckets: ["low", "medium", "high"],
    feeThresholds: SECTOR_47_AREA.feeThresholds,
  });
}

const productiveMinds = SEED_SCHOOLS.find((s) => s.id === "productive-minds-sec-47")!;

describe("drafting questions to a school", () => {
  it("opens WhatsApp when the school has a number", () => {
    const draft = draftQuestions(productiveMinds, scored(productiveMinds));
    expect(draft.channel).toBe("whatsapp");
    expect(draft.href).toMatch(/^https:\/\/wa\.me\/\d+\?text=/);
  });

  it("asks every open question, numbered", () => {
    const score = scored(productiveMinds);
    const draft = draftQuestions(productiveMinds, score);
    expect(score.openQuestions.length).toBeGreaterThan(0);
    score.openQuestions.forEach((_, i) => {
      expect(draft.text).toContain(`${i + 1}. `);
    });
    expect(draft.text).toContain("What are the monthly fees?");
  });

  it("turns a statement into something the school can answer", () => {
    const draft = draftQuestions(productiveMinds, scored(productiveMinds));
    for (const line of draft.text.split("\n").filter((l) => /^\d+\. /.test(l))) {
      expect(line.trim().endsWith("?")).toBe(true);
    }
  });

  it("falls back to email, then to nothing, as contact details run out", () => {
    const emailOnly: School = {
      ...productiveMinds,
      contacts: productiveMinds.contacts.filter((c) => c.type === "email"),
    };
    const viaEmail = draftQuestions(emailOnly, scored(emailOnly));
    expect(viaEmail.channel).toBe("email");
    expect(viaEmail.href).toMatch(/^mailto:/);

    const unreachable: School = { ...productiveMinds, contacts: [] };
    const none = draftQuestions(unreachable, scored(unreachable));
    expect(none.channel).toBeNull();
    expect(none.href).toBeNull();
  });

  it("asks for a visit when there is nothing left to ask", () => {
    const score = { ...scored(productiveMinds), openQuestions: [] };
    expect(draftQuestions(productiveMinds, score).text).toContain("visit");
  });

  it("puts nothing about the parent or the child into the message", () => {
    const draft = draftQuestions(productiveMinds, scored(productiveMinds));
    expect(draft.text).not.toMatch(/\bmonths? old\b|\bdaughter\b|\bson\b|\bmy name\b/i);
  });
});
