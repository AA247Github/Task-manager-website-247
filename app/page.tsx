"use client"

import { useState } from "react"
import { useTaskStore } from "@/lib/use-task-store"
import { Header } from "@/components/header"
import { TaskFilters, type SortOption } from "@/components/task-filters"
import { TaskList } from "@/components/task-list"
import { TaskForm, type TaskFormData } from "@/components/task-form"
import { TaskDetail } from "@/components/task-detail"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import type { Task, Priority, Status } from "@/lib/types"
import { toast } from "sonner"

export default function HomePage() {
  const store = useTaskStore()

  // Form state
  const [formOpen, setFormOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)

  // Detail state
  const [detailTask, setDetailTask] = useState<Task | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)

  // Delete confirmation
  const [deleteId, setDeleteId] = useState<string | null>(null)

  // Filter state
  const [search, setSearch] = useState("")
  const [priorityFilter, setPriorityFilter] = useState<Priority | "all">("all")
  const [statusFilter, setStatusFilter] = useState<Status | "all">("all")
  const [sort, setSort] = useState<SortOption>("created")
  const [tagFilter, setTagFilter] = useState<string | "all">("all")

  function handleAddTask() {
    setEditingTask(null)
    setFormOpen(true)
  }

  function handleEditTask(task: Task) {
    setEditingTask(task)
    setFormOpen(true)
  }

  function handleFormSubmit(data: TaskFormData) {
    if (editingTask) {
      store.updateTask(editingTask.id, data)
      toast.success("Task updated")
    } else {
      store.addTask(data)
      toast.success("Task created")
    }
  }

  function handleToggleDone(id: string) {
    const task = store.getTask(id)
    if (!task) return
    const newStatus = task.status === "done" ? "todo" : "done"
    store.updateTask(id, { status: newStatus })
    toast.success(newStatus === "done" ? "Task completed" : "Task reopened")
  }

  function handleDeleteRequest(id: string) {
    setDeleteId(id)
  }

  function handleDeleteConfirm() {
    if (deleteId) {
      store.deleteTask(deleteId)
      toast.success("Task deleted")
      setDeleteId(null)
    }
  }

  function handleTaskClick(task: Task) {
    setDetailTask(task)
    setDetailOpen(true)
  }

  // Keep detail task in sync with store
  const currentDetailTask = detailTask ? store.getTask(detailTask.id) ?? null : null

  const doneCount = store.tasks.filter((t) => t.status === "done").length

  if (!store.isLoaded) {
    return (
      <div className="flex h-dvh items-center justify-center bg-background">
        <div className="size-6 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="flex h-dvh flex-col bg-background">
      <Header
        taskCount={store.tasks.length}
        doneCount={doneCount}
        onAddTask={handleAddTask}
      />

      <TaskFilters
        search={search}
        onSearchChange={setSearch}
        priorityFilter={priorityFilter}
        onPriorityChange={setPriorityFilter}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        sort={sort}
        onSortChange={setSort}
        tagFilter={tagFilter}
        onTagChange={setTagFilter}
        allTags={store.allTags}
      />

      <main className="flex flex-1 flex-col overflow-hidden">
        <TaskList
          tasks={store.tasks}
          search={search}
          priorityFilter={priorityFilter}
          statusFilter={statusFilter}
          tagFilter={tagFilter}
          sort={sort}
          onToggleDone={handleToggleDone}
          onEdit={handleEditTask}
          onDelete={handleDeleteRequest}
          onClick={handleTaskClick}
        />
      </main>

      <TaskForm
        open={formOpen}
        onOpenChange={setFormOpen}
        task={editingTask}
        onSubmit={handleFormSubmit}
        existingTags={store.allTags}
      />

      <TaskDetail
        task={currentDetailTask}
        open={detailOpen}
        onOpenChange={setDetailOpen}
        onEdit={handleEditTask}
        onDelete={handleDeleteRequest}
        onAddAttachment={store.addAttachment}
        onRemoveAttachment={store.removeAttachment}
      />

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete task?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The task and all its attachments will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
