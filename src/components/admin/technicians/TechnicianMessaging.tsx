import { useState } from "react"
import { Card } from "@/components/ui/card"
import { ConversationList } from "@/components/chat/ConversationList"
import { ChatWindow } from "@/components/chat/ChatWindow"
import { useMessageStore } from "@/store/messageStore"

export function TechnicianMessaging() {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const { conversations } = useMessageStore()

  // Filter only technician conversations
  const technicianConversations = conversations.filter(
    conv => conv.participants.some(p => p.role === 'technician')
  )

  return (
    <div className="grid grid-cols-[300px_1fr] gap-6 h-[700px]">
      <ConversationList
        conversations={technicianConversations}
        selectedId={selectedConversation || undefined}
        onSelect={setSelectedConversation}
      />
      {selectedConversation ? (
        <ChatWindow conversationId={selectedConversation} />
      ) : (
        <Card className="flex items-center justify-center text-muted-foreground">
          Select a conversation to start messaging
        </Card>
      )}
    </div>
  )
}