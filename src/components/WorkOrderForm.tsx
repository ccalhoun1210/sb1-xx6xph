import { useEffect } from 'react';
import { Plus, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useWorkOrderStore } from '@/store/workOrderStore';
import { BasicInfo } from './work-order/BasicInfo';
import { CustomerInfo } from './work-order/CustomerInfo';
import { MachineInfo } from './work-order/MachineInfo';
import { ServiceInfo } from './work-order/ServiceInfo';
import { BillingInfo } from './work-order/BillingInfo';
import { Summary } from './work-order/Summary';

export function WorkOrderForm() {
  const { currentWorkOrder, createWorkOrder, saveWorkOrder } = useWorkOrderStore();

  useEffect(() => {
    if (!currentWorkOrder) {
      createWorkOrder();
    }
  }, [currentWorkOrder, createWorkOrder]);

  if (!currentWorkOrder) return null;

  const handleSave = () => {
    saveWorkOrder();
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-2xl">
          Work Order #{currentWorkOrder.id}
        </CardTitle>
        <Button variant="outline" onClick={createWorkOrder}>
          <Plus className="mr-2 h-4 w-4" />
          New Work Order
        </Button>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="customer">Customer</TabsTrigger>
            <TabsTrigger value="machine">Rainbow</TabsTrigger>
            <TabsTrigger value="service">Service</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
            <TabsTrigger value="summary">Summary</TabsTrigger>
          </TabsList>

          <TabsContent value="basic">
            <BasicInfo />
          </TabsContent>

          <TabsContent value="customer">
            <CustomerInfo />
          </TabsContent>

          <TabsContent value="machine">
            <MachineInfo />
          </TabsContent>

          <TabsContent value="service">
            <ServiceInfo
              selectedParts={currentWorkOrder.service.selectedParts}
              laborTime={currentWorkOrder.service.laborTime}
              laborRate={currentWorkOrder.service.laborRate}
              isTimerRunning={false}
              onAddPart={(partId) => {
                // Implementation will be added
              }}
              onUpdateQuantity={(partId, quantity) => {
                // Implementation will be added
              }}
              onRemovePart={(partId) => {
                // Implementation will be added
              }}
              onToggleTimer={() => {
                // Implementation will be added
              }}
            />
          </TabsContent>

          <TabsContent value="billing">
            <BillingInfo />
          </TabsContent>

          <TabsContent value="summary">
            <Summary />
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-end space-x-2">
        <Button onClick={handleSave}>
          <Save className="mr-2 h-4 w-4" />
          Save Work Order
        </Button>
      </CardFooter>
    </Card>
  );
}