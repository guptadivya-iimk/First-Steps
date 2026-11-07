/**
 * Every school gets a colour and a doodle, picked from its id and never
 * changing. The same school is the same colour on its card, in the comparison
 * table and as a pin on the map, so a parent can follow one school across the
 * whole product by sight rather than by reading its name each time.
 */

export const CRAYONS = [
  "tangerine",
  "lagoon",
  "forest",
  "sunshine",
  "grape",
  "berry",
] as const;

export type Crayon = (typeof CRAYONS)[number];

export const DOODLE_NAMES = [
  "balloon",
  "boat",
  "kite",
  "star",
  "sprout",
  "bird",
  "sun",
  "blocks",
] as const;

export type DoodleName = (typeof DOODLE_NAMES)[number];

/** A small, stable hash. Same id in, same number out, on server and client. */
function hash(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) {
    h = (h * 31 + id.charCodeAt(i)) >>> 0;
  }
  return h;
}

export function crayonFor(id: string): Crayon {
  return CRAYONS[hash(id) % CRAYONS.length];
}

export function doodleFor(id: string): DoodleName {
  return DOODLE_NAMES[(hash(id) >>> 3) % DOODLE_NAMES.length];
}

/** The class that sets `--crayon` for everything inside. */
export function crayonClass(id: string): string {
  return `crayon crayon-${crayonFor(id)}`;
}

/**
 * Hex values for anything that cannot read a CSS variable, such as map pins.
 *
 * These are the deep cut of each crayon, not the bright one. A pin carries
 * white score text, and white on a bright sunshine yellow is 2:1, which no parent
 * squinting at a phone in sunlight should have to deal with. Every value here
 * clears 5:1 against white.
 */
export const CRAYON_HEX: Record<Crayon, string> = {
  tangerine: "#b8431f",
  lagoon: "#1f6276",
  forest: "#2c6b3f",
  sunshine: "#7d5712",
  grape: "#5b3a9e",
  berry: "#a8294a",
};
