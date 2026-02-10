import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-[#1A1A1A] placeholder:text-[#9CA3AF] selection:bg-[#EEF2FF] selection:text-[#4F46E5] h-10 w-full min-w-0 rounded-lg border border-[#E8E8E8] bg-white px-3.5 py-2 text-sm shadow-sm transition-all outline-none",
        "focus:border-[#6366F1] focus:ring-2 focus:ring-[#6366F1]/20",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export { Input }
