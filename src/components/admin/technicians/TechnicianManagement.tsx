import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TechnicianList } from "./TechnicianList"
import { TechnicianMessaging } from "../messaging/TechnicianMessaging"
import { TechnicianScheduling } from "./TechnicianScheduling"
import { TechnicianPayroll } from "./TechnicianPayroll"
import { TechnicianTraining } from "./TechnicianTraining"
import { TechnicianWorkOrders } from "./TechnicianWorkOrders"
import { TechnicianPerformance } from "@/components/analytics/TechnicianPerformance"

export function TechnicianManagement() {
  const [activeTab, setActiveTab] = useState("technicians")

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="grid grid-cols-7">
        <TabsTrigger value="technicians">Technicians</TabsTrigger>
        <TabsTrigger value="messaging">Messaging</TabsTrigger>
        <TabsTrigger value="scheduling">Scheduling</TabsTrigger>
        <TabsTrigger value="payroll">Payroll</TabsTrigger>
        <TabsTrigger value="training">Training</TabsTrigger>
        <TabsTrigger value="workorders">Work Orders</TabsTrigger>
        <TabsTrigger value="performance">Performance</TabsTrigger>
      </TabsList>

      <TabsContent value="technicians" className="mt-6">
        <TechnicianList />
      </TabsContent>

      <TabsContent value="messaging" className="mt-6">
        <TechnicianMessaging />
      </TabsContent>

      <TabsContent value="scheduling" className="mt-6">
        <TechnicianScheduling />
      </TabsContent>

      <TabsContent value="payroll" className="mt-6">
        <TechnicianPayroll />
      </TabsContent>

      <TabsContent value="training" className="mt-6">
        <TechnicianTraining />
      </TabsContent>

      <TabsContent value="workorders" className="mt-6">
        <TechnicianWorkOrders />
      </TabsContent>

      <TabsContent value="performance" className="mt-6">
        <TechnicianPerformance workOrders={[]} />
      </TabsContent>
    </Tabs>
  )
}