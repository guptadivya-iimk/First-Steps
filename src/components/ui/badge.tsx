import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Slot } from "radix-ui"

/**
 * Colour carries meaning here, so the variants are named for what they say,
 * not for how they look. Teal means a school confirmed it. Marigold means
 * check it yourself. Lilac means nobody knows yet.
 */
const badgeVariants = cva(
  "inline-flex w-fit max-w-full items-center gap-1.5 rounded-[var(--radius-chip)] border px-2.5 py-1 text-step-1 leading-snug font-semibold [&>svg]:pointer-events-none [&>svg]:size-3.5",
  {
    variants: {
      variant: {
        default: "border-teal/25 bg-teal-pale text-teal-ink",
        website: "border-sky/30 bg-sky-pale text-sky-ink",
        warn: "border-marigold/40 bg-marigold-pale text-marigold-ink",
        ask: "border-lilac/30 bg-lilac-pale text-lilac-ink",
        good: "border-leaf/30 bg-leaf-pale text-leaf-ink",
        soft: "border-line bg-paper-deep text-ink-soft",
        outline: "border-line-strong bg-transparent text-ink-soft",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span"

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
