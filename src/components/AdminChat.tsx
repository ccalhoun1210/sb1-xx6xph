import { useState, useEffect, useRef } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useChatStore } from "@/store/chatStore"
import { useWorkOrderStore } from "@/store/workOrderStore"
import { ChatInput } from "./ChatInput"
import { ChatMessage } from "./ChatMessage"
import { ChatHeader } from "./ChatHeader"
import { useSocket } from "@/hooks/useSocket"
import { useToast } from "@/hooks/use-toast"

interface AdminChatProps {
  conversationId: string;
}

export function AdminChat({ conversationId }: AdminChatProps) {
  const [isTyping, setIsTyping] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const { getConversation, addMessage, markAsRead, updateLastActivity } = useChatStore()
  const { getWorkOrder } = useWorkOrderStore()
  const { sendMessage, sendTypingIndicator, isConnected } = useSocket()
  const { toast } = useToast()
  
  const conversation = getConversation(conversationId)
  const workOrder = conversation ? getWorkOrder(conversation.workOrderId) : null

  useEffect(() => {
    if (conversationId) {
      markAsRead(conversationId)
    }
  }, [conversationId, markAsRead])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [conversation?.messages])

  const handleSendMessage = async (text: string) => {
    if (!workOrder || !isConnected) {
      toast({
        title: "Error",
        description: "Cannot send message. Please check your connection.",
        variant: "destructive",
      })
      return
    }

    try {
      const message = {
        id: Date.now().toString(),
        text,
        sender: "admin",
        timestamp: new Date(),
        workOrderId: workOrder.id,
        technicianId: workOrder.service.assignedTechnician,
      }

      await sendMessage(workOrder.id, text)
      addMessage(workOrder.id, message)
      updateLastActivity(workOrder.id)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleTyping = () => {
    if (!workOrder || !isConnected) return
    
    sendTypingIndicator(workOrder.id)
    setIsTyping(true)
    setTimeout(() => setIsTyping(false), 1000)
  }

  if (!conversation || !workOrder) {
    return (
      <div className="h-[600px] flex items-center justify-center text-muted-foreground">
        Select a conversation to view messages
      </div>
    )
  }

  return (
    <div className="flex flex-col h-[600px]">
      <ChatHeader workOrder={workOrder} unreadCount={conversation.unreadCount} />

      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4">
          {conversation.messages.map((message) => (
            <ChatMessage
              key={message.id}
              message={message}
              isOwn={message.sender === "admin"}
            />
          ))}
          {isTyping && (
            <div className="flex items-center gap-2">
              <div className="bg-muted rounded-lg px-4 py-2">
                <span className="text-sm">Typing...</span>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <ChatInput 
        workOrderId={workOrder.id}
        onSend={handleSendMessage}
        onTyping={handleTyping}
        disabled={!isConnected}
      />
    </div>
  )
}