"use client"

import React, { ComponentPropsWithoutRef, useEffect, useMemo, useState } from "react"
import { AnimatePresence, motion } from "motion/react"

import { cn } from "@/lib/utils"

export function AnimatedListItem({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1, originY: 0 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ type: "spring", stiffness: 350, damping: 40 }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  )
}

export interface AnimatedListProps extends ComponentPropsWithoutRef<"div"> {
  children: React.ReactNode
  delay?: number
}

export const AnimatedList = React.memo(
  ({ children, className, delay = 500, ...props }: AnimatedListProps) => {
    const [index, setIndex] = useState(0)
    const childrenArray = useMemo(() => React.Children.toArray(children), [children])

    useEffect(() => {
      if (index < childrenArray.length - 1) {
        const timeout = setTimeout(() => {
          setIndex((prevIndex) => Math.min(prevIndex + 1, childrenArray.length - 1))
        }, delay)
        return () => clearTimeout(timeout)
      }
    }, [index, delay, childrenArray.length])

    const itemsToShow = useMemo(() => {
      return childrenArray.slice(0, index + 1)
    }, [index, childrenArray])

    return (
      <div className={cn("flex flex-col overflow-hidden", className)} {...props}>
        <AnimatePresence initial={false}>
          {itemsToShow.map((item, i) => (
            <AnimatedListItem key={(item as React.ReactElement)?.key ?? i}>{item}</AnimatedListItem>
          ))}
        </AnimatePresence>
      </div>
    )
  }
)

AnimatedList.displayName = "AnimatedList"
