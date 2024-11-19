import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useWorkOrderStore } from "@/store/workOrderStore"
import { format } from "date-fns"

interface TechnicianScheduleProps {
  technicianId: string;
}

export function TechnicianSchedule({ technicianId }: TechnicianScheduleProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const { workOrders } = useWorkOrderStore()

  const technicianWorkOrders = workOrders.filter(
    (wo) => wo.service.assignedTechnician === technicianId
  )

  const getDayAppointments = (date: Date) => {
    return technicianWorkOrders.filter(
      (wo) => format(new Date(wo.createdAt), "yyyy-MM-dd") === format(date, "yyyy-MM-dd")
    )
  }

  const selectedDayAppointments = getDayAppointments(selectedDate)

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
            Appointments for {format(selectedDate, "MMMM d, yyyy")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[500px] pr-4">
            {selectedDayAppointments.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                No appointments scheduled for this day
              </p>
            ) : (
              <div className="space-y-4">
                {selectedDayAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="space-y-1">
                      <div className="font-medium">
                        {appointment.customer.name}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {appointment.machine.model} - {appointment.machine.serialNumber}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {appointment.service.reportedIssue}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          appointment.status === "completed"
                            ? "default"
                            : appointment.status === "inProgress"
                            ? "secondary"
                            : "outline"
                        }
                      >
                        {appointment.status}
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
        </CardContent>
      </Card>
    </div>
  )
}