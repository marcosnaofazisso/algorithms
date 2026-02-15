import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    const variants = {
      default: "bg-black text-white hover:bg-gray-800 border-none rounded-md shadow-sm dark:bg-gray-100 dark:text-black dark:hover:bg-gray-200",
      outline: "bg-white text-black border border-gray-300 hover:bg-gray-50 rounded-md dark:bg-[#0f1117] dark:text-gray-50 dark:border-gray-500 dark:hover:bg-[#1a1d24]",
      ghost: "bg-transparent text-black hover:bg-gray-100 border-none dark:text-gray-50 dark:hover:bg-[#1a1d24]"
    }
    const sizes = {
      default: "px-4 py-2 text-sm",
      sm: "px-3 py-1.5 text-xs h-8"
    }

    return (
      <button
        className={cn(
          "inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900 disabled:pointer-events-none disabled:opacity-50 rounded-md",
          variants[variant],
          sizes[size],
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
