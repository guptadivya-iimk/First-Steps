import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * A toddler sitting cross-legged, stacking wooden blocks.
 *
 * Drawn from the reference photograph as flat vector rather than traced, so
 * it keeps the pose, the striped tee under tan dungarees, the curly hair and
 * the wooden tower, while still belonging to the poster style of the rest of
 * the product. Moving parts are named groups the stylesheet animates.
 */

const INK = "var(--ink)";
const SKIN = "#e4a87e";
const SKIN_DEEP = "#cf8f66";
const HAIR = "#19130f";
const HAIR_LIFT = "#332821";
const DUNGAREE = "#a98a57";
const DUNGAREE_DEEP = "#8d7045";
const TEE = "#f5f1e6";
const TEE_STRIPE = "#27418a";
const SHOE = "#f6f3ea";
const WOOD = "#eec87f";
const WOOD_SIDE = "#d8ac5b";

/** One curl clump. Several of these overlapping read as curly hair. */
function Curl({ cx, cy, r, fill = HAIR }: { cx: number; cy: number; r: number; fill?: string }) {
  return <circle cx={cx} cy={cy} r={r} fill={fill} />;
}

export function BlockBuilder({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 360 340"
      fill="none"
      aria-hidden="true"
      className={cn("character", className)}
    >
      <defs>
        {/* Stripes are clipped to the tee so they follow its shape. */}
        <clipPath id="bb-tee">
          <path d="M96 182c0-20 20-34 46-34h30c26 0 46 14 46 34v34c0 14-12 24-28 24h-66c-16 0-28-10-28-24Z" />
        </clipPath>
      </defs>

      <ellipse cx="180" cy="312" rx="150" ry="11" fill={INK} opacity="0.07" />

      {/* ---------- legs, splayed forward ---------- */}
      <g>
        <path
          d="M134 256c-28 12-54 18-78 20"
          stroke={DUNGAREE}
          strokeWidth="40"
          strokeLinecap="round"
        />
        <path
          d="M184 256c30 12 60 18 92 20"
          stroke={DUNGAREE}
          strokeWidth="40"
          strokeLinecap="round"
        />
        {/* ankle cuffs */}
        <path d="M62 278h16M268 278h16" stroke={DUNGAREE_DEEP} strokeWidth="38" strokeLinecap="round" />

        {/* left shoe, toes pointing out */}
        <g>
          <path
            d="M56 262c-16-3-30 4-32 18-1 11 8 18 22 18 16 0 26-8 26-19Z"
            fill={SHOE}
            stroke={INK}
            strokeWidth="6"
            strokeLinejoin="round"
          />
          <path d="M26 288h42" stroke={INK} strokeWidth="5" strokeLinecap="round" opacity="0.35" />
          <path d="M34 272h18" stroke={TEE_STRIPE} strokeWidth="5" strokeLinecap="round" />
        </g>
      </g>

      {/* ---------- wooden tower ---------- */}
      <g className="bb-tower">
        {/* loose cube, left */}
        <g>
          <path d="M62 262h48v40H62z" fill={WOOD} stroke={INK} strokeWidth="5" strokeLinejoin="round" />
          <path d="M110 262h14v40h-14z" fill={WOOD_SIDE} stroke={INK} strokeWidth="5" strokeLinejoin="round" />
        </g>

        {/* base block with an arch */}
        <g>
          <path
            d="M206 248h100v54H206z"
            fill={WOOD}
            stroke={INK}
            strokeWidth="5"
            strokeLinejoin="round"
          />
          <path
            d="M240 302v-14a16 16 0 0 1 32 0v14"
            fill="var(--paper)"
            stroke={INK}
            strokeWidth="5"
            strokeLinejoin="round"
          />
        </g>

        {/* second course */}
        <path
          d="M214 210h84v38h-84z"
          fill={WOOD}
          stroke={INK}
          strokeWidth="5"
          strokeLinejoin="round"
        />
        {/* third course */}
        <path
          d="M226 174h62v36h-62z"
          fill={WOOD_SIDE}
          stroke={INK}
          strokeWidth="5"
          strokeLinejoin="round"
        />

        {/* the block being placed, which settles into position */}
        <g className="bb-block-top">
          <path
            d="M236 136h50v38h-50z"
            fill={WOOD}
            stroke={INK}
            strokeWidth="5"
            strokeLinejoin="round"
          />
        </g>

      </g>

      {/* right shoe, clear of the tower */}
      <g>
        <path
          d="M300 262c16-3 30 4 32 18 1 11-8 18-22 18-16 0-26-8-26-19Z"
          fill={SHOE}
          stroke={INK}
          strokeWidth="6"
          strokeLinejoin="round"
        />
        <path d="M288 288h42" stroke={INK} strokeWidth="5" strokeLinecap="round" opacity="0.35" />
        <path d="M304 272h18" stroke={TEE_STRIPE} strokeWidth="5" strokeLinecap="round" />
      </g>

      {/* ---------- body ---------- */}
      <g className="bb-body">
        {/* striped tee */}
        <g>
          <path
            d="M96 182c0-20 20-34 46-34h30c26 0 46 14 46 34v34c0 14-12 24-28 24h-66c-16 0-28-10-28-24Z"
            fill={TEE}
          />
          <g clipPath="url(#bb-tee)">
            <path
              d="M80 160h160M80 182h160M80 204h160M80 226h160"
              stroke={TEE_STRIPE}
              strokeWidth="13"
            />
          </g>
          <path
            d="M96 182c0-20 20-34 46-34h30c26 0 46 14 46 34v34c0 14-12 24-28 24h-66c-16 0-28-10-28-24Z"
            stroke={INK}
            strokeWidth="6"
          />
          {/* collar */}
          <path
            d="M140 150c6 10 26 10 32 0"
            stroke={TEE_STRIPE}
            strokeWidth="9"
            strokeLinecap="round"
          />
        </g>

        {/* dungarees: bib, straps, buttons, pocket */}
        <g>
          <path
            d="M118 196h76a12 12 0 0 1 12 12v44a14 14 0 0 1-14 14h-72a14 14 0 0 1-14-14v-44a12 12 0 0 1 12-12Z"
            fill={DUNGAREE}
            stroke={INK}
            strokeWidth="6"
          />
          {/* straps */}
          <path
            d="M126 198c-2-18 0-30 4-38M186 198c2-18 0-30-4-38"
            stroke={DUNGAREE}
            strokeWidth="15"
            strokeLinecap="round"
          />
          <path
            d="M126 198c-2-18 0-30 4-38M186 198c2-18 0-30-4-38"
            stroke={INK}
            strokeWidth="5"
            fill="none"
            strokeLinecap="round"
            opacity="0.55"
          />
          <circle cx="128" cy="204" r="5.5" fill="#d9a93f" stroke={INK} strokeWidth="3" />
          <circle cx="186" cy="204" r="5.5" fill="#d9a93f" stroke={INK} strokeWidth="3" />
          {/* pocket */}
          <path
            d="M140 222h34v26h-34z"
            fill={DUNGAREE_DEEP}
            stroke={INK}
            strokeWidth="4"
            strokeLinejoin="round"
            opacity="0.85"
          />
        </g>

        {/* left arm: short sleeve, then a bare forearm to the base block */}
        <g>
          <path
            d="M106 192c-8 10-10 20-8 30"
            stroke={TEE}
            strokeWidth="30"
            strokeLinecap="round"
          />
          <path
            d="M94 194h26M92 212h28"
            stroke={TEE_STRIPE}
            strokeWidth="9"
            strokeLinecap="round"
          />
          <path
            d="M106 192c-8 10-10 20-8 30"
            stroke={INK}
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M100 224c6 16 22 26 48 30"
            stroke={SKIN}
            strokeWidth="23"
            strokeLinecap="round"
          />
          <path
            d="M100 224c6 16 22 26 48 30"
            stroke={INK}
            strokeWidth="5.5"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M146 240c15-2 26 5 26 16s-11 17-24 15-17-11-15-19Z"
            fill={SKIN}
            stroke={INK}
            strokeWidth="5"
          />
          <path d="M150 252h17M150 261h15" stroke={SKIN_DEEP} strokeWidth="3.5" strokeLinecap="round" />
        </g>

        {/* right arm: short sleeve, bare forearm, placing the top block */}
        <g className="bb-arm">
          <path
            d="M194 186c12-4 20-10 26-18"
            stroke={TEE}
            strokeWidth="30"
            strokeLinecap="round"
          />
          <path
            d="M190 176l10 18M206 168l10 18"
            stroke={TEE_STRIPE}
            strokeWidth="9"
            strokeLinecap="round"
          />
          <path
            d="M194 186c12-4 20-10 26-18"
            stroke={INK}
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M220 170c14-6 24-16 30-30"
            stroke={SKIN}
            strokeWidth="23"
            strokeLinecap="round"
          />
          <path
            d="M220 170c14-6 24-16 30-30"
            stroke={INK}
            strokeWidth="5.5"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M246 132c13-6 25 1 27 12s-7 19-19 19-17-9-15-18Z"
            fill={SKIN}
            stroke={INK}
            strokeWidth="5"
          />
          <path d="M249 146h18M251 156h14" stroke={SKIN_DEEP} strokeWidth="3.5" strokeLinecap="round" />
        </g>

      </g>

      {/* ---------- head ---------- */}
      <g className="bb-head">
        {/* ear */}
        <circle cx="84" cy="118" r="12" fill={SKIN} stroke={INK} strokeWidth="5" />

        {/* face */}
        <circle cx="138" cy="106" r="56" fill={SKIN} stroke={INK} strokeWidth="6" />

        {/* curly hair: a cap plus clumps around the crown */}
        <g>
          <path
            d="M84 104c0-36 24-62 54-62s54 26 54 62c-8-22-28-34-54-34s-46 12-54 34Z"
            fill={HAIR}
          />
          <Curl cx={92} cy={76} r={20} />
          <Curl cx={116} cy={56} r={22} />
          <Curl cx={144} cy={48} r={23} />
          <Curl cx={172} cy={60} r={21} />
          <Curl cx={190} cy={84} r={19} />
          <Curl cx={196} cy={108} r={15} />
          <Curl cx={82} cy={100} r={15} />
          <Curl cx={132} cy={66} r={18} fill={HAIR_LIFT} />
          <Curl cx={162} cy={72} r={13} fill={HAIR_LIFT} />
        </g>

        {/* forehead dot */}
        <circle cx="140" cy="82" r="4" fill={INK} />

        {/* brows */}
        <path
          d="M106 100c7-6 17-6 24-1M152 99c7-5 17-5 24 1"
          stroke={INK}
          strokeWidth="5"
          strokeLinecap="round"
        />

        {/* eyes, looking down at the blocks */}
        <ellipse cx="118" cy="116" rx="8" ry="9" fill={INK} />
        <ellipse cx="164" cy="116" rx="8" ry="9" fill={INK} />
        <circle cx="121" cy="113" r="2.6" fill="#ffffff" />
        <circle cx="167" cy="113" r="2.6" fill="#ffffff" />

        {/* nose and open smile */}
        <path d="M140 126c4 4 2 8-4 8" stroke={SKIN_DEEP} strokeWidth="4" strokeLinecap="round" />
        <path
          d="M120 142c10 16 32 16 42 0Z"
          fill="#a33b40"
          stroke={INK}
          strokeWidth="5"
          strokeLinejoin="round"
        />
        <path d="M124 143h34" stroke="#ffffff" strokeWidth="5" strokeLinecap="round" />

        {/* cheeks */}
        <circle cx="102" cy="132" r="9" fill="var(--tangerine)" opacity="0.28" />
        <circle cx="178" cy="132" r="9" fill="var(--tangerine)" opacity="0.28" />
      </g>
    </svg>
  );
}
