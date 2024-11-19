import { useState } from "react"
import { Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { sendSMS } from "@/lib/sms"
import { useToast } from "@/hooks/use-toast"

interface SMSDialogProps {
  customerPhone: string;
  customerName: string;
}

export function SMSDialog({ customerPhone, customerName }: SMSDialogProps) {
  const [message, setMessage] = useState("")
  const [isSending, setIsSending] = useState(false)
  const { toast } = useToast()

  const handleSendSMS = async () => {
    if (!message.trim()) return

    setIsSending(true)
    try {
      await sendSMS(customerPhone, message)
      toast({
        title: "SMS Sent",
        description: `Message sent to ${customerName}`,
      })
      setMessage("")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send SMS. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSending(false)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Send className="mr-2 h-4 w-4" />
          Send SMS
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Send SMS to {customerName}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="min-h-[100px]"
          />
          <Button
            onClick={handleSendSMS}
            disabled={isSending || !message.trim()}
            className="w-full"
          >
            {isSending ? "Sending..." : "Send Message"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}