/* eslint-disable @next/next/no-img-element */
import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * The two illustrated children.
 *
 * Both are vector traces of the reference paintings, served from
 * /public/characters as static files. They are loaded with <img> rather than
 * inlined, so roughly a megabyte of path data never enters the JavaScript
 * bundle and is cached like any other image.
 *
 * The girl is two layers drawn on the same 720 x 900 canvas: her body, and the
 * balloons with their strings. The balloon layer pivots on the point where the
 * strings enter her fist, so the bundle sways as if held rather than floating
 * loose. The boy is one layer and simply breathes.
 *
 * Both are decorative. The page never relies on them to say anything.
 */

const RATIO = "720 / 900";

export function Kid({
  who,
  className,
  priority = false,
}: {
  who: "girl" | "boy";
  className?: string;
  /** Load eagerly. Use only for the illustration above the fold. */
  priority?: boolean;
}) {
  const loading = priority ? "eager" : "lazy";
  const fetchPriority = priority ? "high" : "auto";

  if (who === "girl") {
    return (
      <div
        aria-hidden="true"
        className={cn("kid kid-float w-full", className)}
        style={{ aspectRatio: RATIO }}
      >
        <img
          src="/characters/girl-body.svg"
          alt=""
          width={720}
          height={900}
          loading={loading}
          fetchPriority={fetchPriority}
          draggable={false}
        />
        <img
          src="/characters/girl-balloons.svg"
          alt=""
          width={720}
          height={900}
          loading={loading}
          fetchPriority={fetchPriority}
          draggable={false}
          className="kid-balloons"
        />
      </div>
    );
  }

  return (
    <div
      aria-hidden="true"
      className={cn("kid kid-breathe w-full", className)}
      style={{ aspectRatio: RATIO }}
    >
      <img
        src="/characters/boy-blocks.svg"
        alt=""
        width={720}
        height={900}
        loading={loading}
        fetchPriority={fetchPriority}
        draggable={false}
      />
    </div>
  );
}
