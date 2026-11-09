import type { School } from "@/lib/types";
import type { ScoreResult } from "@/lib/scoring";

/**
 * Drafting a message to a school.
 *
 * The product promises that it writes the questions and the parent decides
 * whether to send them. So this only ever builds text and a link that opens
 * the parent's own WhatsApp or mail app with that text filled in. Nothing is
 * sent from here, and nothing about the parent or the child goes in the text:
 * every line is a question about the school.
 */

export interface Draft {
  text: string;
  /** Where the draft opens. Null when the school has no way to reach it. */
  href: string | null;
  channel: "whatsapp" | "email" | null;
}

const OPENING =
  "Hello! I'm a parent looking at preschools near Sector 47, Gurugram. Could you help with a few questions?";

/** Turn an open item into something a school can answer. */
function asQuestion(item: string): string {
  const trimmed = item.trim();
  return trimmed.endsWith("?") ? trimmed : `Could you confirm this: ${trimmed}?`;
}

export function draftQuestions(school: School, score: ScoreResult): Draft {
  const questions = score.openQuestions.length
    ? score.openQuestions.map(asQuestion)
    : ["Could I visit on a weekday morning, while the children are in class?"];

  const text = [
    OPENING,
    "",
    ...questions.map((q, i) => `${i + 1}. ${q}`),
    "",
    "Thank you.",
  ].join("\n");

  const whatsapp =
    school.contacts.find((c) => c.type === "whatsapp")?.value ??
    school.contacts.find((c) => c.type === "phone")?.value;
  const digits = whatsapp?.replace(/[^0-9]/g, "");

  if (digits) {
    return {
      text,
      href: `https://wa.me/${digits}?text=${encodeURIComponent(text)}`,
      channel: "whatsapp",
    };
  }

  const email = school.contacts.find((c) => c.type === "email")?.value;
  if (email) {
    const subject = encodeURIComponent(`A few questions about ${school.name}`);
    return {
      text,
      href: `mailto:${email}?subject=${subject}&body=${encodeURIComponent(text)}`,
      channel: "email",
    };
  }

  return { text, href: null, channel: null };
}
