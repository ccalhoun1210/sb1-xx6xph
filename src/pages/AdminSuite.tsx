import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TechnicianManagement } from "@/components/admin/technicians/TechnicianManagement";
import { AdminMessaging } from "@/components/admin/messaging/AdminMessaging";
import { AnalyticsDashboard } from "@/components/analytics/AnalyticsDashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell } from "lucide-react";

export default function AdminSuite() {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Admin Suite</h2>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="flex items-center gap-1">
            <Bell className="h-3 w-3" />
            <span>7 Notifications</span>
          </Badge>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="technicians">Technician Management</TabsTrigger>
          <TabsTrigger value="messaging">Communication Center</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="mt-6">
          <AnalyticsDashboard />
        </TabsContent>

        <TabsContent value="technicians" className="mt-6">
          <TechnicianManagement />
        </TabsContent>

        <TabsContent value="messaging" className="mt-6">
          <AdminMessaging />
        </TabsContent>
      </Tabs>
    </div>
  );
}