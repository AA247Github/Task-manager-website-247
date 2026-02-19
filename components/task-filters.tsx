"use client"

import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Search, X } from "lucide-react"
import type { Priority, Status } from "@/lib/types"

export type SortOption = "created" | "dueDate" | "priority" | "alpha"

interface TaskFiltersProps {
  search: string
  onSearchChange: (val: string) => void
  priorityFilter: Priority | "all"
  onPriorityChange: (val: Priority | "all") => void
  statusFilter: Status | "all"
  onStatusChange: (val: Status | "all") => void
  sort: SortOption
  onSortChange: (val: SortOption) => void
  tagFilter: string | "all"
  onTagChange: (val: string | "all") => void
  allTags: string[]
}

export function TaskFilters({
  search,
  onSearchChange,
  priorityFilter,
  onPriorityChange,
  statusFilter,
  onStatusChange,
  sort,
  onSortChange,
  tagFilter,
  onTagChange,
  allTags,
}: TaskFiltersProps) {
  const activeFilterCount = [
    priorityFilter !== "all" ? 1 : 0,
    statusFilter !== "all" ? 1 : 0,
    tagFilter !== "all" ? 1 : 0,
    search.trim() ? 1 : 0,
  ].reduce((a, b) => a + b, 0)

  function clearFilters() {
    onSearchChange("")
    onPriorityChange("all")
    onStatusChange("all")
    onTagChange("all")
  }

  return (
    <div className="flex flex-col gap-3 border-b border-border px-6 py-3">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="h-8 pl-8 text-sm"
          />
        </div>

        <Select value={priorityFilter} onValueChange={(v) => onPriorityChange(v as Priority | "all")}>
          <SelectTrigger size="sm" className="w-[120px] text-xs">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            <SelectItem value="high">
              <span className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-red-500" />
                High
              </span>
            </SelectItem>
            <SelectItem value="medium">
              <span className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-amber-500" />
                Medium
              </span>
            </SelectItem>
            <SelectItem value="low">
              <span className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-green-500" />
                Low
              </span>
            </SelectItem>
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={(v) => onStatusChange(v as Status | "all")}>
          <SelectTrigger size="sm" className="w-[130px] text-xs">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="todo">To Do</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="done">Done</SelectItem>
          </SelectContent>
        </Select>

        {allTags.length > 0 && (
          <Select value={tagFilter} onValueChange={(v) => onTagChange(v)}>
            <SelectTrigger size="sm" className="w-[120px] text-xs">
              <SelectValue placeholder="Tag" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tags</SelectItem>
              {allTags.map((tag) => (
                <SelectItem key={tag} value={tag}>
                  {tag}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        <Select value={sort} onValueChange={(v) => onSortChange(v as SortOption)}>
          <SelectTrigger size="sm" className="w-[130px] text-xs">
            <SelectValue placeholder="Sort" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="created">Newest First</SelectItem>
            <SelectItem value="dueDate">Due Date</SelectItem>
            <SelectItem value="priority">Priority</SelectItem>
            <SelectItem value="alpha">Alphabetical</SelectItem>
          </SelectContent>
        </Select>

        {activeFilterCount > 0 && (
          <Button variant="ghost" size="sm" className="h-8 gap-1 text-xs" onClick={clearFilters}>
            <X className="size-3" />
            Clear
            <Badge variant="secondary" className="ml-0.5 h-4 px-1 text-[10px]">
              {activeFilterCount}
            </Badge>
          </Button>
        )}
      </div>
    </div>
  )
}
