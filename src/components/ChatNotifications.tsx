import { useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { useChatStore } from "@/store/chatStore"
import { useWorkOrderStore } from "@/store/workOrderStore"

export function ChatNotifications() {
  const { conversations } = useChatStore()
  const { workOrders } = useWorkOrderStore()
  const { toast } = useToast()

  useEffect(() => {
    const totalUnread = conversations.reduce((sum, conv) => sum + conv.unreadCount, 0)
    
    if (totalUnread > 0) {
      const unreadConvs = conversations.filter(conv => conv.unreadCount > 0)
      const workOrderDetails = unreadConvs.map(conv => {
        const workOrder = workOrders.find(wo => wo.id === conv.workOrderId)
        return workOrder ? `WO #${workOrder.id} (${conv.unreadCount})` : null
      }).filter(Boolean)

      toast({
        title: `${totalUnread} Unread Messages`,
        description: workOrderDetails.join(", "),
        duration: 5000,
      })
    }
  }, [conversations])

  return null
}