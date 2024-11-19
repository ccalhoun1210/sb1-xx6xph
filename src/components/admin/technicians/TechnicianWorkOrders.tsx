import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search } from "lucide-react"
import { useWorkOrderStore } from "@/store/workOrderStore"

export function TechnicianWorkOrders() {
  const [searchTerm, setSearchTerm] = useState("")
  const { workOrders } = useWorkOrderStore()

  // Group work orders by technician
  const workOrdersByTechnician = workOrders.reduce((acc, wo) => {
    const techId = wo.service.assignedTechnician
    if (!acc[techId]) {
      acc[techId] = []
    }
    acc[techId].push(wo)
    return acc
  }, {} as Record<string, typeof workOrders>)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Assigned Work Orders</CardTitle>
        <div className="relative w-72">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search work orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px]">
          <div className="space-y-6">
            {Object.entries(workOrdersByTechnician).map(([techId, orders]) => (
              <div key={techId} className="space-y-4">
                <h3 className="font-medium">Technician: {techId}</h3>
                <div className="space-y-2">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div>
                        <div className="font-medium">
                          Work Order #{order.id}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Customer: {order.customer.name}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            order.status === "completed"
                              ? "default"
                              : order.status === "inProgress"
                              ? "secondary"
                              : "outline"
                          }
                        >
                          {order.status}
                        </Badge>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}