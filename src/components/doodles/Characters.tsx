import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * The characters.
 *
 * Flat shapes with thick dark outlines, drawn in the poster palette, in the
 * spirit of the illustration on langmobile. Every moving part is a named
 * group so the stylesheet can animate it, and every animation is switched off
 * under prefers-reduced-motion by the global rule in globals.css.
 *
 * They are decoration and carry no information, so they are aria-hidden and
 * never sit behind text.
 */

const OUTLINE = "var(--ink)";

/** A toddler on a push scooter, waving. The hero character. */
export function ScooterKid({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 320 300"
      fill="none"
      aria-hidden="true"
      className={cn("character", className)}
    >
      <ellipse cx="156" cy="282" rx="104" ry="9" fill={OUTLINE} opacity="0.08" />

      {/* ---- scooter, behind the child ---- */}
      <g className="character__scooter">
        {/* deck */}
        <path
          d="M70 254h150"
          stroke="var(--tangerine)"
          strokeWidth="14"
          strokeLinecap="round"
        />
        {/* stem */}
        <path
          d="M220 254 232 126"
          stroke="var(--tangerine)"
          strokeWidth="14"
          strokeLinecap="round"
        />
        {/* handlebar */}
        <path
          d="M208 122h50"
          stroke={OUTLINE}
          strokeWidth="12"
          strokeLinecap="round"
        />

        <g className="character__wheel">
          <circle cx="70" cy="258" r="22" fill="var(--paper-raised)" stroke={OUTLINE} strokeWidth="8" />
          <path d="M70 242v32M54 258h32" stroke={OUTLINE} strokeWidth="5" strokeLinecap="round" />
        </g>
        <g className="character__wheel character__wheel--b">
          <circle cx="226" cy="258" r="22" fill="var(--paper-raised)" stroke={OUTLINE} strokeWidth="8" />
          <path d="M226 242v32M210 258h32" stroke={OUTLINE} strokeWidth="5" strokeLinecap="round" />
        </g>
      </g>

      {/* ---- child ---- */}
      <g className="character__body">
        {/* legs, chunky and short, both planted on the deck */}
        <path
          d="M136 196v44M172 196v44"
          stroke="var(--lagoon)"
          strokeWidth="18"
          strokeLinecap="round"
        />
        {/* shoes */}
        <path
          d="M128 247h18M164 247h18"
          stroke={OUTLINE}
          strokeWidth="13"
          strokeLinecap="round"
        />

        {/* torso: wide and soft, the mass of the figure */}
        <path
          d="M128 118h52a22 22 0 0 1 22 22v44a20 20 0 0 1-20 20h-56a20 20 0 0 1-20-20v-44a22 22 0 0 1 22-22Z"
          fill="var(--sunshine)"
          stroke={OUTLINE}
          strokeWidth="8"
        />
        {/* a pocket, so the shirt reads as clothing */}
        <path
          d="M142 166h22"
          stroke={OUTLINE}
          strokeWidth="5"
          strokeLinecap="round"
          opacity="0.45"
        />

        {/* steering arm, reaching forward to the bar */}
        <path
          d="M196 142c12 2 20-6 22-18"
          stroke="var(--sunshine)"
          strokeWidth="15"
          strokeLinecap="round"
        />
        <path
          d="M196 142c12 2 20-6 22-18"
          stroke={OUTLINE}
          strokeWidth="7"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="219" cy="122" r="9" fill="var(--sand)" stroke={OUTLINE} strokeWidth="5" />

        {/* waving arm */}
        <g className="character__wave">
          <path
            d="M112 142c-14-2-22-14-22-32"
            stroke="var(--sunshine)"
            strokeWidth="15"
            strokeLinecap="round"
          />
          <path
            d="M112 142c-14-2-22-14-22-32"
            stroke={OUTLINE}
            strokeWidth="7"
            strokeLinecap="round"
            fill="none"
          />
          <circle cx="90" cy="106" r="10" fill="var(--sand)" stroke={OUTLINE} strokeWidth="5" />
        </g>

        {/* head */}
        <g className="character__head">
          <circle cx="154" cy="78" r="33" fill="var(--sand)" stroke={OUTLINE} strokeWidth="8" />
          {/* hair, a soft cap with a tuft */}
          <path
            d="M122 72c1-21 15-34 32-34s31 13 32 34c-7-12-18-18-32-18s-25 6-32 18Z"
            fill={OUTLINE}
          />
          <path
            d="M154 38c3-8 10-10 14-6"
            stroke={OUTLINE}
            strokeWidth="6"
            strokeLinecap="round"
          />
          <circle cx="143" cy="80" r="4.6" fill={OUTLINE} />
          <circle cx="167" cy="80" r="4.6" fill={OUTLINE} />
          <path
            d="M144 92c6 7 14 7 20 0"
            stroke={OUTLINE}
            strokeWidth="5"
            strokeLinecap="round"
          />
          <circle cx="132" cy="89" r="5" fill="var(--tangerine)" opacity="0.45" />
          <circle cx="178" cy="89" r="5" fill="var(--tangerine)" opacity="0.45" />
        </g>
      </g>

      {/* ---- a balloon on a string, drifting ---- */}
      <g className="character__balloon">
        <path
          d="M292 72c0 19-11 31-21 31s-21-12-21-31a21 21 0 1 1 42 0Z"
          fill="var(--berry)"
          stroke={OUTLINE}
          strokeWidth="6"
        />
        <path d="M271 103c0 17-15 15-15 32" stroke={OUTLINE} strokeWidth="4" strokeLinecap="round" />
      </g>

      {/* ---- speed marks ---- */}
      <g className="character__zips" stroke={OUTLINE} strokeLinecap="round">
        <path d="M14 206h36" strokeWidth="7" opacity="0.5" />
        <path d="M4 230h26" strokeWidth="7" opacity="0.35" />
      </g>
    </svg>
  );
}

/** A small bird that bobs. Used in empty corners. */
export function LittleBird({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 80 80"
      fill="none"
      aria-hidden="true"
      className={cn("character", className)}
    >
      <g className="character__hover">
        <path
          d="M14 46c0-13 11-22 24-22 9 0 15 4 19 10l14 3-9 7c-1 14-12 22-24 22s-24-8-24-20Z"
          fill="var(--lagoon)"
          stroke={OUTLINE}
          strokeWidth="5"
        />
        <circle cx="48" cy="40" r="3.4" fill={OUTLINE} />
        <g className="character__wing">
          <path
            d="M26 48c6-6 14-6 20 0-6 7-14 7-20 0Z"
            fill="var(--paper-raised)"
            stroke={OUTLINE}
            strokeWidth="4"
          />
        </g>
        <path
          d="M30 66 26 76M44 66l2 10"
          stroke={OUTLINE}
          strokeWidth="5"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}

/** A friendly sun with a face. Sits above a strong score. */
export function SunnyFace({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 80 80"
      fill="none"
      aria-hidden="true"
      className={cn("character", className)}
    >
      <g className="character__spin">
        <path
          d="M40 4v10M40 66v10M76 40H66M14 40H4M65.5 14.5 58 22M22 58l-7.5 7.5M65.5 65.5 58 58M22 22l-7.5-7.5"
          stroke="var(--sunshine)"
          strokeWidth="7"
          strokeLinecap="round"
        />
      </g>
      <circle
        cx="40"
        cy="40"
        r="20"
        fill="var(--sunshine)"
        stroke={OUTLINE}
        strokeWidth="5"
      />
      <circle cx="33" cy="37" r="2.8" fill={OUTLINE} />
      <circle cx="47" cy="37" r="2.8" fill={OUTLINE} />
      <path
        d="M33 46c4 4 10 4 14 0"
        stroke={OUTLINE}
        strokeWidth="3.4"
        strokeLinecap="round"
      />
    </svg>
  );
}
