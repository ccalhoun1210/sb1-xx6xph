import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"
import { Plus, FileText, Award } from "lucide-react"

export function TechnicianTraining() {
  const trainingModules = [
    {
      id: 1,
      title: "New Technician Onboarding",
      description: "Essential training for new technicians",
      type: "required",
      status: "not-started",
      dueDate: "2024-03-15",
    },
    {
      id: 2,
      title: "SRX Certification",
      description: "Advanced certification for SRX models",
      type: "certification",
      status: "in-progress",
      progress: 65,
    },
    {
      id: 3,
      title: "Customer Service Excellence",
      description: "Best practices for customer interactions",
      type: "course",
      status: "completed",
      completedDate: "2024-02-20",
    },
  ]

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Training Management</CardTitle>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Training Module
        </Button>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px]">
          <div className="space-y-4">
            {trainingModules.map((module) => (
              <div
                key={module.id}
                className="p-4 border rounded-lg space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium">{module.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {module.description}
                    </p>
                  </div>
                  <Badge
                    variant={
                      module.status === "completed"
                        ? "default"
                        : module.status === "in-progress"
                        ? "secondary"
                        : "outline"
                    }
                  >
                    {module.status}
                  </Badge>
                </div>

                {module.status === "in-progress" && (
                  <div className="space-y-2">
                    <Progress value={module.progress} className="h-2" />
                    <p className="text-sm text-muted-foreground">
                      {module.progress}% Complete
                    </p>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    {module.type === "certification" ? (
                      <Award className="h-4 w-4 text-blue-500" />
                    ) : (
                      <FileText className="h-4 w-4 text-gray-500" />
                    )}
                    <span className="text-sm text-muted-foreground">
                      {module.type === "certification"
                        ? "Certification"
                        : module.type === "required"
                        ? "Required Training"
                        : "Optional Course"}
                    </span>
                  </div>
                  <Button variant="outline" size="sm">
                    {module.status === "completed" ? "View Certificate" : "Manage"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}