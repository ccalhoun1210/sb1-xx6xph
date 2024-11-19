import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TechnicianDashboard } from "@/components/technician/TechnicianDashboard"
import { TechnicianSchedule } from "@/components/technician/TechnicianSchedule"
import { TechnicianWorkOrders } from "@/components/technician/TechnicianWorkOrders"
import { TechnicianProfile } from "@/components/technician/TechnicianProfile"
import { TechnicianTraining } from "@/components/technician/TechnicianTraining"
import { useAuth } from "@/hooks/useAuth"

export default function TechnicianPortal() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("dashboard")

  if (!user) return null

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Technician Portal</h2>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="workorders">Work Orders</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="training">Training & Updates</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <TechnicianDashboard technicianId={user.id} />
        </TabsContent>

        <TabsContent value="schedule">
          <TechnicianSchedule technicianId={user.id} />
        </TabsContent>

        <TabsContent value="workorders">
          <TechnicianWorkOrders technicianId={user.id} />
        </TabsContent>

        <TabsContent value="profile">
          <TechnicianProfile technicianId={user.id} />
        </TabsContent>

        <TabsContent value="training">
          <TechnicianTraining technicianId={user.id} />
        </TabsContent>
      </Tabs>
    </div>
  )
}