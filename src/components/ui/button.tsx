import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Slot } from "radix-ui"

// Clippifi buttons (DESIGN.md → Buttons): every button is a pill with no border.
// - brand: yellow, ONLY for core brand actions (Join campaign, Submit clip, Connect TikTok,
//   Withdraw, Fund campaign, Start earning).
// - default: charcoal, for neutral main actions (Save changes, Continue).
// - secondary: soft grey, for the alternative next to a main action.
// - ghost: no fill until hover. destructive: red text on a soft red fill.
const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-full font-medium whitespace-nowrap transition-[background-color,color,transform,box-shadow] duration-150 ease-out outline-none select-none focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:scale-[0.97] disabled:pointer-events-none disabled:opacity-45 aria-invalid:ring-3 aria-invalid:ring-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-[18px]",
  {
    variants: {
      variant: {
        brand: "bg-brand text-brand-foreground hover:bg-brand-300 dark:hover:bg-brand-500",
        default: "bg-primary text-primary-foreground hover:bg-primary/85",
        secondary: "bg-muted text-foreground hover:bg-[color-mix(in_oklch,var(--muted),var(--foreground)_7%)] aria-expanded:bg-[color-mix(in_oklch,var(--muted),var(--foreground)_7%)]",
        outline: "bg-card text-foreground shadow-[0_1px_2px_rgb(0_0_0/0.06)] hover:bg-muted",
        ghost: "text-muted-foreground hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground",
        destructive: "bg-destructive-muted text-destructive hover:bg-[color-mix(in_oklch,var(--destructive-muted),var(--destructive)_10%)] focus-visible:ring-destructive/25",
        link: "text-foreground underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 gap-2 px-5 text-[15px] has-data-[icon=inline-end]:pr-4 has-data-[icon=inline-start]:pl-4",
        xs: "h-7 gap-1 px-3 text-xs [&_svg:not([class*='size-'])]:size-3.5",
        sm: "h-8 gap-1.5 px-3.5 text-sm [&_svg:not([class*='size-'])]:size-4",
        lg: "h-12 gap-2 px-6 text-base [&_svg:not([class*='size-'])]:size-5",
        icon: "size-10",
        "icon-xs": "size-7 [&_svg:not([class*='size-'])]:size-3.5",
        "icon-sm": "size-8 [&_svg:not([class*='size-'])]:size-4",
        "icon-lg": "size-12 [&_svg:not([class*='size-'])]:size-5",
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
