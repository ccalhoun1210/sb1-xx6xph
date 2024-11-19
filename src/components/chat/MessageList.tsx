import { useEffect, useRef } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { Message } from "@/types/message"
import { useAuth } from "@/hooks/useAuth"

interface MessageListProps {
  messages: Message[];
  className?: string;
}

export function MessageList({ messages, className }: MessageListProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const { user } = useAuth()

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  return (
    <ScrollArea
      ref={scrollRef}
      className={cn("flex-1 p-4", className)}
    >
      <div className="space-y-4">
        {messages.map((message) => {
          const isOwn = message.senderId === user?.id

          return (
            <div
              key={message.id}
              className={cn(
                "flex items-start gap-2",
                isOwn && "flex-row-reverse"
              )}
            >
              <Avatar className="w-8 h-8">
                <AvatarFallback>
                  {message.senderName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className={cn("flex flex-col gap-1", isOwn && "items-end")}>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">
                    {message.senderName}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(message.timestamp), "h:mm a")}
                  </span>
                </div>

                {message.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {message.tags.map((tag) => (
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

                <div
                  className={cn(
                    "rounded-lg px-4 py-2 max-w-[300px]",
                    isOwn
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  )}
                >
                  <p className="text-sm whitespace-pre-wrap break-words">
                    {message.content}
                  </p>
                </div>

                {message.attachments?.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {message.attachments.map((attachment) => (
                      <a
                        key={attachment.id}
                        href={attachment.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline"
                      >
                        {attachment.name}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </ScrollArea>
  )
}