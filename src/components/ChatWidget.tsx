import { useState, useEffect, useRef } from "react"
import { MessageSquare, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card } from "@/components/ui/card"
import { Toggle } from "@/components/ui/toggle"
import { useChatStore } from "@/store/chatStore"
import { useSocket } from "@/hooks/useSocket"
import { useToast } from "@/hooks/use-toast"

interface ChatWidgetProps {
  workOrderId: string;
  customerPhone?: string;
  customerName?: string;
}

export function ChatWidget({ workOrderId, customerPhone, customerName }: ChatWidgetProps) {
  const [newMessage, setNewMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()
  const { conversations, addMessage, createConversation, getConversation, updateLastActivity } = useChatStore()
  const { isConnected, sendMessage, sendTypingIndicator } = useSocket()
  const [currentConversation, setCurrentConversation] = useState(getConversation(workOrderId))

  useEffect(() => {
    if (!currentConversation) {
      const id = createConversation(workOrderId)
      setCurrentConversation(getConversation(id))
    }
  }, [workOrderId, currentConversation, createConversation, getConversation])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [currentConversation?.messages])

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !isConnected) {
      toast({
        title: "Error",
        description: isConnected ? "Message cannot be empty" : "Not connected to chat",
        variant: "destructive",
      })
      return
    }

    try {
      await sendMessage(workOrderId, newMessage)
      setNewMessage("")
      updateLastActivity(workOrderId)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      })
    }
  }

  const handleTyping = () => {
    if (!isConnected) return
    sendTypingIndicator(workOrderId)
  }

  if (!currentConversation) return null

  return (
    <Card className="w-full h-[400px] flex flex-col">
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4">
          {currentConversation.messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === "technician" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`rounded-lg px-4 py-2 max-w-[300px] ${
                  message.sender === "technician"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                <p className="text-sm">{message.text}</p>
                <span className="text-xs opacity-70">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </span>
              </div>
            </div>
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
      <div className="p-4 border-t">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSendMessage()
          }}
          className="flex gap-2"
        >
          <Input
            value={newMessage}
            onChange={(e) => {
              setNewMessage(e.target.value)
              handleTyping()
            }}
            placeholder="Type a message..."
            className="flex-1"
            disabled={!isConnected}
          />
          <Button type="submit" size="icon" disabled={!isConnected}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </Card>
  )
}