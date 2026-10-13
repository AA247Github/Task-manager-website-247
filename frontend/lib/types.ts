export type Priority = "high" | "medium" | "low"
export type Status = "todo" | "in-progress" | "done"

export type Attachment = {
  id: string
  type: "file" | "link"
  name: string
  url: string
  fileSize?: number
}

export type Task = {
  id: string
  title: string
  description: string
  priority: Priority
  status: Status
  dueDate: string | null
  tags: string[]
  attachments: Attachment[]
  createdAt: string
  updatedAt: string
}

export const PRIORITY_CONFIG: Record<
  Priority,
  { label: string; color: string; dotClass: string; textClass: string; bgClass: string }
> = {
  high: {
    label: "High",
    color: "red",
    dotClass: "bg-red-500",
    textClass: "text-red-500",
    bgClass: "bg-red-500/10 text-red-500 border-red-500/20",
  },
  medium: {
    label: "Medium",
    color: "amber",
    dotClass: "bg-amber-500",
    textClass: "text-amber-500",
    bgClass: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  },
  low: {
    label: "Low",
    color: "green",
    dotClass: "bg-green-500",
    textClass: "text-green-500",
    bgClass: "bg-green-500/10 text-green-500 border-green-500/20",
  },
}

export const STATUS_CONFIG: Record<Status, { label: string; bgClass: string }> = {
  todo: {
    label: "To Do",
    bgClass: "bg-muted text-muted-foreground",
  },
  "in-progress": {
    label: "In Progress",
    bgClass: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  },
  done: {
    label: "Done",
    bgClass: "bg-green-500/10 text-green-500 border-green-500/20",
  },
}
