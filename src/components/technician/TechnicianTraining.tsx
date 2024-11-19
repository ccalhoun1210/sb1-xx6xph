import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"
import { Play, FileText, Award } from "lucide-react"

interface TechnicianTrainingProps {
  technicianId: string
}

export function TechnicianTraining({ technicianId }: TechnicianTrainingProps) {
  const trainingModules = [
    {
      id: 1,
      title: "SRX Maintenance Fundamentals",
      description: "Learn the basics of SRX maintenance and troubleshooting",
      progress: 75,
      status: "in-progress",
      type: "video",
      duration: "2 hours",
    },
    {
      id: 2,
      title: "E2 Black Certification",
      description: "Complete certification for E2 Black series",
      progress: 100,
      status: "completed",
      type: "certification",
      completedDate: "2024-02-15",
    },
    {
      id: 3,
      title: "Customer Service Excellence",
      description: "Best practices for customer interaction and service",
      progress: 0,
      status: "not-started",
      type: "course",
      duration: "1.5 hours",
    },
  ]

  const updates = [
    {
      id: 1,
      title: "New SRX Feature Update",
      description: "Important updates regarding the latest SRX model features",
      date: "2024-03-01",
      priority: "high",
    },
    {
      id: 2,
      title: "Service Protocol Update",
      description: "Updated service protocols for warranty claims",
      date: "2024-02-28",
      priority: "medium",
    },
  ]

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Training Modules</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px] pr-4">
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
                  <Progress value={module.progress} className="h-2" />
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-muted-foreground">
                      {module.type === "certification"
                        ? `Completed: ${module.completedDate}`
                        : `Duration: ${module.duration}`}
                    </div>
                    <Button variant="outline" size="sm">
                      {module.type === "video" ? (
                        <Play className="h-4 w-4 mr-2" />
                      ) : module.type === "certification" ? (
                        <Award className="h-4 w-4 mr-2" />
                      ) : (
                        <FileText className="h-4 w-4 mr-2" />
                      )}
                      {module.status === "completed" ? "Review" : "Continue"}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Updates & Announcements</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px] pr-4">
            <div className="space-y-4">
              {updates.map((update) => (
                <div
                  key={update.id}
                  className="p-4 border rounded-lg space-y-2"
                >
                  <div className="flex items-start justify-between">
                    <h3 className="font-medium">{update.title}</h3>
                    <Badge
                      variant={
                        update.priority === "high"
                          ? "destructive"
                          : update.priority === "medium"
                          ? "secondary"
                          : "outline"
                      }
                    >
                      {update.priority}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {update.description}
                  </p>
                  <div className="text-sm text-muted-foreground">
                    Posted: {update.date}
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    Read More
                  </Button>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}