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
  "inline-flex w-fit max-w-full items-center gap-1.5 rounded-[var(--radius-sm)] border px-2 py-1 text-step-1 leading-snug font-semibold [&>svg]:pointer-events-none [&>svg]:size-3.5",
  {
    variants: {
      variant: {
        default: "border-forest/30 bg-forest-pale text-forest-ink",
        website: "border-lagoon/35 bg-lagoon-pale text-lagoon-ink",
        warn: "border-sunshine-ink/25 bg-sunshine-pale text-sunshine-ink",
        ask: "border-grape/25 bg-grape-pale text-grape-ink",
        good: "border-lime-ink/25 bg-lime-pale text-lime-ink",
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
