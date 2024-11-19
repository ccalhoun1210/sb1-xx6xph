import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as workOrderApi from '@/lib/api/work-orders';
import * as customerApi from '@/lib/api/customers';
import * as machineApi from '@/lib/api/machines';
import { useToast } from './use-toast';

export function useWorkOrders() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['workOrders'],
    queryFn: workOrderApi.getWorkOrders,
  });

  const createMutation = useMutation({
    mutationFn: workOrderApi.createWorkOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workOrders'] });
      toast({
        title: 'Success',
        description: 'Work order created successfully',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: any }) =>
      workOrderApi.updateWorkOrder(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workOrders'] });
      toast({
        title: 'Success',
        description: 'Work order updated successfully',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  return {
    workOrders: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
    createWorkOrder: createMutation.mutate,
    updateWorkOrder: updateMutation.mutate,
  };
}

export function useCustomers() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['customers'],
    queryFn: customerApi.getCustomers,
  });

  const createMutation = useMutation({
    mutationFn: customerApi.createCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      toast({
        title: 'Success',
        description: 'Customer created successfully',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  return {
    customers: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
    createCustomer: createMutation.mutate,
  };
}

export function useMachines() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['machines'],
    queryFn: machineApi.getMachines,
  });

  const createMutation = useMutation({
    mutationFn: machineApi.createMachine,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['machines'] });
      toast({
        title: 'Success',
        description: 'Machine registered successfully',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  return {
    machines: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
    createMachine: createMutation.mutate,
  };
}