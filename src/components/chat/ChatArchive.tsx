import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { useChatStore } from "@/store/chatStore";
import { useWorkOrderStore } from "@/store/workOrderStore";

export function ChatArchive() {
  const [searchTerm, setSearchTerm] = useState("");
  const { conversations } = useChatStore();
  const { workOrders } = useWorkOrderStore();

  const filteredConversations = conversations.filter((conv) => {
    const workOrder = workOrders.find((wo) => wo.id === conv.workOrderId);
    if (!workOrder) return false;

    const searchString = `${workOrder.id} ${workOrder.customer.name} ${
      workOrder.service.assignedTechnician
    } ${conv.messages.map((m) => m.text).join(" ")}`.toLowerCase();

    return searchString.includes(searchTerm.toLowerCase());
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Chat Archive</Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl h-[80vh]">
        <DialogHeader>
          <DialogTitle>Chat Archive</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          <ScrollArea className="h-[calc(80vh-8rem)]">
            <div className="space-y-4">
              {filteredConversations.map((conversation) => {
                const workOrder = workOrders.find(
                  (wo) => wo.id === conversation.workOrderId
                );
                if (!workOrder) return null;

                return (
                  <div
                    key={conversation.id}
                    className="border rounded-lg p-4 space-y-2"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">
                          Work Order #{workOrder.id}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Customer: {workOrder.customer.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Technician: {workOrder.service.assignedTechnician}
                        </p>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {format(new Date(conversation.lastActivity), "PPp")}
                      </span>
                    </div>
                    <ScrollArea className="h-40 w-full rounded-md border p-4">
                      <div className="space-y-2">
                        {conversation.messages.map((message) => (
                          <div key={message.id} className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">
                                {message.sender === "admin"
                                  ? "Admin"
                                  : message.sender === "technician"
                                  ? "Technician"
                                  : "Customer"}
                              </span>
                              <span className="text-sm text-muted-foreground">
                                {format(new Date(message.timestamp), "p")}
                              </span>
                            </div>
                            <p className="text-sm">{message.text}</p>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}