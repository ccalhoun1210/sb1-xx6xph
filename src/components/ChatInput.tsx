import { useState, useRef, useEffect } from "react"
import { Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useSocket } from "@/hooks/useSocket"

interface ChatInputProps {
  workOrderId: string;
  onSend: (message: string) => void;
  onTyping?: () => void;
  placeholder?: string;
  disabled?: boolean;
}

export function ChatInput({ 
  workOrderId, 
  onSend, 
  onTyping,
  placeholder = "Type a message...", 
  disabled 
}: ChatInputProps) {
  const [message, setMessage] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout>()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim() && !disabled) {
      onSend(message.trim())
      setMessage("")
      inputRef.current?.focus()
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value)
    
    if (onTyping) {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
      onTyping()
      typingTimeoutRef.current = setTimeout(() => {
        // Typing stopped
      }, 1000)
    }
  }

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
    }
  }, [])

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 p-4 border-t">
      <Input
        ref={inputRef}
        value={message}
        onChange={handleChange}
        placeholder={placeholder}
        className="flex-1"
        disabled={disabled}
      />
      <Button 
        type="submit" 
        size="icon"
        className="shrink-0"
        disabled={!message.trim() || disabled}
      >
        <Send className="h-4 w-4" />
      </Button>
    </form>
  )
}