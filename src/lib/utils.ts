import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * Our type ramp is spelled `text-step-1` … `text-step-11`. Out of the box
 * tailwind-merge reads any unknown `text-*` as a colour, so it treated a size
 * and a colour as the same slot and dropped whichever came first. That is how
 * `text-white` quietly vanished from the primary button. Teaching it the ramp
 * keeps sizes and colours in separate slots.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        {
          text: [
            "step-1",
            "step-2",
            "step-3",
            "step-4",
            "step-5",
            "step-6",
            "step-7",
            "step-8",
            "step-9",
            "step-10",
            "step-11",
            "step-12",
          ],
        },
      ],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
