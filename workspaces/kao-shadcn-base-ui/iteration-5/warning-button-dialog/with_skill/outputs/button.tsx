"use client"

import * as React from "react"
import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils/ui-utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([data-icon])]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring",
        destructive:
          "bg-destructive/10 text-destructive shadow-xs hover:bg-destructive/20 focus-visible:ring-2 focus-visible:ring-destructive/50",
        warning:
          "bg-warning/10 text-warning-foreground shadow-xs hover:bg-warning/20 focus-visible:ring-2 focus-visible:ring-warning/50",
        outline:
          "border border-input bg-background shadow-xs hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring",
        secondary:
          "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80 focus-visible:ring-2 focus-visible:ring-ring",
        ghost:
          "hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        xs: "h-7 gap-1 rounded-md px-2 text-xs has-[>svg]:px-1.5",
        sm: "h-8 gap-1.5 rounded-md px-3 text-xs has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
        "icon-xs": "size-7",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
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
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

function ButtonGroup({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="button-group"
      className={cn(
        "inline-flex -space-x-px rounded-md shadow-xs [&_[data-slot=button]]:rounded-none [&_[data-slot=button]]:shadow-none [&_[data-slot=button]:first-child]:rounded-s-md [&_[data-slot=button]:last-child]:rounded-e-md",
        className
      )}
      {...props}
    />
  )
}

export { Button, ButtonGroup, buttonVariants }
