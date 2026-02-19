import { cn } from "@/lib/utils"
import { STATUS_CONFIG, type Status } from "@/lib/types"

interface StatusBadgeProps {
  status: Status
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status]

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        config.bgClass
      )}
    >
      {config.label}
    </span>
  )
}
