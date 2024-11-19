import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Customer } from "@/types/workOrder"

interface CustomerInfoProps {
  customer: Customer;
  onUpdate: (customer: Customer) => void;
}

export function CustomerInfo({ customer, onUpdate }: CustomerInfoProps) {
  const handleChange = (field: keyof Customer, value: string) => {
    onUpdate({ ...customer, [field]: value })
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="customerName">Customer Name</Label>
        <Input 
          id="customerName" 
          value={customer.name}
          onChange={(e) => handleChange('name', e.target.value)}
          placeholder="Enter customer name" 
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="customerId">Customer ID</Label>
        <Input 
          id="customerId" 
          value={customer.id}
          onChange={(e) => handleChange('id', e.target.value)}
          placeholder="Enter customer ID" 
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="contactNumber">Contact Number</Label>
        <Input 
          id="contactNumber" 
          value={customer.phone}
          onChange={(e) => handleChange('phone', e.target.value)}
          placeholder="Enter contact number" 
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <Input 
          id="email" 
          type="email" 
          value={customer.email}
          onChange={(e) => handleChange('email', e.target.value)}
          placeholder="Enter email address" 
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="preferredContact">Preferred Contact Method</Label>
        <Select 
          value={customer.preferredContact}
          onValueChange={(value) => handleChange('preferredContact', value as Customer['preferredContact'])}
        >
          <SelectTrigger id="preferredContact">
            <SelectValue placeholder="Select contact method" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="phone">Phone</SelectItem>
            <SelectItem value="sms">SMS</SelectItem>
            <SelectItem value="email">Email</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}