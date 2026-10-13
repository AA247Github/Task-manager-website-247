"use client"

import { Button } from "@/components/ui/button"
import { Plus, CheckSquare } from "lucide-react"

interface HeaderProps {
  taskCount: number
  doneCount: number
  onAddTask: () => void
}

export function Header({ taskCount, doneCount, onAddTask }: HeaderProps) {
  return (
    <header className="flex items-center justify-between border-b border-border px-6 py-4">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <CheckSquare className="size-5 text-foreground" />
          <h1 className="text-xl font-semibold tracking-tight text-foreground">Task Manager</h1>
        </div>
        <div className="hidden items-center gap-2 text-sm text-muted-foreground sm:flex">
          <span>{taskCount} {taskCount === 1 ? "task" : "tasks"}</span>
          <span aria-hidden="true">{"/"}</span>
          <span>{doneCount} done</span>
        </div>
      </div>
      <Button onClick={onAddTask} size="sm" className="gap-1.5">
        <Plus className="size-4" />
        <span className="hidden sm:inline">Add Task</span>
        <span className="sm:hidden">Add</span>
      </Button>
    </header>
  )
}
