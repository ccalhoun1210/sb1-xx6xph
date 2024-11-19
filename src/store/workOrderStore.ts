import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { WorkOrder } from '@/types/workOrder';
import * as workOrderApi from '@/lib/api/work-orders';

const STORE_VERSION = 1;

interface WorkOrderStore {
  version: number;
  initialized: boolean;
  currentWorkOrder: WorkOrder | null;
  workOrders: WorkOrder[];
  isLoading: boolean;
  error: string | null;
  initialize: () => void;
  setCurrentWorkOrder: (workOrder: WorkOrder | null) => void;
  createWorkOrder: () => Promise<void>;
  updateWorkOrder: (updates: Partial<WorkOrder>) => void;
  saveWorkOrder: () => Promise<void>;
  getWorkOrder: (id: string) => Promise<WorkOrder | null>;
  deleteWorkOrder: (id: string) => Promise<void>;
  fetchWorkOrders: () => Promise<void>;
}

export const useWorkOrderStore = create<WorkOrderStore>()(
  persist(
    (set, get) => ({
      version: STORE_VERSION,
      initialized: false,
      currentWorkOrder: null,
      workOrders: [],
      isLoading: false,
      error: null,

      initialize: () => set({ initialized: true }),

      setCurrentWorkOrder: (workOrder) => set({ currentWorkOrder: workOrder }),

      createWorkOrder: async () => {
        set({ isLoading: true, error: null });
        try {
          const newWorkOrder = await workOrderApi.createWorkOrder({});
          set({ 
            currentWorkOrder: newWorkOrder,
            workOrders: [...get().workOrders, newWorkOrder],
            isLoading: false,
          });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to create work order',
            isLoading: false 
          });
          throw error;
        }
      },

      updateWorkOrder: (updates) => {
        const { currentWorkOrder } = get();
        if (!currentWorkOrder) return;

        const updatedWorkOrder = { ...currentWorkOrder, ...updates };
        set({ 
          currentWorkOrder: updatedWorkOrder,
          workOrders: get().workOrders.map(wo => 
            wo.id === updatedWorkOrder.id ? updatedWorkOrder : wo
          )
        });
      },

      saveWorkOrder: async () => {
        const { currentWorkOrder } = get();
        if (!currentWorkOrder) return;

        set({ isLoading: true, error: null });
        try {
          const savedWorkOrder = await workOrderApi.updateWorkOrder(currentWorkOrder.id, currentWorkOrder);
          set((state) => ({
            workOrders: [
              ...state.workOrders.filter((wo) => wo.id !== savedWorkOrder.id),
              savedWorkOrder,
            ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
            currentWorkOrder: savedWorkOrder,
            isLoading: false,
          }));
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to save work order',
            isLoading: false 
          });
          throw error;
        }
      },

      getWorkOrder: async (id) => {
        set({ isLoading: true, error: null });
        try {
          const workOrder = await workOrderApi.getWorkOrder(id);
          set({ isLoading: false });
          return workOrder;
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to get work order',
            isLoading: false 
          });
          return null;
        }
      },

      deleteWorkOrder: async (id) => {
        set({ isLoading: true, error: null });
        try {
          await workOrderApi.deleteWorkOrder(id);
          set((state) => ({
            workOrders: state.workOrders.filter((wo) => wo.id !== id),
            currentWorkOrder: state.currentWorkOrder?.id === id ? null : state.currentWorkOrder,
            isLoading: false,
          }));
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to delete work order',
            isLoading: false 
          });
          throw error;
        }
      },

      fetchWorkOrders: async () => {
        set({ isLoading: true, error: null });
        try {
          const workOrders = await workOrderApi.getWorkOrders();
          set({ 
            workOrders, 
            isLoading: false,
          });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to fetch work orders',
            isLoading: false 
          });
          throw error;
        }
      },
    }),
    {
      name: 'work-order-storage',
      version: STORE_VERSION,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        version: state.version,
        initialized: state.initialized,
        workOrders: state.workOrders,
        currentWorkOrder: state.currentWorkOrder,
      }),
      migrate: (persistedState: any, version) => {
        if (version === 0) {
          return {
            ...persistedState,
            version: STORE_VERSION,
            initialized: false,
            error: null,
            isLoading: false,
            workOrders: persistedState.workOrders?.map((wo: any) => ({
              ...wo,
              createdAt: wo.createdAt || new Date().toISOString(),
              updatedAt: wo.updatedAt || new Date().toISOString(),
              status: wo.status || 'scheduled',
              priority: wo.priority || 'medium',
              serviceType: wo.serviceType || 'maintenance',
              service: {
                ...wo.service,
                laborTime: wo.service?.laborTime || 0,
                laborRate: wo.service?.laborRate || 85,
                selectedParts: wo.service?.selectedParts || [],
                photos: wo.service?.photos || [],
              },
              billing: {
                ...wo.billing,
                paymentStatus: wo.billing?.paymentStatus || 'unpaid',
                customerRating: wo.billing?.customerRating || 0,
              },
            })) || [],
          };
        }
        return persistedState as WorkOrderStore;
      },
    }
  )
);