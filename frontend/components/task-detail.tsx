"use client"

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { PriorityBadge } from "@/components/priority-badge"
import { StatusBadge } from "@/components/status-badge"
import { AttachmentList } from "@/components/attachment-list"
import type { Task, Attachment } from "@/lib/types"
import { Calendar, Clock, Pencil, Trash2 } from "lucide-react"
import { format } from "date-fns"

interface TaskDetailProps {
  task: Task | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
  onAddAttachment: (taskId: string, attachment: Omit<Attachment, "id">) => void
  onRemoveAttachment: (taskId: string, attachmentId: string) => void
}

export function TaskDetail({
  task,
  open,
  onOpenChange,
  onEdit,
  onDelete,
  onAddAttachment,
  onRemoveAttachment,
}: TaskDetailProps) {
  if (!task) return null

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="text-left text-lg">{task.title}</SheetTitle>
          <SheetDescription className="sr-only">Details for task: {task.title}</SheetDescription>
        </SheetHeader>

        <div className="flex flex-1 flex-col gap-5 px-4">
          <div className="flex flex-wrap items-center gap-2">
            <PriorityBadge priority={task.priority} />
            <StatusBadge status={task.status} />
          </div>

          {task.description && (
            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Description</span>
              <p className="text-sm leading-relaxed text-foreground whitespace-pre-wrap">{task.description}</p>
            </div>
          )}

          <Separator />

          <div className="grid grid-cols-2 gap-4">
            {task.dueDate && (
              <div className="flex flex-col gap-1">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Due Date</span>
                <span className="flex items-center gap-1.5 text-sm text-foreground">
                  <Calendar className="size-3.5 text-muted-foreground" />
                  {format(new Date(task.dueDate), "PPP")}
                </span>
              </div>
            )}
            <div className="flex flex-col gap-1">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Created</span>
              <span className="flex items-center gap-1.5 text-sm text-foreground">
                <Clock className="size-3.5 text-muted-foreground" />
                {format(new Date(task.createdAt), "PPP")}
              </span>
            </div>
          </div>

          {task.tags.length > 0 && (
            <>
              <Separator />
              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Tags</span>
                <div className="flex flex-wrap gap-1.5">
                  {task.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">{tag}</Badge>
                  ))}
                </div>
              </div>
            </>
          )}

          <Separator />

          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Attachments ({task.attachments.length})
            </span>
            <AttachmentList
              attachments={task.attachments}
              onAdd={(att) => onAddAttachment(task.id, att)}
              onRemove={(attId) => onRemoveAttachment(task.id, attId)}
            />
          </div>
        </div>

        <SheetFooter className="flex-row gap-2 border-t border-border pt-4">
          <Button
            variant="outline"
            className="flex-1 gap-1.5"
            onClick={() => {
              onOpenChange(false)
              setTimeout(() => onEdit(task), 200)
            }}
          >
            <Pencil className="size-3.5" />
            Edit
          </Button>
          <Button
            variant="outline"
            className="flex-1 gap-1.5 text-red-500 hover:bg-red-500/10 hover:text-red-500"
            onClick={() => {
              onDelete(task.id)
              onOpenChange(false)
            }}
          >
            <Trash2 className="size-3.5" />
            Delete
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
