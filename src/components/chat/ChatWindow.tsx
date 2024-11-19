import { useEffect } from "react"
import { Card } from "@/components/ui/card"
import { MessageList } from "./MessageList"
import { MessageComposer } from "./MessageComposer"
import { useMessageStore } from "@/store/messageStore"

interface ChatWindowProps {
  conversationId: string;
  className?: string;
}

export function ChatWindow({ conversationId, className }: ChatWindowProps) {
  const { getConversation, markAsRead } = useMessageStore()
  const conversation = getConversation(conversationId)

  useEffect(() => {
    if (conversationId) {
      markAsRead(conversationId)
    }
  }, [conversationId, markAsRead])

  if (!conversation) return null

  const otherParticipant = conversation.participants[1]

  return (
    <Card className={className}>
      <div className="flex flex-col h-full">
        <div className="p-4 border-b">
          <h3 className="font-semibold">
            {otherParticipant?.name || "Unknown"}
          </h3>
          {conversation.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {conversation.tags.map((tag) => (
                <Badge
                  key={`${tag.type}-${tag.value}`}
                  variant={
                    tag.type === 'urgent'
                      ? 'destructive'
                      : tag.type === 'work-order'
                      ? 'default'
                      : 'secondary'
                  }
                >
                  {tag.label}
                </Badge>
              ))}
            </div>
          )}
        </div>

        <MessageList
          messages={conversation.messages}
          className="flex-1"
        />

        <MessageComposer
          recipientId={otherParticipant?.id}
          workOrderId={conversation.workOrderId}
        />
      </div>
    </Card>
  )
}