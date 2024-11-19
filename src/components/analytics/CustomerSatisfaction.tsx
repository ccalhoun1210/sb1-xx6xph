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
import { format } from "date-fns"

interface CustomerSatisfactionProps {
  workOrders: WorkOrder[]
}

export function CustomerSatisfaction({ workOrders }: CustomerSatisfactionProps) {
  const completedOrders = workOrders
    .filter((wo) => wo.status === "completed" && wo.billing.customerRating > 0)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())

  const data = completedOrders.map((wo) => ({
    date: format(new Date(wo.createdAt), "MMM dd"),
    rating: wo.billing.customerRating,
    feedback: wo.billing.customerFeedback || "No feedback provided",
  }))

  const averageRating =
    completedOrders.reduce((sum, wo) => sum + wo.billing.customerRating, 0) /
    (completedOrders.length || 1)

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Customer Satisfaction Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <h3 className="text-lg font-semibold">
              Average Rating: {averageRating.toFixed(1)} / 5
            </h3>
            <p className="text-sm text-muted-foreground">
              Based on {completedOrders.length} customer ratings
            </p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[0, 5]} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white p-4 rounded-lg shadow border">
                        <p className="font-semibold">
                          Rating: {payload[0].value} / 5
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {payload[0].payload.feedback}
                        </p>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="rating"
                stroke="#3b82f6"
                name="Customer Rating"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}