import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";

interface MessageTemplate {
  id: string;
  name: string;
  content: string;
  category: string;
  variables: string[];
}

const defaultTemplates: MessageTemplate[] = [
  {
    id: "1",
    name: "Service Completion",
    content: "Hello {customerName}, your Rainbow service is complete. Total cost: ${total}. Please let us know if you have any questions.",
    category: "Service",
    variables: ["customerName", "total"],
  },
  {
    id: "2",
    name: "Parts Delay",
    content: "Hello {customerName}, we're waiting for parts to arrive for your Rainbow. Estimated arrival: {eta}. We'll contact you once they arrive.",
    category: "Parts",
    variables: ["customerName", "eta"],
  },
];

interface MessageTemplateProps {
  onSelect: (content: string) => void;
}

export function MessageTemplate({ onSelect }: MessageTemplateProps) {
  const [templates, setTemplates] = useState<MessageTemplate[]>(defaultTemplates);
  const [selectedTemplate, setSelectedTemplate] = useState<MessageTemplate | null>(null);
  const [variables, setVariables] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const handleSelect = (template: MessageTemplate) => {
    setSelectedTemplate(template);
    const newVariables: Record<string, string> = {};
    template.variables.forEach(v => newVariables[v] = "");
    setVariables(newVariables);
  };

  const applyTemplate = () => {
    if (!selectedTemplate) return;

    let content = selectedTemplate.content;
    Object.entries(variables).forEach(([key, value]) => {
      content = content.replace(`{${key}}`, value);
    });

    onSelect(content);
    setSelectedTemplate(null);
    setVariables({});
    toast({
      title: "Template Applied",
      description: "Message template has been applied successfully.",
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Use Template</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Message Templates</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Available Templates</Label>
            <ScrollArea className="h-[300px] border rounded-md p-2">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className={`p-2 cursor-pointer rounded hover:bg-accent ${
                    selectedTemplate?.id === template.id ? "bg-accent" : ""
                  }`}
                  onClick={() => handleSelect(template)}
                >
                  <h4 className="font-medium">{template.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {template.category}
                  </p>
                </div>
              ))}
            </ScrollArea>
          </div>
          <div>
            {selectedTemplate && (
              <div className="space-y-4">
                <div>
                  <Label>Template Preview</Label>
                  <div className="p-2 border rounded-md bg-muted">
                    {selectedTemplate.content}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Variables</Label>
                  {selectedTemplate.variables.map((variable) => (
                    <div key={variable} className="space-y-1">
                      <Label className="text-sm">{variable}</Label>
                      <Input
                        value={variables[variable] || ""}
                        onChange={(e) =>
                          setVariables({
                            ...variables,
                            [variable]: e.target.value,
                          })
                        }
                        placeholder={`Enter ${variable}`}
                      />
                    </div>
                  ))}
                </div>
                <Button
                  className="w-full"
                  onClick={applyTemplate}
                  disabled={Object.values(variables).some((v) => !v)}
                >
                  Apply Template
                </Button>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}