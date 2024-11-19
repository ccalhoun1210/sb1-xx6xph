import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useWorkOrderStore } from "@/store/workOrderStore"
import { Clock, CheckCircle, AlertCircle, Timer } from "lucide-react"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

interface TechnicianDashboardProps {
  technicianId: string;
}

export function TechnicianDashboard({ technicianId }: TechnicianDashboardProps) {
  const { workOrders } = useWorkOrderStore()
  const [clockedInTime, setClockedInTime] = useState<Date | null>(null)
  const [totalHoursWorked, setTotalHoursWorked] = useState(0)
  const { toast } = useToast()

  const technicianWorkOrders = workOrders.filter(
    (wo) => wo.service.assignedTechnician === technicianId
  )

  const completedOrders = technicianWorkOrders.filter(
    (wo) => wo.status === "completed"
  )

  const inProgressOrders = technicianWorkOrders.filter(
    (wo) => wo.status === "inProgress"
  )

  const pendingOrders = technicianWorkOrders.filter(
    (wo) => wo.status === "scheduled"
  )

  const handleClockInOut = () => {
    if (clockedInTime) {
      setClockedInTime(null)
      toast({
        title: "Clocked Out",
        description: "You have successfully clocked out.",
      })
    } else {
      setClockedInTime(new Date())
      toast({
        title: "Clocked In",
        description: "You have successfully clocked in.",
      })
    }
  }

  useEffect(() => {
    // In a real app, fetch the technician's clock in/out times from the server
    setTotalHoursWorked(40)
  }, [])

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clock Status</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className={`text-2xl font-bold ${clockedInTime ? "text-green-500" : "text-red-500"}`}>
                {clockedInTime ? "Clocked In" : "Clocked Out"}
              </div>
              {clockedInTime && (
                <p className="text-xs text-muted-foreground">
                  Since {format(clockedInTime, "h:mm a")}
                </p>
              )}
              <Button 
                variant={clockedInTime ? "destructive" : "default"}
                className="w-full"
                onClick={handleClockInOut}
              >
                {clockedInTime ? "Clock Out" : "Clock In"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hours This Week</CardTitle>
            <Timer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalHoursWorked}</div>
            <p className="text-xs text-muted-foreground">
              Out of 40 scheduled hours
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Orders</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedOrders.length}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {inProgressOrders.length + pendingOrders.length}
            </div>
            <p className="text-xs text-muted-foreground">
              {inProgressOrders.length} in progress
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Today's Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pendingOrders.slice(0, 3).map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="space-y-1">
                  <div className="font-medium">
                    {order.customer.name}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {order.machine.model} - {order.service.reportedIssue}
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}