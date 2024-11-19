import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Tag, Send, Plus, X } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { useMessageStore } from "@/store/messageStore"
import { MessageTag } from "@/types/message"

interface MessageComposerProps {
  recipientId?: string;
  workOrderId?: string;
  onSend?: () => void;
}

export function MessageComposer({ recipientId, workOrderId, onSend }: MessageComposerProps) {
  const [message, setMessage] = useState("")
  const [selectedTags, setSelectedTags] = useState<MessageTag[]>([])
  const { user } = useAuth()
  const { sendMessage } = useMessageStore()

  const availableTags = [
    { type: 'work-order', label: 'Work Order', value: workOrderId || '' },
    { type: 'training', label: 'Training', value: 'training' },
    { type: 'urgent', label: 'Urgent', value: 'urgent' },
    { type: 'general', label: 'General', value: 'general' },
    { type: 'payroll', label: 'Payroll', value: 'payroll' },
  ]

  const handleAddTag = (tag: MessageTag) => {
    if (!selectedTags.some((t) => t.type === tag.type && t.value === tag.value)) {
      setSelectedTags([...selectedTags, tag])
    }
  }

  const handleRemoveTag = (tag: MessageTag) => {
    setSelectedTags(selectedTags.filter(
      (t) => !(t.type === tag.type && t.value === tag.value)
    ))
  }

  const handleSend = () => {
    if (!message.trim() || !user) return

    sendMessage({
      senderId: user.id,
      senderName: user.name,
      senderRole: user.role as 'admin' | 'technician',
      recipientId,
      content: message,
      tags: selectedTags,
      workOrderId,
      readStatus: false,
    })

    setMessage("")
    setSelectedTags([])
    onSend?.()
  }

  return (
    <div className="space-y-4 p-4 border-t">
      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedTags.map((tag) => (
            <Badge
              key={`${tag.type}-${tag.value}`}
              variant="secondary"
              className="flex items-center gap-1"
            >
              {tag.label}
              <button
                onClick={() => handleRemoveTag(tag)}
                className="ml-1 hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      <div className="flex items-end gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="icon">
              <Tag className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48">
            <div className="space-y-2">
              {availableTags.map((tag) => (
                <Button
                  key={`${tag.type}-${tag.value}`}
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => handleAddTag({
                    id: Date.now().toString(),
                    ...tag
                  })}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  {tag.label}
                </Button>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1"
          rows={3}
        />

        <Button onClick={handleSend} disabled={!message.trim()}>
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}