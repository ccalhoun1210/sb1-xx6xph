import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { cn } from "@/lib/utils"
import { 
  BarChart3, 
  Users, 
  MessageSquare, 
  Settings,
  Calendar,
  DollarSign,
  GraduationCap,
  ClipboardList,
  Bell
} from "lucide-react"
import AdminDashboard from "@/components/pages/AdminDashboard"
import { TechnicianManagement } from "@/components/admin/technicians/TechnicianManagement"
import { AdminMessaging } from "@/components/admin/messaging/AdminMessaging"
import { TechnicianScheduling } from "@/components/admin/technicians/TechnicianScheduling"
import { TechnicianPayroll } from "@/components/admin/technicians/TechnicianPayroll"
import { TechnicianTraining } from "@/components/admin/technicians/TechnicianTraining"
import { TechnicianWorkOrders } from "@/components/admin/technicians/TechnicianWorkOrders"
import { Badge } from "@/components/ui/badge"

export default function AdminSuite() {
  const [activeSection, setActiveSection] = useState("dashboard")

  const sections = [
    {
      id: "dashboard",
      label: "Dashboard Overview",
      icon: BarChart3,
      description: "Key metrics and performance indicators",
      component: <AdminDashboard />,
    },
    {
      id: "technicians",
      label: "Technician Management",
      icon: Users,
      description: "Manage technician operations",
      notifications: 2,
      subsections: [
        { 
          id: "tech-list", 
          label: "Technicians", 
          description: "View and manage technician profiles",
          component: <TechnicianManagement /> 
        },
        { 
          id: "scheduling", 
          label: "Scheduling", 
          icon: Calendar, 
          description: "Manage technician schedules and assignments",
          component: <TechnicianScheduling /> 
        },
        { 
          id: "payroll", 
          label: "Payroll", 
          icon: DollarSign, 
          description: "Process technician payroll and commissions",
          component: <TechnicianPayroll /> 
        },
        { 
          id: "training", 
          label: "Training", 
          icon: GraduationCap, 
          description: "Manage training programs and certifications",
          component: <TechnicianTraining /> 
        },
        { 
          id: "work-orders", 
          label: "Work Orders", 
          icon: ClipboardList, 
          description: "Track assigned work orders",
          component: <TechnicianWorkOrders /> 
        },
      ],
    },
    {
      id: "messaging",
      label: "Communication Center",
      icon: MessageSquare,
      description: "Manage all communications",
      notifications: 5,
      component: <AdminMessaging />,
    },
    {
      id: "settings",
      label: "System Settings",
      icon: Settings,
      description: "Configure system preferences",
      component: <div>Settings Content</div>,
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Admin Suite</h2>
          <p className="text-muted-foreground mt-1">
            Manage your business operations and team
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="flex items-center gap-1">
            <Bell className="h-3 w-3" />
            <span>7 Notifications</span>
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-[280px_1fr] gap-6">
        <Card className="p-2">
          <Accordion type="single" collapsible className="w-full">
            {sections.map((section) => (
              <AccordionItem key={section.id} value={section.id}>
                {section.subsections ? (
                  <>
                    <AccordionTrigger className="px-4 hover:no-underline">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-2 flex-1">
                          <section.icon className="h-5 w-5" />
                          <div className="flex flex-col items-start">
                            <span className="font-medium">{section.label}</span>
                            <span className="text-xs text-muted-foreground">
                              {section.description}
                            </span>
                          </div>
                        </div>
                        {section.notifications && (
                          <Badge variant="secondary">
                            {section.notifications}
                          </Badge>
                        )}
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="pl-6 space-y-1">
                        {section.subsections.map((subsection) => (
                          <button
                            key={subsection.id}
                            onClick={() => setActiveSection(subsection.id)}
                            className={cn(
                              "w-full text-left px-4 py-3 rounded-md text-sm transition-colors",
                              activeSection === subsection.id
                                ? "bg-primary text-primary-foreground"
                                : "hover:bg-muted"
                            )}
                          >
                            <div className="flex flex-col">
                              <div className="flex items-center gap-2">
                                {subsection.icon && <subsection.icon className="h-4 w-4" />}
                                <span className="font-medium">{subsection.label}</span>
                              </div>
                              <span className="text-xs text-muted-foreground">
                                {subsection.description}
                              </span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </AccordionContent>
                  </>
                ) : (
                  <button
                    onClick={() => setActiveSection(section.id)}
                    className={cn(
                      "w-full text-left px-4 py-3 rounded-md transition-colors",
                      activeSection === section.id
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <section.icon className="h-5 w-5" />
                      <div className="flex flex-col items-start">
                        <span className="font-medium">{section.label}</span>
                        <span className="text-xs text-muted-foreground">
                          {section.description}
                        </span>
                      </div>
                      {section.notifications && (
                        <Badge variant="secondary" className="ml-auto">
                          {section.notifications}
                        </Badge>
                      )}
                    </div>
                  </button>
                )}
              </AccordionItem>
            ))}
          </Accordion>
        </Card>

        <Card>
          <CardContent className="p-6">
            {sections.map((section) => {
              if (section.subsections) {
                const activeSubsection = section.subsections.find(
                  (sub) => sub.id === activeSection
                )
                if (activeSubsection) {
                  return (
                    <div key={activeSubsection.id}>
                      {activeSubsection.component}
                    </div>
                  )
                }
              } else if (activeSection === section.id) {
                return <div key={section.id}>{section.component}</div>
              }
              return null
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}