import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useWorkOrderStore } from "@/store/workOrderStore"
import { format } from "date-fns"

interface TechnicianWorkOrdersProps {
  technicianId: string
}

export function TechnicianWorkOrders({ technicianId }: TechnicianWorkOrdersProps) {
  const [activeTab, setActiveTab] = useState("in-progress")
  const { workOrders } = useWorkOrderStore()

  const technicianWorkOrders = workOrders.filter(
    (wo) => wo.service.assignedTechnician === technicianId
  )

  const inProgressOrders = technicianWorkOrders.filter(
    (wo) => wo.status === "inProgress"
  )

  const pendingOrders = technicianWorkOrders.filter(
    (wo) => wo.status === "scheduled"
  )

  const completedOrders = technicianWorkOrders.filter(
    (wo) => wo.status === "completed"
  )

  const renderWorkOrderList = (orders: typeof workOrders) => (
    <ScrollArea className="h-[600px] pr-4">
      {orders.length === 0 ? (
        <p className="text-muted-foreground text-center py-4">
          No work orders found
        </p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div className="space-y-1">
                <div className="font-medium">Work Order #{order.id}</div>
                <div className="text-sm text-muted-foreground">
                  Customer: {order.customer.name}
                </div>
                <div className="text-sm text-muted-foreground">
                  Machine: {order.machine.model} ({order.machine.serialNumber})
                </div>
                <div className="text-sm text-muted-foreground">
                  Created: {format(new Date(order.createdAt), "PPp")}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant={
                    order.priority === "high"
                      ? "destructive"
                      : order.priority === "medium"
                      ? "secondary"
                      : "outline"
                  }
                >
                  {order.priority}
                </Badge>
                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </ScrollArea>
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Work Orders</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="in-progress">
              In Progress ({inProgressOrders.length})
            </TabsTrigger>
            <TabsTrigger value="pending">
              Pending ({pendingOrders.length})
            </TabsTrigger>
            <TabsTrigger value="completed">
              Completed ({completedOrders.length})
            </TabsTrigger>
          </TabsList>
          <TabsContent value="in-progress">
            {renderWorkOrderList(inProgressOrders)}
          </TabsContent>
          <TabsContent value="pending">
            {renderWorkOrderList(pendingOrders)}
          </TabsContent>
          <TabsContent value="completed">
            {renderWorkOrderList(completedOrders)}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}