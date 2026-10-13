"use client"

import { useState, useEffect, useRef } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge"
import { AttachmentList } from "@/components/attachment-list"
import { cn } from "@/lib/utils"
import { CalendarIcon, X } from "lucide-react"
import { format } from "date-fns"
import type { Task, Priority, Status, Attachment } from "@/lib/types"
import { toast } from "sonner"

interface TaskFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  task?: Task | null
  onSubmit: (data: TaskFormData) => void
  existingTags: string[]
}

export type TaskFormData = {
  title: string
  description: string
  priority: Priority
  status: Status
  dueDate: string | null
  tags: string[]
  attachments: Attachment[]
}

export function TaskForm({ open, onOpenChange, task, onSubmit, existingTags }: TaskFormProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [priority, setPriority] = useState<Priority>("medium")
  const [status, setStatus] = useState<Status>("todo")
  const [dueDate, setDueDate] = useState<Date | undefined>()
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")
  const [attachments, setAttachments] = useState<Attachment[]>([])
  const [calendarOpen, setCalendarOpen] = useState(false)
  const titleRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      if (task) {
        setTitle(task.title)
        setDescription(task.description)
        setPriority(task.priority)
        setStatus(task.status)
        setDueDate(task.dueDate ? new Date(task.dueDate) : undefined)
        setTags(task.tags)
        setAttachments(task.attachments)
      } else {
        setTitle("")
        setDescription("")
        setPriority("medium")
        setStatus("todo")
        setDueDate(undefined)
        setTags([])
        setTagInput("")
        setAttachments([])
      }
      setTimeout(() => titleRef.current?.focus(), 100)
    }
  }, [open, task])

  function handleAddTag() {
    const trimmed = tagInput.trim()
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed])
    }
    setTagInput("")
  }

  function handleRemoveTag(tag: string) {
    setTags(tags.filter((t) => t !== tag))
  }

  function handleAddAttachment(att: Omit<Attachment, "id">) {
    setAttachments((prev) => [
      ...prev,
      { ...att, id: crypto.randomUUID() },
    ])
  }

  function handleRemoveAttachment(id: string) {
    setAttachments((prev) => prev.filter((a) => a.id !== id))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) {
      toast.error("Task title is required")
      titleRef.current?.focus()
      return
    }
    onSubmit({
      title: title.trim(),
      description: description.trim(),
      priority,
      status,
      dueDate: dueDate ? dueDate.toISOString() : null,
      tags,
      attachments,
    })
    onOpenChange(false)
  }

  const isEdit = !!task

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Task" : "Add New Task"}</DialogTitle>
          <DialogDescription>
            {isEdit ? "Update the task details below." : "Fill in the details for your new task."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="task-title">Title</Label>
            <Input
              ref={titleRef}
              id="task-title"
              placeholder="What needs to be done?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="task-desc">Description</Label>
            <Textarea
              id="task-desc"
              placeholder="Add notes or details..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-20 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label>Priority</Label>
              <div className="flex gap-1">
                {(["high", "medium", "low"] as Priority[]).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={cn(
                      "flex flex-1 items-center justify-center gap-1.5 rounded-md border px-2 py-1.5 text-xs font-medium transition-colors",
                      priority === p
                        ? p === "high"
                          ? "border-red-500/50 bg-red-500/10 text-red-500"
                          : p === "medium"
                          ? "border-amber-500/50 bg-amber-500/10 text-amber-500"
                          : "border-green-500/50 bg-green-500/10 text-green-500"
                        : "border-border bg-transparent text-muted-foreground hover:bg-muted"
                    )}
                  >
                    <span
                      className={cn(
                        "size-2 rounded-full",
                        p === "high" ? "bg-red-500" : p === "medium" ? "bg-amber-500" : "bg-green-500"
                      )}
                    />
                    {p === "high" ? "High" : p === "medium" ? "Med" : "Low"}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label>Status</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as Status)}>
                <SelectTrigger className="h-auto py-1.5 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todo">To Do</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="done">Done</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label>Due Date</Label>
            <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "h-9 justify-start text-left text-sm font-normal",
                    !dueDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="size-4" />
                  {dueDate ? format(dueDate, "PPP") : "Pick a date"}
                  {dueDate && (
                    <span
                      role="button"
                      tabIndex={0}
                      className="ml-auto"
                      onClick={(e) => {
                        e.stopPropagation()
                        setDueDate(undefined)
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.stopPropagation()
                          setDueDate(undefined)
                        }
                      }}
                    >
                      <X className="size-3.5 text-muted-foreground hover:text-foreground" />
                      <span className="sr-only">Clear date</span>
                    </span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dueDate}
                  onSelect={(d) => {
                    setDueDate(d ?? undefined)
                    setCalendarOpen(false)
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex flex-col gap-2">
            <Label>Tags</Label>
            <div className="flex flex-wrap gap-1.5">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="gap-1 pr-1">
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-0.5 rounded-full hover:bg-foreground/10"
                    aria-label={`Remove tag ${tag}`}
                  >
                    <X className="size-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Add a tag..."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    handleAddTag()
                  }
                }}
                className="h-8 text-sm"
                list="existing-tags"
              />
              <datalist id="existing-tags">
                {existingTags
                  .filter((t) => !tags.includes(t))
                  .map((t) => (
                    <option key={t} value={t} />
                  ))}
              </datalist>
              <Button type="button" variant="secondary" size="sm" className="h-8 text-xs" onClick={handleAddTag}>
                Add
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label>Attachments</Label>
            <AttachmentList
              attachments={attachments}
              onAdd={handleAddAttachment}
              onRemove={handleRemoveAttachment}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">{isEdit ? "Save Changes" : "Add Task"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
