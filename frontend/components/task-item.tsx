"use client"

import { cn } from "@/lib/utils"
import type { Task } from "@/lib/types"
import { PriorityBadge } from "@/components/priority-badge"
import { StatusBadge } from "@/components/status-badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Calendar, MoreHorizontal, Paperclip, Pencil, Trash2 } from "lucide-react"
import { format, isPast, isToday } from "date-fns"

interface TaskItemProps {
  task: Task
  onToggleDone: (id: string) => void
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
  onClick: (task: Task) => void
}

export function TaskItem({ task, onToggleDone, onEdit, onDelete, onClick }: TaskItemProps) {
  const isDone = task.status === "done"
  const isOverdue = task.dueDate && !isDone && isPast(new Date(task.dueDate)) && !isToday(new Date(task.dueDate))
  const isDueToday = task.dueDate && isToday(new Date(task.dueDate))

  return (
    <div
      className={cn(
        "group flex items-center gap-3 border-b border-border px-4 py-3 transition-colors hover:bg-muted/50 cursor-pointer",
        isDone && "opacity-60"
      )}
      onClick={() => onClick(task)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          onClick(task)
        }
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Checkbox
          checked={isDone}
          onCheckedChange={() => onToggleDone(task.id)}
          aria-label={`Mark "${task.title}" as ${isDone ? "not done" : "done"}`}
        />
      </div>

      <PriorityBadge priority={task.priority} showLabel={false} size="sm" />

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className={cn("truncate text-sm font-medium text-foreground", isDone && "line-through text-muted-foreground")}>
            {task.title}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {task.dueDate && (
            <span
              className={cn(
                "inline-flex items-center gap-1 text-xs",
                isOverdue && "text-red-500",
                isDueToday && !isDone && "text-amber-500",
                !isOverdue && !isDueToday && "text-muted-foreground"
              )}
            >
              <Calendar className="size-3" />
              {format(new Date(task.dueDate), "MMM d")}
            </span>
          )}
          {task.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="h-5 px-1.5 text-[10px] font-normal text-muted-foreground">
              {tag}
            </Badge>
          ))}
          {task.attachments.length > 0 && (
            <span className="inline-flex items-center gap-0.5 text-xs text-muted-foreground">
              <Paperclip className="size-3" />
              {task.attachments.length}
            </span>
          )}
        </div>
      </div>

      <div className="hidden items-center gap-2 sm:flex">
        <StatusBadge status={task.status} />
        <PriorityBadge priority={task.priority} size="sm" />
      </div>

      <div onClick={(e) => e.stopPropagation()} onKeyDown={(e) => e.stopPropagation()}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="size-7 opacity-0 transition-opacity group-hover:opacity-100 focus:opacity-100"
            >
              <MoreHorizontal className="size-4" />
              <span className="sr-only">Task actions</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-36">
            <DropdownMenuItem onClick={() => onEdit(task)}>
              <Pencil className="size-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              onClick={() => onDelete(task.id)}
            >
              <Trash2 className="size-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
