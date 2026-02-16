"use client";

import { GripVertical } from "lucide-react";
import * as React from "react";
import { Group, Panel, Separator } from "react-resizable-panels";
import { cn } from "@/lib/utils";

function ResizablePanelGroup({
  className,
  ...props
}: React.ComponentProps<typeof Group>) {
  return (
    <Group
      className={cn("flex h-full w-full data-[panel-group-direction=vertical]:flex-col", className)}
      {...props}
    />
  );
}
ResizablePanelGroup.displayName = "ResizablePanelGroup";

function ResizablePanel({ className, ...props }: React.ComponentProps<typeof Panel>) {
  return <Panel className={cn(className)} {...props} />;
}
ResizablePanel.displayName = "ResizablePanel";

interface ResizableHandleProps extends React.ComponentProps<typeof Separator> {
  withHandle?: boolean;
}

function ResizableHandle({ className, withHandle, ...props }: ResizableHandleProps) {
  return (
    <Separator
      className={cn(
      "relative flex w-px items-center justify-center bg-gray-200 dark:bg-gray-600 after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-400 focus-visible:ring-offset-1 data-[panel-group-direction=vertical]:h-px data-[panel-group-direction=vertical]:w-full data-[panel-group-direction=vertical]:after:left-0 data-[panel-group-direction=vertical]:after:h-1 data-[panel-group-direction=vertical]:after:w-full data-[panel-group-direction=vertical]:after:-translate-y-1/2 data-[panel-group-direction=vertical]:after:translate-x-0 [&[data-panel-group-direction=vertical]>div]:rotate-0",
      className
    )}
    {...props}
  >
    {withHandle ? (
      <div className="z-10 flex h-4 w-3 items-center justify-center rounded-sm border border-gray-200 bg-gray-100 dark:border-gray-600 dark:bg-gray-800">
        <GripVertical className="h-4 w-3 text-gray-500 dark:text-gray-400" />
      </div>
    ) : null}
  </Separator>
  );
}
ResizableHandle.displayName = "ResizableHandle";

export { ResizableHandle, ResizablePanel, ResizablePanelGroup };
