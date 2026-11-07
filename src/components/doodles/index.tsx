import * as React from "react";
import { cn } from "@/lib/utils";

type DoodleProps = React.SVGProps<SVGSVGElement> & { className?: string };

const base = "shrink-0";

/**
 * Hand-drawn spot illustrations.
 *
 * These carry the warmth of the product. They stay out of the way of facts:
 * never behind text, never inside a data card, one per screen at most.
 * Strokes use currentColor so a doodle takes the colour of whatever it sits in.
 */

/** The brand mark. A toddler footprint, because the product is called FirstSteps. */
export function Footprint({ className, ...props }: DoodleProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={cn(base, className)}
      {...props}
    >
      <path
        d="M8.2 20.4c-2.1 0-3.4-1.4-3.4-3.4 0-2.2 1.1-3.5 1.1-6.1 0-3.4 1.9-5.6 4.6-5.6 2.6 0 4.3 2 4.3 5 0 2.8-1.2 4.2-1.2 6.5 0 2.2-1.6 3.6-3.6 3.6Z"
        fill="currentColor"
        opacity="0.9"
      />
      <circle cx="16.9" cy="5.6" r="1.75" fill="currentColor" opacity="0.55" />
      <circle cx="19.4" cy="9.3" r="1.4" fill="currentColor" opacity="0.45" />
      <circle cx="20.1" cy="13.2" r="1.15" fill="currentColor" opacity="0.35" />
    </svg>
  );
}

/** Empty state: nothing picked yet. */
export function Blocks({ className, ...props }: DoodleProps) {
  return (
    <svg
      viewBox="0 0 120 96"
      fill="none"
      aria-hidden="true"
      className={cn(base, className)}
      {...props}
    >
      <rect
        x="14"
        y="52"
        width="36"
        height="34"
        rx="7"
        className="fill-tangerine-pale stroke-lagoon"
        strokeWidth="2.5"
      />
      <rect
        x="56"
        y="52"
        width="36"
        height="34"
        rx="7"
        className="fill-sunshine-pale stroke-sunshine"
        strokeWidth="2.5"
      />
      <rect
        x="35"
        y="16"
        width="36"
        height="34"
        rx="7"
        className="fill-lagoon-pale stroke-lagoon"
        strokeWidth="2.5"
      />
      <circle cx="32" cy="69" r="3.2" className="fill-lagoon" />
      <circle cx="74" cy="69" r="3.2" className="fill-sunshine" />
      <path
        d="M46 33h14"
        className="stroke-lagoon"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Empty state: nothing scheduled. */
export function Kite({ className, ...props }: DoodleProps) {
  return (
    <svg
      viewBox="0 0 120 96"
      fill="none"
      aria-hidden="true"
      className={cn(base, className)}
      {...props}
    >
      <path
        d="M60 10 85 38 60 70 35 38Z"
        className="fill-sunshine-pale stroke-sunshine"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <path
        d="M60 10v60M35 38h50"
        className="stroke-sunshine"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M60 70c-6 6 6 10 0 16"
        className="stroke-lagoon"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <circle cx="60" cy="38" r="4" className="fill-sunshine" />
    </svg>
  );
}

/** Empty state: nothing found. */
export function PaperBoat({ className, ...props }: DoodleProps) {
  return (
    <svg
      viewBox="0 0 120 96"
      fill="none"
      aria-hidden="true"
      className={cn(base, className)}
      {...props}
    >
      <path
        d="M22 50h76l-16 24H38Z"
        className="fill-lagoon-pale stroke-lagoon"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <path
        d="M60 46V18l22 28Z"
        className="fill-tangerine-pale stroke-lagoon"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <path
        d="M14 82c6-4 10 4 16 0s10 4 16 0 10 4 16 0 10 4 16 0 10 4 16 0"
        className="stroke-lagoon"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** A small sun for warm moments. */
export function Sun({ className, ...props }: DoodleProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      className={cn(base, className)}
      {...props}
    >
      <circle cx="16" cy="16" r="6.5" className="fill-sunshine" />
      <path
        d="M16 3v3.5M16 25.5V29M29 16h-3.5M6.5 16H3M25.2 6.8l-2.5 2.5M9.3 22.7l-2.5 2.5M25.2 25.2l-2.5-2.5M9.3 9.3 6.8 6.8"
        className="stroke-sunshine"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** A sprout for growth and small beginnings. */
export function Sprout({ className, ...props }: DoodleProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      className={cn(base, className)}
      {...props}
    >
      <path
        d="M16 28v-11"
        className="stroke-forest-ink"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <path
        d="M16 18c0-5-4-7-8-7 0 5 3 7 8 7Z"
        className="fill-forest-pale stroke-forest"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <path
        d="M16 16c0-5 4-8 8-8 0 5-3 8-8 8Z"
        className="fill-forest-pale stroke-forest"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** A five-point star, used to mark a strong match. */
export function Star({ className, ...props }: DoodleProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={cn(base, className)}
      {...props}
    >
      <path
        d="m12 2.8 2.7 5.9 6.4.7-4.8 4.3 1.3 6.3L12 16.9l-5.6 3.1 1.3-6.3L2.9 9.4l6.4-.7Z"
        fill="currentColor"
      />
    </svg>
  );
}

/** A dotted path with a star, used to break up long pages. */
export function DoodleDivider({ className }: { className?: string }) {
  return (
    <div
      className={cn("flex items-center justify-center gap-3 py-2", className)}
      aria-hidden="true"
    >
      <span className="h-px w-16 bg-line-strong sm:w-24" />
      <Star className="size-3.5 text-sunshine" />
      <span className="h-px w-16 bg-line-strong sm:w-24" />
    </div>
  );
}

/** A balloon on a string. */
export function Balloon({ className, ...props }: DoodleProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={cn(base, className)} {...props}>
      <path
        d="M12 2.6c3.6 0 6.2 2.8 6.2 6.6 0 3.9-3.3 7.4-6.2 7.4S5.8 13.1 5.8 9.2C5.8 5.4 8.4 2.6 12 2.6Z"
        fill="currentColor"
        opacity="0.9"
      />
      <path d="m10.9 16.6 1.1 1.5 1.1-1.5" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M12 18.1c0 2 2.1 1.8 2.1 3.6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <ellipse cx="9.8" cy="7.4" rx="1.3" ry="1.9" fill="white" opacity="0.45" transform="rotate(-20 9.8 7.4)" />
    </svg>
  );
}

/** A little bird. */
export function Bird({ className, ...props }: DoodleProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={cn(base, className)} {...props}>
      <path
        d="M4.2 13.4c0-3.6 2.9-6.1 6.4-6.1 2.5 0 4.1 1 5.2 2.6l3.9.9-2.5 1.9c-.2 3.9-3.1 6.5-6.6 6.5-3.5 0-6.4-2.3-6.4-5.8Z"
        fill="currentColor"
        opacity="0.9"
      />
      <circle cx="13.6" cy="11.3" r="1" fill="white" />
      <path d="M8.6 14.4c1.6 1.3 3.4 1.3 5 0" stroke="white" strokeWidth="1.3" strokeLinecap="round" opacity="0.6" />
      <path d="M10.4 19.2 9 22M14 19 13.4 22" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

/** A crayon, for anything the parent writes. */
export function Crayon({ className, ...props }: DoodleProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={cn(base, className)} {...props}>
      <path d="m5 19 2-6 9.4-9.4a2 2 0 0 1 2.8 0l.2.2a2 2 0 0 1 0 2.8L10 16Z" fill="currentColor" opacity="0.9" />
      <path d="m5 19 2.6-.8-1.8-1.8Z" fill="currentColor" />
    </svg>
  );
}

/** A rainbow, used once, at the end of a page. */
export function Rainbow({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 96 52" fill="none" aria-hidden="true" className={cn(base, className)}>
      <path d="M8 48a40 40 0 0 1 80 0" className="stroke-tangerine" strokeWidth="7" strokeLinecap="round" />
      <path d="M17 48a31 31 0 0 1 62 0" className="stroke-sunshine" strokeWidth="7" strokeLinecap="round" />
      <path d="M26 48a22 22 0 0 1 44 0" className="stroke-forest" strokeWidth="7" strokeLinecap="round" />
      <path d="M35 48a13 13 0 0 1 26 0" className="stroke-lagoon" strokeWidth="7" strokeLinecap="round" />
    </svg>
  );
}

/* ---------------------------------------------------------------------------
   School marks.

   Compact, single-colour versions of the doodles above, drawn on a 24 grid.
   They sit inside a school's monogram tile and take the crayon colour of the
   school, so they have to be one colour and legible at 20px.
   --------------------------------------------------------------------------- */

function MarkBoat({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={cn(base, className)}>
      <path d="M3.5 13h17l-3.6 5.6H7.1Z" fill="currentColor" opacity="0.9" />
      <path d="M12 11.6V4.2l5 7.4Z" fill="currentColor" />
    </svg>
  );
}

function MarkKite({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={cn(base, className)}>
      <path d="M12 2.6 19 9.4 12 16.2 5 9.4Z" fill="currentColor" opacity="0.9" />
      <path d="M12 16.4c-1.6 1.6 1.6 2.8 0 4.6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function MarkBlocks({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={cn(base, className)}>
      <rect x="2.6" y="12.6" width="8.4" height="8.4" rx="2" fill="currentColor" opacity="0.9" />
      <rect x="13" y="12.6" width="8.4" height="8.4" rx="2" fill="currentColor" opacity="0.55" />
      <rect x="7.8" y="3" width="8.4" height="8.4" rx="2" fill="currentColor" opacity="0.75" />
    </svg>
  );
}

function MarkSprout({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={cn(base, className)}>
      <path d="M12 21v-8" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M12 14c0-4-3-5.6-6.4-5.6C5.6 12.4 8 14 12 14Z" fill="currentColor" opacity="0.9" />
      <path d="M12 12.4c0-4 3.2-6.4 6.4-6.4 0 4-2.4 6.4-6.4 6.4Z" fill="currentColor" opacity="0.6" />
    </svg>
  );
}

function MarkSun({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={cn(base, className)}>
      <circle cx="12" cy="12" r="5" fill="currentColor" opacity="0.9" />
      <path
        d="M12 2v2.6M12 19.4V22M22 12h-2.6M4.6 12H2M19.1 4.9l-1.9 1.9M6.8 17.2l-1.9 1.9M19.1 19.1l-1.9-1.9M6.8 6.8 4.9 4.9"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

const SCHOOL_MARKS = {
  balloon: Balloon,
  boat: MarkBoat,
  kite: MarkKite,
  star: Star,
  sprout: MarkSprout,
  bird: Bird,
  sun: MarkSun,
  blocks: MarkBlocks,
} as const;

export type SchoolMarkName = keyof typeof SCHOOL_MARKS;

/** The mark that belongs to one school. Takes the colour it sits in. */
export function SchoolMark({
  name,
  className,
}: {
  name: SchoolMarkName;
  className?: string;
}) {
  const Component = SCHOOL_MARKS[name] ?? Star;
  return <Component className={className} />;
}

/* ---------------------------------------------------------------------------
   Scribbles.

   Loose black pen marks, the kind drawn in a margin while thinking. They sit
   around headings and in empty corners to keep the page from feeling like a
   spreadsheet. They carry no meaning, so they are always aria-hidden and they
   never sit behind text.
   --------------------------------------------------------------------------- */

const scribble = "pointer-events-none select-none";

/** A loose wave, for under or beside a heading. */
export function Squiggle({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 20"
      fill="none"
      aria-hidden="true"
      className={cn(scribble, className)}
    >
      <path
        d="M3 13c7-10 14 6 21-2s14 8 21 0 14 7 21-1 14 5 21-3 14 6 21-1"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

/** A spiky burst, for marking something new or good. */
export function Burst({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
      className={cn(scribble, className)}
    >
      <path
        d="m24 3 4.3 9.8 9.4-5-4 9.7 10.4 1.2-8.4 5.4 8.4 5.4-10.4 1.2 4 9.7-9.4-5L24 45l-4.3-9.6-9.4 5 4-9.7L3.9 29.5l8.4-5.4-8.4-5.4 10.4-1.2-4-9.7 9.4 5Z"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

/** A curl, for a corner that feels empty. */
export function Curl({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
      className={cn(scribble, className)}
    >
      <path
        d="M6 40c0-16 8-26 18-26 7 0 11 5 11 10s-4 9-9 9-8-3-8-7 3-7 7-7c9 0 13 8 13 16"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

/** Three short speed lines, for motion or emphasis. */
export function Zips({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 28"
      fill="none"
      aria-hidden="true"
      className={cn(scribble, className)}
    >
      <path
        d="M4 6h22M9 14h24M4 22h17"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** A hand-drawn circle, for ringing a number. */
export function RingMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 60"
      fill="none"
      aria-hidden="true"
      className={cn(scribble, className)}
    >
      <path
        d="M62 7C38 1 10 10 6 27c-4 16 20 28 45 26 22-2 44-13 42-27C91 13 72 6 54 6"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

/** The soft hill that separates one band of the page from the next. */
export function HillDivider({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1440 90"
      preserveAspectRatio="none"
      aria-hidden="true"
      className={cn("block w-full", className)}
    >
      <path
        d="M0 90V52c120-28 240-42 360-30s240 50 360 50 240-38 360-50 240-6 360 30v38Z"
        fill="currentColor"
      />
    </svg>
  );
}
