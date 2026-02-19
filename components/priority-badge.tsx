import { cn } from "@/lib/utils"
import { PRIORITY_CONFIG, type Priority } from "@/lib/types"

interface PriorityBadgeProps {
  priority: Priority
  showLabel?: boolean
  size?: "sm" | "md"
}

export function PriorityBadge({ priority, showLabel = true, size = "md" }: PriorityBadgeProps) {
  const config = PRIORITY_CONFIG[priority]
  const dotSize = size === "sm" ? "size-2" : "size-2.5"

  return (
    <span className={cn("inline-flex items-center gap-1.5", showLabel && "rounded-full border px-2.5 py-0.5 text-xs font-medium", showLabel && config.bgClass)}>
      <span className={cn("shrink-0 rounded-full", dotSize, config.dotClass)} aria-hidden="true" />
      {showLabel && <span>{config.label}</span>}
      <span className="sr-only">{config.label} priority</span>
    </span>
  )
}
