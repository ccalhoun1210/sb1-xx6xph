import { useState } from "react"
import { Plus, Trash2, Timer, Clock, Camera } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ServiceDetails } from "@/types/workOrder"
import { partsData } from "@/lib/parts-data"
import { PhotoUpload } from "@/components/PhotoUpload"
import { ChatWidget } from "@/components/ChatWidget"

interface ServiceInfoProps {
  service: ServiceDetails;
  onUpdate: (service: ServiceDetails) => void;
  workOrderId: string;
  customerPhone?: string;
  customerName?: string;
}

export function ServiceInfo({ service, onUpdate, workOrderId, customerPhone, customerName }: ServiceInfoProps) {
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [startTime, setStartTime] = useState<Date | null>(null)

  const handleChange = (field: keyof ServiceDetails, value: any) => {
    onUpdate({ ...service, [field]: value })
  }

  const toggleTimer = () => {
    if (!isTimerRunning) {
      setStartTime(new Date())
      const interval = setInterval(() => {
        if (startTime) {
          const elapsed = (new Date().getTime() - startTime.getTime()) / (1000 * 60 * 60)
          handleChange('laborTime', elapsed)
        }
      }, 1000)
      return () => clearInterval(interval)
    }
    setIsTimerRunning(!isTimerRunning)
  }

  const addPart = (partId: string) => {
    const part = partsData.find(p => p.id === partId)
    if (part) {
      const updatedParts = [...service.selectedParts]
      const existingPart = updatedParts.find(p => p.id === part.id)
      
      if (existingPart) {
        existingPart.quantity += 1
      } else {
        updatedParts.push({ ...part, quantity: 1 })
      }
      
      handleChange('selectedParts', updatedParts)
    }
  }

  const updateQuantity = (partId: string, quantity: number) => {
    const updatedParts = service.selectedParts.map(part =>
      part.id === partId ? { ...part, quantity } : part
    )
    handleChange('selectedParts', updatedParts)
  }

  const removePart = (partId: string) => {
    const updatedParts = service.selectedParts.filter(part => part.id !== partId)
    handleChange('selectedParts', updatedParts)
  }

  const handlePhotoUpload = (files: File[]) => {
    const newPhotos = files.map(file => ({
      name: file.name,
      url: URL.createObjectURL(file)
    }))
    
    handleChange('photos', [...(service.photos || []), ...newPhotos])
  }

  // Group parts by category
  const groupedParts = partsData.reduce((acc, part) => {
    if (!acc[part.group]) {
      acc[part.group] = [];
    }
    acc[part.group].push(part);
    return acc;
  }, {} as Record<string, typeof partsData>);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="reportedIssue">Reported Issue</Label>
          <Textarea
            id="reportedIssue"
            value={service.reportedIssue}
            onChange={(e) => handleChange('reportedIssue', e.target.value)}
            placeholder="Describe the reported issue"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="symptomsObserved">Symptoms Observed</Label>
          <Textarea
            id="symptomsObserved"
            value={service.symptomsObserved}
            onChange={(e) => handleChange('symptomsObserved', e.target.value)}
            placeholder="List observed symptoms"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="severityLevel">Severity Level</Label>
          <Select
            value={service.severityLevel}
            onValueChange={(value) => handleChange('severityLevel', value)}
          >
            <SelectTrigger id="severityLevel">
              <SelectValue placeholder="Select severity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="assignedTechnician">Assigned Technician</Label>
          <Input
            id="assignedTechnician"
            value={service.assignedTechnician}
            onChange={(e) => handleChange('assignedTechnician', e.target.value)}
            placeholder="Enter technician name"
          />
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <Label>Parts and Labor</Label>
        <div className="flex gap-4">
          <Select onValueChange={addPart}>
            <SelectTrigger className="w-[300px]">
              <SelectValue placeholder="Add part" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(groupedParts).map(([group, parts]) => (
                <SelectGroup key={group}>
                  <SelectLabel>{group}</SelectLabel>
                  {parts.map((part) => (
                    <SelectItem key={part.id} value={part.id}>
                      {part.partNumber} - {part.name} (${part.price})
                    </SelectItem>
                  ))}
                </SelectGroup>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Part Number</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Total</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {service.selectedParts.map((part) => (
              <TableRow key={part.id}>
                <TableCell>{part.partNumber}</TableCell>
                <TableCell>{part.name}</TableCell>
                <TableCell>${part.price.toFixed(2)}</TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={part.quantity}
                    onChange={(e) => updateQuantity(part.id, parseInt(e.target.value))}
                    className="w-20"
                    min="1"
                  />
                </TableCell>
                <TableCell>${(part.price * part.quantity).toFixed(2)}</TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removePart(part.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="flex items-center gap-4">
          <Button onClick={toggleTimer} variant="outline">
            {isTimerRunning ? <Timer className="mr-2" /> : <Clock className="mr-2" />}
            {isTimerRunning ? "Stop Timer" : "Start Timer"}
          </Button>
          <div className="text-2xl font-mono">
            {service.laborTime.toFixed(2)} hours
          </div>
        </div>
        <div className="text-sm text-muted-foreground">
          Labor Rate: ${service.laborRate}/hour
        </div>
        <div className="text-lg">
          Labor Total: ${(service.laborTime * service.laborRate).toFixed(2)}
        </div>
      </div>

      <Separator />

      <div className="space-y-2">
        <Label htmlFor="technicianNotes">Technician Notes</Label>
        <Textarea
          id="technicianNotes"
          value={service.technicianNotes}
          onChange={(e) => handleChange('technicianNotes', e.target.value)}
          placeholder="Enter detailed notes about the service"
        />
      </div>

      <div className="space-y-4">
        <Label>Service Photos</Label>
        <PhotoUpload onUpload={handlePhotoUpload} maxPhotos={5} />
        {service.photos && service.photos.length > 0 && (
          <div className="grid grid-cols-4 gap-4">
            {service.photos.map((photo, index) => (
              <img
                key={index}
                src={photo.url}
                alt={photo.name}
                className="w-full h-32 object-cover rounded-lg"
              />
            ))}
          </div>
        )}
      </div>

      <Separator />

      <div className="space-y-4">
        <Label>Communication</Label>
        <ChatWidget
          workOrderId={workOrderId}
          customerPhone={customerPhone}
          customerName={customerName}
        />
      </div>
    </div>
  )
}