import { useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Plus, Save } from "lucide-react"
import { useWorkOrderStore } from "@/store/workOrderStore"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BasicInfo } from "./work-order/BasicInfo"
import { CustomerInfo } from "./work-order/CustomerInfo"
import { MachineInfo } from "./work-order/MachineInfo"
import { ServiceInfo } from "./work-order/ServiceInfo"
import { BillingInfo } from "./work-order/BillingInfo"
import { Summary } from "./work-order/Summary"
import { useToast } from "@/hooks/use-toast"

export default function WorkOrder() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()
  const { 
    currentWorkOrder, 
    createWorkOrder, 
    updateWorkOrder, 
    saveWorkOrder, 
    getWorkOrder,
    isLoading 
  } = useWorkOrderStore()

  useEffect(() => {
    const initializeWorkOrder = async () => {
      try {
        if (id === 'new') {
          await createWorkOrder()
        } else if (id) {
          const workOrder = await getWorkOrder(id)
          if (workOrder) {
            updateWorkOrder(workOrder)
          } else {
            toast({
              title: 'Error',
              description: 'Work order not found',
              variant: 'destructive'
            })
            navigate('/work-orders')
          }
        }
      } catch (error) {
        toast({
          title: 'Error',
          description: error instanceof Error ? error.message : 'Failed to load work order',
          variant: 'destructive'
        })
        navigate('/work-orders')
      }
    }

    initializeWorkOrder()
  }, [id])

  const handleSave = async () => {
    if (!currentWorkOrder) return

    try {
      await saveWorkOrder()
      toast({
        title: 'Success',
        description: 'Work order saved successfully'
      })
      navigate('/work-orders')
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to save work order',
        variant: 'destructive'
      })
    }
  }

  const handleNewWorkOrder = async () => {
    try {
      await createWorkOrder()
      navigate('/work-orders/new')
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create work order',
        variant: 'destructive'
      })
    }
  }

  if (!currentWorkOrder) return null

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-2xl">Work Order #{currentWorkOrder.id}</CardTitle>
        <Button variant="outline" onClick={handleNewWorkOrder} disabled={isLoading}>
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
            <BasicInfo 
              workOrder={currentWorkOrder}
              onUpdate={updateWorkOrder}
            />
          </TabsContent>

          <TabsContent value="customer">
            <CustomerInfo 
              customer={currentWorkOrder.customer}
              onUpdate={(customer) => updateWorkOrder({ customer })}
            />
          </TabsContent>

          <TabsContent value="machine">
            <MachineInfo 
              machine={currentWorkOrder.machine}
              onUpdate={(machine) => updateWorkOrder({ machine })}
            />
          </TabsContent>

          <TabsContent value="service">
            <ServiceInfo 
              service={currentWorkOrder.service}
              onUpdate={(service) => updateWorkOrder({ service })}
              workOrderId={currentWorkOrder.id}
              customerPhone={currentWorkOrder.customer.phone}
              customerName={currentWorkOrder.customer.name}
            />
          </TabsContent>

          <TabsContent value="billing">
            <BillingInfo 
              billing={currentWorkOrder.billing}
              service={currentWorkOrder.service}
              onUpdate={(billing) => updateWorkOrder({ billing })}
            />
          </TabsContent>

          <TabsContent value="summary">
            <Summary workOrder={currentWorkOrder} />
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-end space-x-2">
        <Button onClick={handleSave} disabled={isLoading}>
          <Save className="mr-2 h-4 w-4" />
          {isLoading ? 'Saving...' : 'Save Work Order'}
        </Button>
      </CardFooter>
    </Card>
  )
}