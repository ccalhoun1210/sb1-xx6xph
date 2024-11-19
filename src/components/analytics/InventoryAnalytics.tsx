import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { WorkOrder } from "@/types/workOrder"

interface InventoryAnalyticsProps {
  items: any[]
  workOrders: WorkOrder[]
}

export function InventoryAnalytics({ items, workOrders }: InventoryAnalyticsProps) {
  const partUsage = workOrders.reduce((acc, wo) => {
    wo.service.selectedParts.forEach((part) => {
      if (!acc[part.id]) {
        acc[part.id] = {
          name: part.name,
          used: 0,
          revenue: 0,
        }
      }
      acc[part.id].used += part.quantity
      acc[part.id].revenue += part.price * part.quantity
    })
    return acc
  }, {} as Record<string, any>)

  const data = Object.values(partUsage)
    .sort((a, b) => b.used - a.used)
    .slice(0, 10)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Parts Usage & Revenue</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Bar
              yAxisId="left"
              dataKey="used"
              name="Units Used"
              fill="#3b82f6"
            />
            <Bar
              yAxisId="right"
              dataKey="revenue"
              name="Revenue ($)"
              fill="#22c55e"
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}