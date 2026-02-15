"use client"

import { useRef } from "react"
import { cn } from "@/lib/utils"

interface TerminalProps {
  children: React.ReactNode
  className?: string
  sequence?: boolean
  startOnView?: boolean
  /** Ref for the scrollable content area (e.g. to scroll to bottom) */
  scrollRef?: React.RefObject<HTMLDivElement | null>
}

export function Terminal({
  children,
  className,
  scrollRef,
}: TerminalProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <div
      ref={containerRef}
      className={cn(
        "flex flex-col overflow-hidden rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-[#0f1117] shadow-lg h-full",
        className
      )}
    >
      <div
        ref={scrollRef}
        className="flex-1 min-h-0 overflow-y-auto p-3 font-mono text-xs text-gray-800 dark:text-gray-100"
      >
        {children}
      </div>
    </div>
  )
}

interface TerminalLineProps {
  children: React.ReactNode
  className?: string
  delay?: number
}

export function TerminalLine({ children, className }: TerminalLineProps) {
  return (
    <div
      className={cn(
        "flex items-start gap-2 py-0.5 text-gray-700 dark:text-gray-200",
        className
      )}
    >
      <span className="select-none text-green-600 dark:text-green-400">$</span>
      <span>{children}</span>
    </div>
  )
}
