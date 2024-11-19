import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RevenueChart } from "./RevenueChart"
import { WorkOrderStats } from "./WorkOrderStats"
import { TechnicianPerformance } from "./TechnicianPerformance"
import { CustomerSatisfaction } from "./CustomerSatisfaction"
import { InventoryAnalytics } from "./InventoryAnalytics"
import { useWorkOrderStore } from "@/store/workOrderStore"
import { useInventoryStore } from "@/store/inventoryStore"
import { DateRangePicker } from "./DateRangePicker"
import { useState } from "react"
import { addDays, startOfMonth, endOfMonth } from "date-fns"

export function AnalyticsDashboard() {
  const [dateRange, setDateRange] = useState({
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date()),
  })

  const { workOrders } = useWorkOrderStore()
  const { items } = useInventoryStore()

  const filteredWorkOrders = workOrders.filter(wo => {
    const date = new Date(wo.createdAt)
    return date >= dateRange.from && date <= dateRange.to
  })

  const totalRevenue = filteredWorkOrders.reduce((sum, wo) => {
    const partsTotal = wo.service.selectedParts.reduce(
      (total, part) => total + part.price * part.quantity,
      0
    )
    const laborTotal = wo.service.laborTime * wo.service.laborRate
    return sum + partsTotal + laborTotal
  }, 0)

  const averageTicket = totalRevenue / (filteredWorkOrders.length || 1)

  const completionRate = (
    (filteredWorkOrders.filter(wo => wo.status === "completed").length /
      (filteredWorkOrders.length || 1)) *
    100
  ).toFixed(1)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Analytics & Reports</h2>
        <DateRangePicker
          from={dateRange.from}
          to={dateRange.to}
          onSelect={({ from, to }) => setDateRange({ from, to })}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Ticket</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${averageTicket.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Work Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredWorkOrders.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completionRate}%</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="workOrders">Work Orders</TabsTrigger>
          <TabsTrigger value="technicians">Technicians</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="satisfaction">Customer Satisfaction</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid gap-4 md:grid-cols-2">
            <RevenueChart workOrders={filteredWorkOrders} dateRange={dateRange} />
            <WorkOrderStats workOrders={filteredWorkOrders} />
          </div>
        </TabsContent>

        <TabsContent value="revenue">
          <RevenueChart workOrders={filteredWorkOrders} dateRange={dateRange} />
        </TabsContent>

        <TabsContent value="workOrders">
          <WorkOrderStats workOrders={filteredWorkOrders} />
        </TabsContent>

        <TabsContent value="technicians">
          <TechnicianPerformance workOrders={filteredWorkOrders} />
        </TabsContent>

        <TabsContent value="inventory">
          <InventoryAnalytics items={items} workOrders={filteredWorkOrders} />
        </TabsContent>

        <TabsContent value="satisfaction">
          <CustomerSatisfaction workOrders={filteredWorkOrders} />
        </TabsContent>
      </Tabs>
    </div>
  )
}