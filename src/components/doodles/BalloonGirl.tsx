import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * A toddler laughing up at three balloons.
 *
 * Drawn from the reference photograph as flat vector rather than traced, so
 * it keeps the tilted-back laugh, the pigtails with flower ties, the pink
 * cardigan over a floral dress, and the three balloons, while still sitting
 * in the poster style of the rest of the product.
 */

const INK = "var(--ink)";
const SKIN = "#e4a87e";
const SKIN_DEEP = "#cf8f66";
const HAIR = "#2a1d16";
const HAIR_LIFT = "#45332a";
const CARDI = "#ef8db0";
const CARDI_DEEP = "#dd7398";
const DRESS = "#fbf4e4";
const GOLD = "#d9a93f";
const BAL_BLUE = "#3f8fd6";
const BAL_YELLOW = "#f5c518";
const BAL_PINK = "#f28bb0";

function Curl({ cx, cy, r, fill = HAIR }: { cx: number; cy: number; r: number; fill?: string }) {
  return <circle cx={cx} cy={cy} r={r} fill={fill} />;
}

/** One balloon, with a highlight and a knot. */
function Balloon({
  cx,
  cy,
  rx,
  ry,
  fill,
}: {
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  fill: string;
}) {
  return (
    <g>
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={fill} stroke={INK} strokeWidth="5" />
      <ellipse
        cx={cx - rx * 0.34}
        cy={cy - ry * 0.32}
        rx={rx * 0.2}
        ry={ry * 0.3}
        fill="#ffffff"
        opacity="0.5"
        transform={`rotate(-18 ${cx - rx * 0.34} ${cy - ry * 0.32})`}
      />
      <path
        d={`M${cx - 7} ${cy + ry} h14 l-7 11Z`}
        fill={fill}
        stroke={INK}
        strokeWidth="4"
        strokeLinejoin="round"
      />
    </g>
  );
}

export function BalloonGirl({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 320 400"
      fill="none"
      aria-hidden="true"
      className={cn("character", className)}
    >
      <ellipse cx="190" cy="390" rx="104" ry="9" fill={INK} opacity="0.07" />

      {/* ---------- balloons ---------- */}
      <g className="bg-balloons">
        <g className="bg-balloon bg-balloon--a">
          <Balloon cx={54} cy={96} rx={44} ry={50} fill={BAL_BLUE} />
        </g>
        <g className="bg-balloon bg-balloon--b">
          <Balloon cx={124} cy={62} rx={48} ry={54} fill={BAL_YELLOW} />
        </g>
        <g className="bg-balloon bg-balloon--c">
          <Balloon cx={192} cy={96} rx={44} ry={50} fill={BAL_PINK} />
        </g>

        {/* strings, gathered into the raised hand */}
        <path
          d="M54 157c2 14 8 24 20 34M124 127c-10 24-24 42-42 58M192 157c-24 22-66 36-108 42"
          stroke="#f1ece0"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M54 157c2 14 8 24 20 34M124 127c-10 24-24 42-42 58M192 157c-24 22-66 36-108 42"
          stroke={INK}
          strokeWidth="1.6"
          strokeLinecap="round"
          fill="none"
          opacity="0.5"
        />
      </g>

      {/* ---------- body ---------- */}
      <g className="bg-body">
        {/* dress, flaring below the cardigan */}
        <path
          d="M158 320h92l22 72H140Z"
          fill={DRESS}
          stroke={INK}
          strokeWidth="6"
          strokeLinejoin="round"
        />
        {/* a few flowers on the dress */}
        <g opacity="0.85">
          <circle cx="176" cy="344" r="4" fill="#f0a08a" />
          <circle cx="212" cy="336" r="4" fill="#f5c518" />
          <circle cx="246" cy="352" r="4" fill="#8fbf7a" />
          <circle cx="192" cy="370" r="4" fill="#f0a08a" />
          <circle cx="232" cy="376" r="4" fill="#89b4d8" />
        </g>

        {/* cardigan */}
        <path
          d="M166 232h78a26 26 0 0 1 26 26v62a14 14 0 0 1-14 14h-102a14 14 0 0 1-14-14v-62a26 26 0 0 1 26-26Z"
          fill={CARDI}
          stroke={INK}
          strokeWidth="6"
        />
        {/* the dress showing at the neckline */}
        <path
          d="M190 232h30l-15 30Z"
          fill={DRESS}
          stroke={INK}
          strokeWidth="5"
          strokeLinejoin="round"
        />
        {/* button placket */}
        <path d="M205 262v72" stroke={CARDI_DEEP} strokeWidth="7" strokeLinecap="round" />
        <circle cx="205" cy="276" r="5" fill={GOLD} stroke={INK} strokeWidth="2.6" />
        <circle cx="205" cy="300" r="5" fill={GOLD} stroke={INK} strokeWidth="2.6" />
        <circle cx="205" cy="324" r="5" fill={GOLD} stroke={INK} strokeWidth="2.6" />
        {/* pocket */}
        <path
          d="M158 296h30v26h-30z"
          fill={CARDI_DEEP}
          stroke={INK}
          strokeWidth="4"
          strokeLinejoin="round"
          opacity="0.9"
        />

        {/* left arm, resting at her side */}
        <g>
          <path
            d="M262 256c16 14 22 42 16 70"
            stroke={CARDI}
            strokeWidth="28"
            strokeLinecap="round"
          />
          <path
            d="M262 256c16 14 22 42 16 70"
            stroke={INK}
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M266 324c14-2 24 6 22 16s-14 14-24 10-10-22 2-26Z"
            fill={SKIN}
            stroke={INK}
            strokeWidth="5"
          />
        </g>

        {/* right arm, raised to the strings */}
        <g className="bg-arm">
          <path
            d="M166 250c-32 6-58-10-76-38"
            stroke={CARDI}
            strokeWidth="28"
            strokeLinecap="round"
          />
          <path
            d="M166 250c-32 6-58-10-76-38"
            stroke={INK}
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
          />
          {/* cuff */}
          <path
            d="M98 222l-8-12"
            stroke={CARDI_DEEP}
            strokeWidth="26"
            strokeLinecap="round"
          />
          {/* the fist holding all three strings, clear of the pigtail */}
          <path
            d="M66 182c15-7 29 2 31 14s-9 23-23 21-20-27-8-35Z"
            fill={SKIN}
            stroke={INK}
            strokeWidth="5"
          />
          <path
            d="M70 193h21M68 203h22M70 213h17"
            stroke={SKIN_DEEP}
            strokeWidth="3.4"
            strokeLinecap="round"
          />
        </g>
      </g>

      {/* ---------- head, tilted back in a laugh ---------- */}
      <g className="bg-head">
        {/* pigtails behind the face */}
        <g>
          <Curl cx={128} cy={178} r={26} />
          <Curl cx={114} cy={196} r={20} />
          <Curl cx={136} cy={202} r={18} fill={HAIR_LIFT} />
          <Curl cx={268} cy={178} r={26} />
          <Curl cx={282} cy={196} r={20} />
          <Curl cx={260} cy={202} r={18} fill={HAIR_LIFT} />
        </g>

        {/* face */}
        <circle cx="198" cy="160" r="56" fill={SKIN} stroke={INK} strokeWidth="6" />

        {/* hair, a soft curly cap over the crown */}
        <g>
          <path
            d="M142 156c0-36 26-62 56-62s56 26 56 62c-8-24-30-36-56-36s-48 12-56 36Z"
            fill={HAIR}
          />
          <Curl cx={152} cy={128} r={21} />
          <Curl cx={178} cy={108} r={23} />
          <Curl cx={208} cy={104} r={23} />
          <Curl cx={236} cy={118} r={21} />
          <Curl cx={250} cy={142} r={18} />
          <Curl cx={146} cy={152} r={15} />
          <Curl cx={194} cy={118} r={16} fill={HAIR_LIFT} />
          <Curl cx={224} cy={126} r={13} fill={HAIR_LIFT} />
        </g>

        {/* flower hair ties */}
        <g>
          <circle cx="146" cy="168" r="9" fill="#ffffff" stroke={INK} strokeWidth="3" />
          <circle cx="146" cy="168" r="3" fill={GOLD} />
          <circle cx="250" cy="168" r="9" fill="#ffffff" stroke={INK} strokeWidth="3" />
          <circle cx="250" cy="168" r="3" fill={GOLD} />
        </g>

        {/* bindi */}
        <circle cx="200" cy="130" r="4" fill={INK} />

        {/* brows, lifted */}
        <path
          d="M168 146c8-7 19-7 26-1M208 145c8-6 19-6 26 1"
          stroke={INK}
          strokeWidth="5"
          strokeLinecap="round"
        />

        {/* eyes squeezed shut with laughter */}
        <path
          d="M170 166c7-9 17-9 24 0M212 166c7-9 17-9 24 0"
          stroke={INK}
          strokeWidth="5.5"
          strokeLinecap="round"
          fill="none"
        />

        {/* open laughing mouth */}
        <path
          d="M178 186c8 26 36 26 44 0Z"
          fill="#a33b40"
          stroke={INK}
          strokeWidth="5"
          strokeLinejoin="round"
        />
        <path d="M182 188h36" stroke="#ffffff" strokeWidth="6" strokeLinecap="round" />
        <path
          d="M196 206c6 4 12 2 14-2"
          stroke="#f08ca0"
          strokeWidth="6"
          strokeLinecap="round"
        />

        {/* cheeks and an earring */}
        <circle cx="160" cy="182" r="10" fill="var(--tangerine)" opacity="0.3" />
        <circle cx="238" cy="182" r="10" fill="var(--tangerine)" opacity="0.3" />
        <circle cx="150" cy="196" r="4.5" fill={GOLD} stroke={INK} strokeWidth="2.4" />
      </g>
    </svg>
  );
}
