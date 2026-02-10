import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full border border-transparent px-2.5 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default: "bg-[#6366F1] text-white",
        secondary:
          "bg-[#F5F5F5] text-[#6B7280]",
        destructive:
          "bg-[#FEF2F2] text-[#DC2626] border border-[#FECACA]",
        outline: "border border-[#E8E8E8] text-[#6B7280]",
        ghost: "text-[#6B7280] hover:bg-[#F5F5F5]",
        link: "text-[#6366F1] underline-offset-4 hover:underline",
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
