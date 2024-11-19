import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function TechnicianPayroll() {
  const [selectedPeriod, setSelectedPeriod] = useState("current")

  const payrollData = [
    {
      id: "1",
      name: "John Doe",
      regularHours: 75,
      overtimeHours: 5,
      completedOrders: 12,
      commission: 450.00,
      totalPay: 2875.00,
      status: "pending",
    },
    {
      id: "2",
      name: "Jane Smith",
      regularHours: 80,
      overtimeHours: 0,
      completedOrders: 15,
      commission: 525.00,
      totalPay: 2725.00,
      status: "processed",
    },
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Payroll Management</CardTitle>
          <div className="flex space-x-2">
            <Select
              value={selectedPeriod}
              onValueChange={setSelectedPeriod}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="current">Current Period</SelectItem>
                <SelectItem value="previous">Previous Period</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>
            <Button>Process Payroll</Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Technician</TableHead>
                <TableHead>Regular Hours</TableHead>
                <TableHead>Overtime Hours</TableHead>
                <TableHead>Completed Orders</TableHead>
                <TableHead>Commission</TableHead>
                <TableHead>Total Pay</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payrollData.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell className="font-medium">{entry.name}</TableCell>
                  <TableCell>{entry.regularHours}</TableCell>
                  <TableCell>{entry.overtimeHours}</TableCell>
                  <TableCell>{entry.completedOrders}</TableCell>
                  <TableCell>${entry.commission.toFixed(2)}</TableCell>
                  <TableCell>${entry.totalPay.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        entry.status === "processed" ? "default" : "secondary"
                      }
                    >
                      {entry.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Hours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">160</div>
            <p className="text-xs text-muted-foreground">
              Regular: 155 | Overtime: 5
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Commission</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$975.00</div>
            <p className="text-xs text-muted-foreground">
              27 completed orders
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Payroll</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$5,600.00</div>
            <p className="text-xs text-muted-foreground">
              For current period
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}