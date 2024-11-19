import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useInventoryStore } from "@/store/inventoryStore"
import { useToast } from "@/hooks/use-toast"

interface EditInventoryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  itemId: string | null
}

export function EditInventoryDialog({
  open,
  onOpenChange,
  itemId,
}: EditInventoryDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    partNumber: "",
    group: "",
    quantity: 0,
    price: 0,
    minStock: 0,
    maxStock: 0,
    location: "",
    supplier: "",
    reorderPoint: 0,
  })

  const { getItemById, updateItem } = useInventoryStore()
  const { toast } = useToast()

  useEffect(() => {
    if (itemId) {
      const item = getItemById(itemId)
      if (item) {
        setFormData({
          name: item.name,
          partNumber: item.partNumber,
          group: item.group,
          quantity: item.quantity,
          price: item.price,
          minStock: item.minStock,
          maxStock: item.maxStock,
          location: item.location,
          supplier: item.supplier,
          reorderPoint: item.reorderPoint,
        })
      }
    }
  }, [itemId, getItemById])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!itemId) return

    try {
      updateItem(itemId, {
        ...formData,
        description: formData.name,
      })

      toast({
        title: "Success",
        description: "Inventory item updated successfully",
      })

      onOpenChange(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update inventory item",
        variant: "destructive",
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Inventory Item</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="partNumber">Part Number</Label>
              <Input
                id="partNumber"
                value={formData.partNumber}
                onChange={(e) => setFormData({ ...formData, partNumber: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="group">Group</Label>
            <Select
              value={formData.group}
              onValueChange={(value) => setFormData({ ...formData, group: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select group" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Power Nozzle">Power Nozzle</SelectItem>
                <SelectItem value="Main Housing Assembly">Main Housing Assembly</SelectItem>
                <SelectItem value="Motor Assembly">Motor Assembly</SelectItem>
                <SelectItem value="Hose & Wand Assembly">Hose & Wand Assembly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                min="0"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="minStock">Minimum Stock</Label>
              <Input
                id="minStock"
                type="number"
                min="0"
                value={formData.minStock}
                onChange={(e) => setFormData({ ...formData, minStock: parseInt(e.target.value) })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxStock">Maximum Stock</Label>
              <Input
                id="maxStock"
                type="number"
                min="0"
                value={formData.maxStock}
                onChange={(e) => setFormData({ ...formData, maxStock: parseInt(e.target.value) })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="supplier">Supplier</Label>
            <Input
              id="supplier"
              value={formData.supplier}
              onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
              required
            />
          </div>

          <DialogFooter>
            <Button type="submit">Update Item</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}