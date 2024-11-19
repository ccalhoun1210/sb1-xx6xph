import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { Check, ChevronsUpDown, Plus, Tag, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { useMessageStore } from "@/store/messageStore"
import { useWorkOrderStore } from "@/store/workOrderStore"

interface NewChatDialogProps {
  type: 'technician' | 'customer';
  onChatCreated: (conversationId: string) => void;
}

export function NewChatDialog({ type, onChatCreated }: NewChatDialogProps) {
  const [open, setOpen] = useState(false)
  const [recipientSearchOpen, setRecipientSearchOpen] = useState(false)
  const [workOrderSearchOpen, setWorkOrderSearchOpen] = useState(false)
  const [selectedRecipient, setSelectedRecipient] = useState<{
    id: string;
    name: string;
    role: string;
  } | null>(null)
  const [selectedWorkOrder, setSelectedWorkOrder] = useState<{
    id: string;
    customer: string;
  } | null>(null)
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  const { createConversation } = useMessageStore()
  const { workOrders } = useWorkOrderStore()

  // Mock data - replace with real data from your user store
  const recipients = type === 'technician' ? [
    { id: '1', name: 'John Doe', role: 'technician' },
    { id: '2', name: 'Jane Smith', role: 'technician' },
  ] : [
    { id: '3', name: 'Alice Johnson', role: 'customer' },
    { id: '4', name: 'Bob Wilson', role: 'customer' },
  ]

  const availableTags = [
    'training',
    'urgent',
    'payroll',
    'general',
    'scheduling',
  ]

  const handleCreateChat = () => {
    if (!selectedRecipient) return

    const tags = [
      ...selectedTags.map(tag => ({
        id: Date.now().toString(),
        type: tag,
        value: tag,
        label: tag.charAt(0).toUpperCase() + tag.slice(1),
      })),
    ]

    if (selectedWorkOrder) {
      tags.push({
        id: Date.now().toString(),
        type: 'work-order',
        value: selectedWorkOrder.id,
        label: `WO #${selectedWorkOrder.id}`,
      })
    }

    const conversationId = createConversation(
      [
        {
          id: 'admin-user',
          name: 'Admin',
          role: 'admin',
        },
        {
          id: selectedRecipient.id,
          name: selectedRecipient.name,
          role: selectedRecipient.role as 'technician' | 'customer',
        },
      ],
      tags
    )

    onChatCreated(conversationId)
    setOpen(false)
    resetForm()
  }

  const resetForm = () => {
    setSelectedRecipient(null)
    setSelectedWorkOrder(null)
    setSelectedTags([])
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Chat
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>New Conversation</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Select {type}</label>
            <Popover open={recipientSearchOpen} onOpenChange={setRecipientSearchOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={recipientSearchOpen}
                  className="w-full justify-between"
                >
                  {selectedRecipient
                    ? selectedRecipient.name
                    : `Select ${type}...`}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[400px] p-0">
                <Command>
                  <CommandInput placeholder={`Search ${type}s...`} />
                  <CommandEmpty>No {type} found.</CommandEmpty>
                  <CommandGroup>
                    {recipients.map((recipient) => (
                      <CommandItem
                        key={recipient.id}
                        value={recipient.name}
                        onSelect={() => {
                          setSelectedRecipient(recipient)
                          setRecipientSearchOpen(false)
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedRecipient?.id === recipient.id
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        {recipient.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Link to Work Order (Optional)</label>
            <Popover open={workOrderSearchOpen} onOpenChange={setWorkOrderSearchOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={workOrderSearchOpen}
                  className="w-full justify-between"
                >
                  {selectedWorkOrder
                    ? `WO #${selectedWorkOrder.id} - ${selectedWorkOrder.customer}`
                    : "Select work order..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[400px] p-0">
                <Command>
                  <CommandInput placeholder="Search work orders..." />
                  <CommandEmpty>No work orders found.</CommandEmpty>
                  <CommandGroup>
                    {workOrders.map((wo) => (
                      <CommandItem
                        key={wo.id}
                        value={wo.id}
                        onSelect={() => {
                          setSelectedWorkOrder({
                            id: wo.id,
                            customer: wo.customer.name,
                          })
                          setWorkOrderSearchOpen(false)
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedWorkOrder?.id === wo.id
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        WO #{wo.id} - {wo.customer.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Tags</label>
            <div className="flex flex-wrap gap-2">
              {availableTags.map((tag) => (
                <Badge
                  key={tag}
                  variant={selectedTags.includes(tag) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => {
                    setSelectedTags((prev) =>
                      prev.includes(tag)
                        ? prev.filter((t) => t !== tag)
                        : [...prev, tag]
                    )
                  }}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleCreateChat}
              disabled={!selectedRecipient}
            >
              Start Chat
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}