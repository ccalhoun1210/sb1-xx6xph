import { AlertTriangle } from "lucide-react"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useInventoryStore } from "@/store/inventoryStore"

interface LowStockAlertProps {
  items: Array<{
    id: string;
    name: string;
    partNumber: string;
    quantity: number;
    reorderPoint: number;
  }>;
}

export function LowStockAlert({ items }: LowStockAlertProps) {
  const { placeOrder } = useInventoryStore()

  const handleReorder = () => {
    const orderItems = items.map(item => ({
      id: item.id,
      quantity: item.reorderPoint - item.quantity,
    }))
    placeOrder(orderItems)
  }

  return (
    <Alert variant="destructive">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Low Stock Alert</AlertTitle>
      <AlertDescription className="mt-2">
        <ScrollArea className="h-[100px] pr-4">
          <div className="space-y-2">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between items-center">
                <span>
                  {item.name} ({item.partNumber})
                </span>
                <span>
                  Quantity: {item.quantity} / Reorder Point: {item.reorderPoint}
                </span>
              </div>
            ))}
          </div>
        </ScrollArea>
        <Button
          variant="outline"
          className="mt-4 w-full bg-white hover:bg-gray-100"
          onClick={handleReorder}
        >
          Reorder All Items
        </Button>
      </AlertDescription>
    </Alert>
  )
}