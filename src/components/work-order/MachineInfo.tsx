import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Machine } from "@/types/workOrder"

interface MachineInfoProps {
  machine: Machine;
  onUpdate: (machine: Machine) => void;
}

export function MachineInfo({ machine, onUpdate }: MachineInfoProps) {
  const [showPowerNozzleSerial, setShowPowerNozzleSerial] = useState(!!machine.attachments.powerNozzle?.serialNumber)
  const [showAquaMateSerial, setShowAquaMateSerial] = useState(!!machine.attachments.aquaMate?.serialNumber)
  const [showMiniJetSerial, setShowMiniJetSerial] = useState(!!machine.attachments.miniJet?.serialNumber)

  const handleChange = (field: keyof Machine, value: string) => {
    onUpdate({ ...machine, [field]: value })
  }

  const handleAttachmentChange = (attachment: keyof Machine['attachments'], checked: boolean, serialNumber?: string) => {
    const newAttachments = {
      ...machine.attachments,
      [attachment]: { attached: checked, serialNumber }
    }
    onUpdate({ ...machine, attachments: newAttachments })
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="rainbowModel">Rainbow Model</Label>
          <Select
            value={machine.model}
            onValueChange={(value) => handleChange('model', value)}
          >
            <SelectTrigger id="rainbowModel">
              <SelectValue placeholder="Select Rainbow model" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="srx">SRX</SelectItem>
              <SelectItem value="e2Black">E2 Black (E2 Type 12)</SelectItem>
              <SelectItem value="e2Gold">E2 Gold (E2 Type 12)</SelectItem>
              <SelectItem value="e2Series">E-2 (e SERIES)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="serialNumber">Rainbow Serial Number</Label>
          <Input 
            id="serialNumber" 
            value={machine.serialNumber}
            onChange={(e) => handleChange('serialNumber', e.target.value)}
            placeholder="Enter Rainbow serial number" 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="purchaseDate">Date of Purchase</Label>
          <Input 
            id="purchaseDate" 
            type="date"
            value={machine.purchaseDate}
            onChange={(e) => handleChange('purchaseDate', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="machineCondition">Rainbow Condition</Label>
          <Select
            value={machine.condition}
            onValueChange={(value) => handleChange('condition', value as Machine['condition'])}
          >
            <SelectTrigger id="machineCondition">
              <SelectValue placeholder="Select Rainbow condition" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="good">Good</SelectItem>
              <SelectItem value="fair">Fair</SelectItem>
              <SelectItem value="poor">Poor</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-4">
        <Label>Attachments Left with Rainbow</Label>
        <div className="grid gap-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="powerNozzle"
                checked={machine.attachments.powerNozzle?.attached}
                onCheckedChange={(checked) => {
                  setShowPowerNozzleSerial(checked === true)
                  handleAttachmentChange('powerNozzle', checked === true)
                }}
              />
              <Label htmlFor="powerNozzle">Power Nozzle</Label>
            </div>
            {showPowerNozzleSerial && (
              <Input 
                placeholder="Enter Power Nozzle serial number"
                value={machine.attachments.powerNozzle?.serialNumber || ''}
                onChange={(e) => handleAttachmentChange('powerNozzle', true, e.target.value)}
                className="mt-2" 
              />
            )}
          </div>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="aquaMate"
                checked={machine.attachments.aquaMate?.attached}
                onCheckedChange={(checked) => {
                  setShowAquaMateSerial(checked === true)
                  handleAttachmentChange('aquaMate', checked === true)
                }}
              />
              <Label htmlFor="aquaMate">AquaMate</Label>
            </div>
            {showAquaMateSerial && (
              <Input 
                placeholder="Enter AquaMate serial number"
                value={machine.attachments.aquaMate?.serialNumber || ''}
                onChange={(e) => handleAttachmentChange('aquaMate', true, e.target.value)}
                className="mt-2" 
              />
            )}
          </div>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="miniJet"
                checked={machine.attachments.miniJet?.attached}
                onCheckedChange={(checked) => {
                  setShowMiniJetSerial(checked === true)
                  handleAttachmentChange('miniJet', checked === true)
                }}
              />
              <Label htmlFor="miniJet">MiniJet</Label>
            </div>
            {showMiniJetSerial && (
              <Input 
                placeholder="Enter MiniJet serial number"
                value={machine.attachments.miniJet?.serialNumber || ''}
                onChange={(e) => handleAttachmentChange('miniJet', true, e.target.value)}
                className="mt-2" 
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}