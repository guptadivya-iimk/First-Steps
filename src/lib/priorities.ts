import type { Weights } from "@/lib/scoring";

/**
 * Each of the five priorities keeps one colour across the product: on the
 * needs page where the parent sets it, and in the score breakdown where they
 * see what it bought them.
 */
export const PRIORITY_CRAYON: Record<keyof Weights, string> = {
  montessori: "crayon crayon-lagoon",
  safety: "crayon crayon-tangerine",
  daycare: "crayon crayon-grape",
  travel: "crayon crayon-berry",
  fees: "crayon crayon-sunshine",
};
