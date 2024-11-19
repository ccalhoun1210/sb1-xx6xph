import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { format } from "date-fns"

export function TechnicianScheduling() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())

  const schedules = [
    {
      technicianId: "1",
      name: "John Doe",
      workOrders: [
        {
          id: "WO-001",
          time: "09:00 AM",
          customer: "Alice Johnson",
          status: "scheduled",
        },
        {
          id: "WO-002",
          time: "02:00 PM",
          customer: "Bob Smith",
          status: "in-progress",
        },
      ],
    },
    {
      technicianId: "2",
      name: "Jane Smith",
      workOrders: [
        {
          id: "WO-003",
          time: "10:30 AM",
          customer: "Charlie Brown",
          status: "scheduled",
        },
      ],
    },
  ]

  return (
    <div className="grid gap-6 md:grid-cols-[400px_1fr]">
      <Card>
        <CardHeader>
          <CardTitle>Calendar</CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => date && setSelectedDate(date)}
            className="rounded-md border"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            Schedule for {format(selectedDate, "MMMM d, yyyy")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px] pr-4">
            <div className="space-y-8">
              {schedules.map((schedule) => (
                <div key={schedule.technicianId}>
                  <h3 className="font-medium mb-4">{schedule.name}</h3>
                  <div className="space-y-4">
                    {schedule.workOrders.map((workOrder) => (
                      <div
                        key={workOrder.id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="space-y-1">
                          <div className="font-medium">
                            {workOrder.time} - {workOrder.customer}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Work Order #{workOrder.id}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={
                              workOrder.status === "in-progress"
                                ? "secondary"
                                : "outline"
                            }
                          >
                            {workOrder.status}
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
    </div>
  )
}