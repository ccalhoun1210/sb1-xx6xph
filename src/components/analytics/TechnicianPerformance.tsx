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

interface TechnicianPerformanceProps {
  workOrders: WorkOrder[]
}

const CustomXAxis = ({ ...props }) => (
  <XAxis
    {...props}
    tick={{ fontSize: 12 }}
    tickLine={{ stroke: '#888' }}
    axisLine={{ stroke: '#888' }}
  />
)

const CustomYAxis = ({ orientation = 'left', ...props }) => (
  <YAxis
    {...props}
    orientation={orientation}
    tick={{ fontSize: 12 }}
    tickLine={{ stroke: '#888' }}
    axisLine={{ stroke: '#888' }}
  />
)

export function TechnicianPerformance({ workOrders }: TechnicianPerformanceProps) {
  const technicianStats = workOrders.reduce((acc, wo) => {
    const tech = wo.service.assignedTechnician
    if (!acc[tech]) {
      acc[tech] = {
        name: tech,
        completed: 0,
        inProgress: 0,
        avgCompletionTime: 0,
        totalWorkOrders: 0,
        revenue: 0,
        satisfaction: 0,
        totalRatings: 0,
      }
    }

    acc[tech].totalWorkOrders++

    if (wo.status === "completed") {
      acc[tech].completed++
      const partsTotal = wo.service.selectedParts.reduce(
        (sum, part) => sum + part.price * part.quantity,
        0
      )
      const laborTotal = wo.service.laborTime * wo.service.laborRate
      acc[tech].revenue += partsTotal + laborTotal

      if (wo.billing.customerRating) {
        acc[tech].satisfaction += wo.billing.customerRating
        acc[tech].totalRatings++
      }
    } else if (wo.status === "inProgress") {
      acc[tech].inProgress++
    }

    return acc
  }, {} as Record<string, any>)

  const data = Object.values(technicianStats).map(tech => ({
    ...tech,
    avgSatisfaction: tech.totalRatings ? 
      (tech.satisfaction / tech.totalRatings).toFixed(1) : 0,
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Technician Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <CustomXAxis 
              dataKey="name"
              angle={-45}
              textAnchor="end"
              height={100}
            />
            <CustomYAxis yAxisId="left" />
            <CustomYAxis 
              yAxisId="right" 
              orientation="right"
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #ccc',
                borderRadius: '4px',
              }}
              formatter={(value: any, name: string) => {
                if (name === "Revenue") return [`$${value}`, name]
                if (name === "Avg. Satisfaction") return [`${value}/5`, name]
                return [value, name]
              }}
            />
            <Legend />
            <Bar
              yAxisId="left"
              dataKey="completed"
              name="Completed Orders"
              fill="#22c55e"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              yAxisId="left"
              dataKey="inProgress"
              name="In Progress"
              fill="#3b82f6"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              yAxisId="right"
              dataKey="revenue"
              name="Revenue"
              fill="#f59e0b"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              yAxisId="left"
              dataKey="avgSatisfaction"
              name="Avg. Satisfaction"
              fill="#8b5cf6"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}