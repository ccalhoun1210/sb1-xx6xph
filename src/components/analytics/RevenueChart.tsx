import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { WorkOrder } from "@/types/workOrder"
import { eachDayOfInterval, format, isSameDay } from "date-fns"

interface RevenueChartProps {
  workOrders: WorkOrder[]
  dateRange: { from: Date; to: Date }
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

export function RevenueChart({ workOrders, dateRange }: RevenueChartProps) {
  const days = eachDayOfInterval({ start: dateRange.from, end: dateRange.to })

  const data = days.map(day => {
    const dayWorkOrders = workOrders.filter(wo => 
      isSameDay(new Date(wo.createdAt), day)
    )

    const revenue = dayWorkOrders.reduce((sum, wo) => {
      const partsTotal = wo.service.selectedParts.reduce(
        (total, part) => total + part.price * part.quantity,
        0
      )
      const laborTotal = wo.service.laborTime * wo.service.laborRate
      return sum + partsTotal + laborTotal
    }, 0)

    return {
      date: format(day, "MMM dd"),
      revenue,
      workOrders: dayWorkOrders.length,
    }
  })

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Revenue Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <CustomXAxis dataKey="date" />
            <CustomYAxis 
              yAxisId="left"
              tickFormatter={(value) => `$${value}`}
            />
            <CustomYAxis 
              yAxisId="right" 
              orientation="right"
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white',
                border: '1px solid #ccc',
                borderRadius: '4px'
              }}
              formatter={(value: any, name: string) => {
                if (name === "Revenue") return [`$${value}`, name]
                return [value, name]
              }}
            />
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="revenue"
              stroke="#3b82f6"
              name="Revenue"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="workOrders"
              stroke="#22c55e"
              name="Work Orders"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}