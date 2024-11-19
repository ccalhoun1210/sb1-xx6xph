import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { WorkOrder } from "@/types/workOrder"

interface BasicInfoProps {
  workOrder: WorkOrder;
  onUpdate: (updates: Partial<WorkOrder>) => void;
}

export function BasicInfo({ workOrder, onUpdate }: BasicInfoProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="workOrderId">Work Order ID</Label>
        <Input id="workOrderId" value={workOrder.id} readOnly />
      </div>
      <div className="space-y-2">
        <Label htmlFor="serviceType">Service Type</Label>
        <Select 
          value={workOrder.serviceType}
          onValueChange={(value) => onUpdate({ serviceType: value as WorkOrder['serviceType'] })}
        >
          <SelectTrigger id="serviceType">
            <SelectValue placeholder="Select service type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="maintenance">Maintenance</SelectItem>
            <SelectItem value="repair">Repair</SelectItem>
            <SelectItem value="warranty">Warranty Check</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="creationDate">Creation Date</Label>
        <Input 
          id="creationDate" 
          type="date" 
          value={workOrder.createdAt.split('T')[0]}
          onChange={(e) => onUpdate({ createdAt: new Date(e.target.value).toISOString() })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="dueDate">Due Date</Label>
        <Input 
          id="dueDate" 
          type="date"
          value={workOrder.dueDate}
          onChange={(e) => onUpdate({ dueDate: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <Select
          value={workOrder.status}
          onValueChange={(value) => onUpdate({ status: value as WorkOrder['status'] })}
        >
          <SelectTrigger id="status">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="scheduled">Scheduled</SelectItem>
            <SelectItem value="inProgress">In Progress</SelectItem>
            <SelectItem value="awaitingParts">Awaiting Parts</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="priority">Priority Level</Label>
        <Select
          value={workOrder.priority}
          onValueChange={(value) => onUpdate({ priority: value as WorkOrder['priority'] })}
        >
          <SelectTrigger id="priority">
            <SelectValue placeholder="Select priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}