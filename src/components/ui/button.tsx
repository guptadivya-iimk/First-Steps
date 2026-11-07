import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Slot } from "radix-ui"

/**
 * Sizes are set for thumbs, not cursors. Every interactive size is at least
 * 44px tall so a parent can hit it one-handed while holding a toddler.
 */
const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center gap-2 rounded-[var(--radius-btn)] border border-transparent font-semibold whitespace-nowrap transition-colors outline-none select-none active:translate-y-px disabled:pointer-events-none disabled:opacity-45 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-[1.15em]",
  {
    variants: {
      variant: {
        default: "bg-tangerine text-ink hover:brightness-95",
        warm: "bg-sunshine text-ink hover:brightness-95",
        outline:
          "border-ink/20 bg-paper-raised text-ink hover:bg-paper-deep",
        secondary: "bg-sand text-ink hover:brightness-[0.97]",
        ghost: "text-ink-soft hover:bg-paper-deep hover:text-ink",
        destructive:
          "bg-destructive/10 text-destructive hover:bg-destructive/20",
        link: "text-tangerine-ink underline underline-offset-4 hover:text-tangerine",
      },
      size: {
        default: "min-h-touch px-5 text-step-4",
        sm: "min-h-touch px-3.5 text-step-3",
        lg: "min-h-13 px-6 text-step-5",
        icon: "size-touch",
        "icon-sm": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
