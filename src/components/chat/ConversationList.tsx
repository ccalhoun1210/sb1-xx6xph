import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { Conversation } from "@/types/message"
import { useAuth } from "@/hooks/useAuth"

interface ConversationListProps {
  conversations: Conversation[];
  selectedId?: string;
  onSelect: (id: string) => void;
  className?: string;
}

export function ConversationList({
  conversations,
  selectedId,
  onSelect,
  className,
}: ConversationListProps) {
  const { user } = useAuth()

  return (
    <div className={cn("flex flex-col h-full", className)}>
      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search messages..." className="pl-8" />
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="space-y-2 p-2">
          {conversations.map((conversation) => {
            const otherParticipant = conversation.participants.find(
              (p) => p.id !== user?.id
            )

            return (
              <Button
                key={conversation.id}
                variant="ghost"
                className={cn(
                  "w-full justify-start px-2",
                  selectedId === conversation.id && "bg-accent"
                )}
                onClick={() => onSelect(conversation.id)}
              >
                <div className="flex flex-col items-start w-full">
                  <div className="flex items-center justify-between w-full">
                    <span className="font-medium">
                      {otherParticipant?.name || "Unknown"}
                    </span>
                    {conversation.unreadCount > 0 && (
                      <Badge variant="destructive">
                        {conversation.unreadCount}
                      </Badge>
                    )}
                  </div>

                  {conversation.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
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
                          className="text-xs"
                        >
                          {tag.label}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {conversation.lastMessage && (
                    <div className="mt-1 text-sm text-muted-foreground truncate w-full">
                      {conversation.lastMessage.content}
                    </div>
                  )}

                  <div className="mt-1 text-xs text-muted-foreground">
                    {format(new Date(conversation.updatedAt), "MMM d, h:mm a")}
                  </div>
                </div>
              </Button>
            )
          })}
        </div>
      </ScrollArea>
    </div>
  )
}