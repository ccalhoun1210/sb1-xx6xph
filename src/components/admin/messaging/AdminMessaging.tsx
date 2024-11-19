import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CustomerMessaging } from "./CustomerMessaging"
import { TechnicianMessaging } from "./TechnicianMessaging"

export function AdminMessaging() {
  const [activeTab, setActiveTab] = useState("customers")

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="grid grid-cols-2">
        <TabsTrigger value="customers">Customer Messaging</TabsTrigger>
        <TabsTrigger value="technicians">Technician Messaging</TabsTrigger>
      </TabsList>

      <TabsContent value="customers" className="mt-6">
        <CustomerMessaging />
      </TabsContent>

      <TabsContent value="technicians" className="mt-6">
        <TechnicianMessaging />
      </TabsContent>
    </Tabs>
  )
}