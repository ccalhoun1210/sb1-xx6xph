import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { WorkOrder } from "@/types/workOrder"

interface WorkOrderStatsProps {
  workOrders: WorkOrder[]
}

const COLORS = {
  status: {
    scheduled: "#3b82f6",
    inProgress: "#22c55e",
    awaitingParts: "#eab308",
    completed: "#8b5cf6",
  },
  priority: {
    low: "#22c55e",
    medium: "#3b82f6",
    high: "#eab308",
    critical: "#ef4444",
  },
}

const RADIAN = Math.PI / 180

const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  name,
}: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
    >
      {`${name} (${(percent * 100).toFixed(0)}%)`}
    </text>
  )
}

export function WorkOrderStats({ workOrders }: WorkOrderStatsProps) {
  const statusData = [
    {
      name: "Scheduled",
      value: workOrders.filter((wo) => wo.status === "scheduled").length,
      color: COLORS.status.scheduled,
    },
    {
      name: "In Progress",
      value: workOrders.filter((wo) => wo.status === "inProgress").length,
      color: COLORS.status.inProgress,
    },
    {
      name: "Awaiting Parts",
      value: workOrders.filter((wo) => wo.status === "awaitingParts").length,
      color: COLORS.status.awaitingParts,
    },
    {
      name: "Completed",
      value: workOrders.filter((wo) => wo.status === "completed").length,
      color: COLORS.status.completed,
    },
  ].filter(item => item.value > 0)

  const priorityData = [
    {
      name: "Low",
      value: workOrders.filter((wo) => wo.priority === "low").length,
      color: COLORS.priority.low,
    },
    {
      name: "Medium",
      value: workOrders.filter((wo) => wo.priority === "medium").length,
      color: COLORS.priority.medium,
    },
    {
      name: "High",
      value: workOrders.filter((wo) => wo.priority === "high").length,
      color: COLORS.priority.high,
    },
    {
      name: "Critical",
      value: workOrders.filter((wo) => wo.priority === "critical").length,
      color: COLORS.priority.critical,
    },
  ].filter(item => item.value > 0)

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Work Order Status</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: any) => [`${value} orders`, 'Count']}
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Priority Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={priorityData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {priorityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: any) => [`${value} orders`, 'Count']}
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}