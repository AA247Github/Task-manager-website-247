"use client"

import { useState, useEffect, useCallback } from "react"
import type { Task, Attachment } from "@/lib/types"

const STORAGE_KEY = "task-manager-tasks"

function loadTasks(): Task[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveTasks(tasks: Task[]) {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
}

export function useTaskStore() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setTasks(loadTasks())
    setIsLoaded(true)
  }, [])

  useEffect(() => {
    if (isLoaded) {
      saveTasks(tasks)
    }
  }, [tasks, isLoaded])

  const addTask = useCallback(
    (
      task: Omit<Task, "id" | "createdAt" | "updatedAt">
    ) => {
      const now = new Date().toISOString()
      const newTask: Task = {
        ...task,
        id: crypto.randomUUID(),
        createdAt: now,
        updatedAt: now,
      }
      setTasks((prev) => [newTask, ...prev])
      return newTask
    },
    []
  )

  const updateTask = useCallback(
    (id: string, updates: Partial<Omit<Task, "id" | "createdAt">>) => {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === id
            ? { ...t, ...updates, updatedAt: new Date().toISOString() }
            : t
        )
      )
    },
    []
  )

  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const getTask = useCallback(
    (id: string) => tasks.find((t) => t.id === id),
    [tasks]
  )

  const addAttachment = useCallback(
    (taskId: string, attachment: Omit<Attachment, "id">) => {
      const newAttachment: Attachment = {
        ...attachment,
        id: crypto.randomUUID(),
      }
      setTasks((prev) =>
        prev.map((t) =>
          t.id === taskId
            ? {
                ...t,
                attachments: [...t.attachments, newAttachment],
                updatedAt: new Date().toISOString(),
              }
            : t
        )
      )
      return newAttachment
    },
    []
  )

  const removeAttachment = useCallback(
    (taskId: string, attachmentId: string) => {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === taskId
            ? {
                ...t,
                attachments: t.attachments.filter((a) => a.id !== attachmentId),
                updatedAt: new Date().toISOString(),
              }
            : t
        )
      )
    },
    []
  )

  const allTags = Array.from(
    new Set(tasks.flatMap((t) => t.tags))
  ).sort()

  return {
    tasks,
    isLoaded,
    addTask,
    updateTask,
    deleteTask,
    getTask,
    addAttachment,
    removeAttachment,
    allTags,
  }
}
