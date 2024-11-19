import { useState } from "react";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useMachines } from "@/hooks/useApi";

export default function CustomerMachines() {
  const { machines, isLoading } = useMachines();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredMachines = machines.filter(machine => 
    machine.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
    machine.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    machine.customer?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-2xl">Customer Rainbows</CardTitle>
        <div className="flex space-x-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search machines..." 
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
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
              <TableHead>Customer</TableHead>
              <TableHead>Model</TableHead>
              <TableHead>Serial Number</TableHead>
              <TableHead>Purchase Date</TableHead>
              <TableHead>Condition</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  Loading machines...
                </TableCell>
              </TableRow>
            ) : filteredMachines.map((machine) => (
              <TableRow key={machine.id} className="cursor-pointer hover:bg-gray-50">
                <TableCell>{machine.customer?.name}</TableCell>
                <TableCell>{machine.model}</TableCell>
                <TableCell>{machine.serialNumber}</TableCell>
                <TableCell>{new Date(machine.purchaseDate).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Badge variant={
                    machine.condition === "good" ? "default" :
                    machine.condition === "fair" ? "secondary" :
                    "destructive"
                  }>
                    {machine.condition}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm">
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}