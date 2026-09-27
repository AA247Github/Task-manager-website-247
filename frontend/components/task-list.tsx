"use client"

import { TaskItem } from "@/components/task-item"
import type { Task, Priority, Status } from "@/lib/types"
import type { SortOption } from "@/components/task-filters"
import { ClipboardList } from "lucide-react"

interface TaskListProps {
  tasks: Task[]
  search: string
  priorityFilter: Priority | "all"
  statusFilter: Status | "all"
  tagFilter: string | "all"
  sort: SortOption
  onToggleDone: (id: string) => void
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
  onClick: (task: Task) => void
}

const PRIORITY_ORDER: Record<Priority, number> = { high: 0, medium: 1, low: 2 }

function filterAndSort(
  tasks: Task[],
  search: string,
  priorityFilter: Priority | "all",
  statusFilter: Status | "all",
  tagFilter: string | "all",
  sort: SortOption
): Task[] {
  let filtered = tasks

  if (search.trim()) {
    const q = search.toLowerCase()
    filtered = filtered.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.tags.some((tag) => tag.toLowerCase().includes(q))
    )
  }

  if (priorityFilter !== "all") {
    filtered = filtered.filter((t) => t.priority === priorityFilter)
  }

  if (statusFilter !== "all") {
    filtered = filtered.filter((t) => t.status === statusFilter)
  }

  if (tagFilter !== "all") {
    filtered = filtered.filter((t) => t.tags.includes(tagFilter))
  }

  const sorted = [...filtered]
  switch (sort) {
    case "created":
      sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      break
    case "dueDate":
      sorted.sort((a, b) => {
        if (!a.dueDate && !b.dueDate) return 0
        if (!a.dueDate) return 1
        if (!b.dueDate) return -1
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
      })
      break
    case "priority":
      sorted.sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority])
      break
    case "alpha":
      sorted.sort((a, b) => a.title.localeCompare(b.title))
      break
  }

  return sorted
}

export function TaskList({
  tasks,
  search,
  priorityFilter,
  statusFilter,
  tagFilter,
  sort,
  onToggleDone,
  onEdit,
  onDelete,
  onClick,
}: TaskListProps) {
  const filteredTasks = filterAndSort(tasks, search, priorityFilter, statusFilter, tagFilter, sort)

  if (tasks.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 py-20 text-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-muted">
          <ClipboardList className="size-6 text-muted-foreground" />
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium text-foreground">No tasks yet</p>
          <p className="text-sm text-muted-foreground">
            Click the &quot;Add Task&quot; button to create your first task.
          </p>
        </div>
      </div>
    )
  }

  if (filteredTasks.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 py-20 text-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-muted">
          <ClipboardList className="size-6 text-muted-foreground" />
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium text-foreground">No matching tasks</p>
          <p className="text-sm text-muted-foreground">
            Try adjusting your search or filters.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col overflow-y-auto">
      {filteredTasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggleDone={onToggleDone}
          onEdit={onEdit}
          onDelete={onDelete}
          onClick={onClick}
        />
      ))}
    </div>
  )
}
