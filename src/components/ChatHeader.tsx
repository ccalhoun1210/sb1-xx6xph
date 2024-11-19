import { Badge } from "@/components/ui/badge"
import { WorkOrder } from "@/types/workOrder"

interface ChatHeaderProps {
  workOrder: WorkOrder;
  unreadCount?: number;
}

export function ChatHeader({ workOrder, unreadCount }: ChatHeaderProps) {
  return (
    <div className="p-4 border-b">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold flex items-center gap-2">
            Work Order #{workOrder.id}
            {unreadCount ? (
              <Badge variant="destructive" className="ml-2">
                {unreadCount} unread
              </Badge>
            ) : null}
          </h3>
          <p className="text-sm text-muted-foreground">
            {workOrder.customer.name}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="outline">
              Status: {workOrder.status}
            </Badge>
            <Badge variant="outline">
              Tech: {workOrder.service.assignedTechnician}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  )
}