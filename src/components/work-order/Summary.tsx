import { FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { WorkOrder } from "@/types/workOrder"
import { generateWorkOrderPDF } from "@/lib/pdf-generator"

interface SummaryProps {
  workOrder: WorkOrder
}

export function Summary({ workOrder }: SummaryProps) {
  const calculateTotalTime = () => {
    const createdDate = new Date(workOrder.createdAt)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - createdDate.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const calculatePartsTotal = () => {
    return workOrder.service.selectedParts.reduce(
      (sum, part) => sum + part.price * part.quantity,
      0
    )
  }

  const calculateLaborTotal = () => {
    return workOrder.service.laborTime * workOrder.service.laborRate
  }

  const handleGenerateReport = async () => {
    const reportData = {
      ...workOrder,
      totalTime: calculateTotalTime(),
      partsTotal: calculatePartsTotal(),
      laborTotal: calculateLaborTotal(),
      total: calculatePartsTotal() + calculateLaborTotal(),
    }

    const pdfBlob = await generateWorkOrderPDF(reportData)
    const url = URL.createObjectURL(pdfBlob)
    window.open(url)
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Work Order Summary</h3>
        
        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Basic Information</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Work Order ID:</span>
                <span className="ml-2">{workOrder.id}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Status:</span>
                <span className="ml-2 capitalize">{workOrder.status}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Service Type:</span>
                <span className="ml-2 capitalize">{workOrder.serviceType}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Priority:</span>
                <span className="ml-2 capitalize">{workOrder.priority}</span>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h4 className="font-medium mb-2">Customer Information</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Name:</span>
                <span className="ml-2">{workOrder.customer.name}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Contact:</span>
                <span className="ml-2">{workOrder.customer.phone}</span>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h4 className="font-medium mb-2">Rainbow Information</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Model:</span>
                <span className="ml-2">{workOrder.machine.model}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Serial Number:</span>
                <span className="ml-2">{workOrder.machine.serialNumber}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Condition:</span>
                <span className="ml-2 capitalize">{workOrder.machine.condition}</span>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h4 className="font-medium mb-2">Service Details</h4>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-muted-foreground">Reported Issue:</span>
                <p className="mt-1">{workOrder.service.reportedIssue}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Resolution:</span>
                <p className="mt-1">{workOrder.service.technicianNotes}</p>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h4 className="font-medium mb-2">Parts Used</h4>
            <div className="space-y-2">
              {workOrder.service.selectedParts.map((part) => (
                <div key={part.id} className="flex justify-between text-sm">
                  <span>{part.name} x{part.quantity}</span>
                  <span>${(part.price * part.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="flex justify-between font-medium">
                <span>Parts Total:</span>
                <span>${calculatePartsTotal().toFixed(2)}</span>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h4 className="font-medium mb-2">Labor</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Time Spent: {workOrder.service.laborTime.toFixed(2)} hours</span>
                <span>${calculateLaborTotal().toFixed(2)}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Time in Possession:</span>
                <span className="ml-2">{calculateTotalTime()} days</span>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h4 className="font-medium mb-2">Totals</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Parts Total:</span>
                <span>${calculatePartsTotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Labor Total:</span>
                <span>${calculateLaborTotal().toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold">
                <span>Final Total:</span>
                <span>${(calculatePartsTotal() + calculateLaborTotal()).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Button className="w-full" onClick={handleGenerateReport}>
        <FileText className="mr-2 h-4 w-4" />
        Generate Detailed Report
      </Button>
    </div>
  )
}