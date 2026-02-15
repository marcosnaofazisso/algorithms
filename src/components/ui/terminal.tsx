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
        "flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-gray-50 shadow-lg h-full",
        className
      )}
    >
      <div
        ref={scrollRef}
        className="flex-1 min-h-0 overflow-y-auto p-3 font-mono text-xs text-gray-800"
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
        "flex items-start gap-2 py-0.5 text-gray-700",
        className
      )}
    >
      <span className="select-none text-green-600">$</span>
      <span>{children}</span>
    </div>
  )
}
