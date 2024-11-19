import { format } from "date-fns"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { FileText, Image as ImageIcon } from "lucide-react"

interface ChatMessageProps {
  message: {
    id: string;
    text: string;
    sender: string;
    timestamp: Date;
  };
  isOwn?: boolean;
}

export function ChatMessage({ message, isOwn }: ChatMessageProps) {
  const isFileMessage = message.text.startsWith('[File]')
  const isImageMessage = isFileMessage && 
    message.text.match(/\.(jpg|jpeg|png|gif|webp)$/i)
  
  const fileUrl = isFileMessage ? message.text.replace('[File] ', '') : ''

  return (
    <div
      className={cn(
        "flex items-start gap-2",
        isOwn && "flex-row-reverse"
      )}
    >
      <Avatar className="w-8 h-8">
        <AvatarFallback>
          {message.sender === "technician" ? "T" : 
           message.sender === "admin" ? "A" : "C"}
        </AvatarFallback>
      </Avatar>

      <div className="flex flex-col gap-1">
        {isFileMessage ? (
          <a
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "flex items-center gap-2 rounded-lg px-4 py-2",
              isOwn ? "bg-primary text-primary-foreground" : "bg-muted"
            )}
          >
            {isImageMessage ? (
              <>
                <ImageIcon className="h-4 w-4" />
                <img 
                  src={fileUrl} 
                  alt="Uploaded" 
                  className="max-w-[200px] max-h-[200px] rounded"
                />
              </>
            ) : (
              <>
                <FileText className="h-4 w-4" />
                <span className="text-sm">View File</span>
              </>
            )}
          </a>
        ) : (
          <div
            className={cn(
              "rounded-lg px-4 py-2 max-w-[300px]",
              isOwn ? "bg-primary text-primary-foreground" : "bg-muted"
            )}
          >
            <p className="text-sm whitespace-pre-wrap break-words">
              {message.text}
            </p>
          </div>
        )}
        <span className="text-xs text-muted-foreground">
          {format(new Date(message.timestamp), "h:mm a")}
        </span>
      </div>
    </div>
  )
}