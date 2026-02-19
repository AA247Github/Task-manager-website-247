"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { Attachment } from "@/lib/types"
import { ExternalLink, FileText, Trash2, Plus, Link as LinkIcon } from "lucide-react"
import { useState, useRef } from "react"
import { toast } from "sonner"

interface AttachmentListProps {
  attachments: Attachment[]
  onAdd: (attachment: Omit<Attachment, "id">) => void
  onRemove: (id: string) => void
  editable?: boolean
}

export function AttachmentList({ attachments, onAdd, onRemove, editable = true }: AttachmentListProps) {
  const [showLinkInput, setShowLinkInput] = useState(false)
  const [linkName, setLinkName] = useState("")
  const [linkUrl, setLinkUrl] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  function handleAddLink() {
    if (!linkUrl.trim()) {
      toast.error("Please enter a URL")
      return
    }
    const name = linkName.trim() || linkUrl.trim()
    let url = linkUrl.trim()
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      url = "https://" + url
    }
    onAdd({ type: "link", name, url })
    setLinkName("")
    setLinkUrl("")
    setShowLinkInput(false)
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 1024 * 1024) {
      toast.warning("File is larger than 1MB. This may cause storage issues.")
    }

    const reader = new FileReader()
    reader.onload = () => {
      onAdd({
        type: "file",
        name: file.name,
        url: reader.result as string,
        fileSize: file.size,
      })
    }
    reader.readAsDataURL(file)

    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  function formatFileSize(bytes?: number) {
    if (!bytes) return ""
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <div className="flex flex-col gap-2">
      {attachments.length > 0 && (
        <ul className="flex flex-col gap-1.5">
          {attachments.map((att) => (
            <li key={att.id} className="group flex items-center gap-2 rounded-md border border-border bg-muted/50 px-3 py-2 text-sm">
              {att.type === "link" ? (
                <LinkIcon className="size-3.5 shrink-0 text-muted-foreground" />
              ) : (
                <FileText className="size-3.5 shrink-0 text-muted-foreground" />
              )}
              {att.type === "link" ? (
                <a
                  href={att.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex min-w-0 items-center gap-1 truncate text-foreground hover:underline"
                >
                  <span className="truncate">{att.name}</span>
                  <ExternalLink className="size-3 shrink-0 text-muted-foreground" />
                </a>
              ) : (
                <a
                  href={att.url}
                  download={att.name}
                  className="flex min-w-0 items-center gap-1 truncate text-foreground hover:underline"
                >
                  <span className="truncate">{att.name}</span>
                  {att.fileSize && (
                    <span className="shrink-0 text-xs text-muted-foreground">({formatFileSize(att.fileSize)})</span>
                  )}
                </a>
              )}
              {editable && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-auto size-6 shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
                  onClick={() => onRemove(att.id)}
                >
                  <Trash2 className="size-3 text-muted-foreground" />
                  <span className="sr-only">Remove attachment</span>
                </Button>
              )}
            </li>
          ))}
        </ul>
      )}

      {editable && (
        <>
          {showLinkInput && (
            <div className="flex flex-col gap-2 rounded-md border border-border bg-muted/30 p-3">
              <Input
                placeholder="Link name (optional)"
                value={linkName}
                onChange={(e) => setLinkName(e.target.value)}
                className="h-8 text-sm"
              />
              <Input
                placeholder="https://example.com"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAddLink()
                  if (e.key === "Escape") setShowLinkInput(false)
                }}
                className="h-8 text-sm"
              />
              <div className="flex gap-2">
                <Button size="sm" variant="secondary" className="h-7 text-xs" onClick={handleAddLink}>
                  Add Link
                </Button>
                <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => setShowLinkInput(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-7 gap-1 text-xs"
              onClick={() => setShowLinkInput(true)}
            >
              <LinkIcon className="size-3" />
              Add Link
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-7 gap-1 text-xs"
              onClick={() => fileInputRef.current?.click()}
            >
              <Plus className="size-3" />
              Attach File
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={handleFileChange}
              aria-label="Attach a file"
            />
          </div>
        </>
      )}
    </div>
  )
}
