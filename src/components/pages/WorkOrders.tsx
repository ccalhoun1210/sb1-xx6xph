import { useEffect, useState } from "react";
import { Plus, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useWorkOrderStore } from "@/store/workOrderStore";
import { useToast } from "@/hooks/use-toast";

export default function WorkOrders() {
  const navigate = useNavigate();
  const { workOrders, createWorkOrder, fetchWorkOrders, isLoading, error } = useWorkOrderStore();
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const loadWorkOrders = async () => {
      try {
        await fetchWorkOrders();
      } catch (err) {
        toast({
          title: "Error",
          description: "Failed to fetch work orders. Please try again.",
          variant: "destructive",
        });
      }
    };

    loadWorkOrders();
  }, [fetchWorkOrders, toast]);

  const handleNewWorkOrder = async () => {
    try {
      await createWorkOrder();
      navigate("/work-orders/new");
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to create work order. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleWorkOrderClick = (id: string) => {
    navigate(`/work-orders/${id}`);
  };

  const filteredWorkOrders = workOrders.filter((order) => {
    const searchString = `${order.id} ${order.customer.name} ${order.machine.model}`.toLowerCase();
    return searchString.includes(searchTerm.toLowerCase());
  });

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Failed to fetch work orders</AlertDescription>
      </Alert>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-2xl">Work Orders</CardTitle>
        <div className="flex space-x-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search work orders..." 
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button onClick={handleNewWorkOrder} disabled={isLoading}>
            <Plus className="mr-2 h-4 w-4" />
            New Work Order
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-4">Loading work orders...</div>
        ) : filteredWorkOrders.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-muted-foreground">No work orders found</p>
            <Button 
              variant="outline" 
              className="mt-2"
              onClick={handleNewWorkOrder}
            >
              Create your first work order
            </Button>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Work Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Rainbow Model</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredWorkOrders.map((order) => (
                <TableRow 
                  key={order.id} 
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => handleWorkOrderClick(order.id)}
                >
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.customer.name || "Not assigned"}</TableCell>
                  <TableCell>{order.machine.model || "Not specified"}</TableCell>
                  <TableCell>
                    <Badge variant={
                      order.status === "completed" ? "default" :
                      order.status === "inProgress" ? "secondary" :
                      "outline"
                    }>
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={
                      order.priority === "high" ? "destructive" :
                      order.priority === "medium" ? "secondary" :
                      "outline"
                    }>
                      {order.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}