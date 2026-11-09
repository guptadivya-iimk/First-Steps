import * as React from "react";
import { cn } from "@/lib/utils";
import { CRAYON_HEX } from "@/lib/schoolIdentity";

/**
 * A drawn preview of the Atlas for the landing page.
 *
 * It is an illustration, not a map: no tiles, no network, nothing to load.
 * The real Atlas sits one tap away. Pins use the same deep crayon colours
 * and teardrop shape as the live map, so the preview tells the truth about
 * what the parent will see.
 */

const PINS: { x: number; y: number; score: number; hex: string; big?: boolean }[] = [
  { x: 214, y: 150, score: 67, hex: CRAYON_HEX.tangerine, big: true },
  { x: 330, y: 112, score: 63, hex: CRAYON_HEX.forest },
  { x: 386, y: 198, score: 61, hex: CRAYON_HEX.grape },
  { x: 140, y: 238, score: 58, hex: CRAYON_HEX.lagoon },
  { x: 292, y: 262, score: 64, hex: CRAYON_HEX.sunshine },
  { x: 446, y: 120, score: 49, hex: CRAYON_HEX.berry },
];

function Pin({ x, y, score, hex, big }: (typeof PINS)[number]) {
  const s = big ? 1.22 : 1;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path
        d="M0 22C-12 10-16 4-16-4a16 16 0 0 1 32 0c0 8-4 14-16 26Z"
        fill={hex}
        stroke="#ffffff"
        strokeWidth="2.5"
      />
      <text
        x="0"
        y="1"
        textAnchor="middle"
        fill="#ffffff"
        fontFamily="var(--font-display), sans-serif"
        fontWeight="800"
        fontSize="12"
      >
        {score}
      </text>
    </g>
  );
}

export function AtlasPreview({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 560 360"
      aria-hidden="true"
      className={cn("block h-auto w-full", className)}
    >
      <rect width="560" height="360" fill="var(--paper-raised)" />

      {/* parks */}
      <path
        d="M40 40c40-18 96-10 108 22s-26 52-68 50-62-54-40-72Z"
        fill="var(--lime-pale)"
      />
      <path
        d="M420 250c36-12 92 0 102 34s-44 48-82 40-52-60-20-74Z"
        fill="var(--lime-pale)"
      />

      {/* side streets */}
      <g stroke="var(--paper-deep)" strokeWidth="12" strokeLinecap="round" fill="none">
        <path d="M0 96h560" />
        <path d="M0 206c120-8 240 6 560-6" />
        <path d="M0 300h560" />
        <path d="M104 0v360" />
        <path d="M262 0c-6 120 4 240-4 360" />
        <path d="M420 0v360" />
      </g>

      {/* the main road, running corner to corner like Sohna Road */}
      <path
        d="M-10 330C140 270 300 170 570 30"
        stroke="var(--sand)"
        strokeWidth="22"
        strokeLinecap="round"
        fill="none"
      />

      {/* sector names */}
      <g
        fill="var(--ink-faint)"
        fontFamily="var(--font-sans), sans-serif"
        fontSize="12"
        fontWeight="600"
      >
        <text x="20" y="160">Sector 46</text>
        <text x="180" y="72">Sector 47</text>
        <text x="460" y="70">Sector 48</text>
        <text x="330" y="330">Sector 49</text>
        <text x="20" y="345">Sector 50</text>
      </g>

      {/* home */}
      <g>
        <circle cx="240" cy="196" r="22" fill="var(--tangerine)" opacity="0.14" />
        <circle cx="240" cy="196" r="9" fill="#ffffff" stroke="var(--ink)" strokeWidth="3.5" />
        <rect x="200" y="216" width="80" height="22" rx="11" fill="var(--ink)" />
        <text
          x="240"
          y="231"
          textAnchor="middle"
          fill="#ffffff"
          fontFamily="var(--font-sans), sans-serif"
          fontWeight="700"
          fontSize="11.5"
        >
          You
        </text>
      </g>

      {PINS.map((p) => (
        <Pin key={`${p.x}-${p.y}`} {...p} />
      ))}
    </svg>
  );
}
