import { Plus, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const customerMachines = [
  {
    id: "RAINBOW-001",
    customer: "John Doe",
    model: "SRX",
    serialNumber: "SRX123456",
    purchaseDate: "2023-01-15",
    warranty: true,
    accessories: ["Power Nozzle", "AquaMate", "MiniJet"],
  },
  {
    id: "RAINBOW-002",
    customer: "Jane Smith",
    model: "E2 Black",
    serialNumber: "E2B789012",
    purchaseDate: "2023-06-20",
    warranty: true,
    accessories: ["Power Nozzle"],
  },
]

export default function CustomerMachines() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-2xl">Customer Rainbows & Accessories</CardTitle>
        <div className="flex space-x-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search machines..." className="pl-8" />
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Register New Machine
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Machine ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Model</TableHead>
              <TableHead>Serial Number</TableHead>
              <TableHead>Purchase Date</TableHead>
              <TableHead>Warranty Status</TableHead>
              <TableHead>Accessories</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customerMachines.map((machine) => (
              <TableRow key={machine.id} className="cursor-pointer hover:bg-gray-50">
                <TableCell>{machine.id}</TableCell>
                <TableCell>{machine.customer}</TableCell>
                <TableCell>{machine.model}</TableCell>
                <TableCell>{machine.serialNumber}</TableCell>
                <TableCell>{new Date(machine.purchaseDate).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Badge variant={machine.warranty ? "success" : "destructive"}>
                    {machine.warranty ? "Active" : "Expired"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1 flex-wrap">
                    {machine.accessories.map((accessory) => (
                      <Badge key={accessory} variant="secondary">
                        {accessory}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}