import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Part } from '@/types/workOrder';
import { partsData } from '@/lib/parts-data';

const STORE_VERSION = 1;

interface InventoryItem extends Part {
  minStock: number;
  maxStock: number;
  location: string;
  supplier: string;
  lastRestocked: Date;
  reorderPoint: number;
  onOrder: number;
}

interface InventoryStore {
  version: number;
  initialized: boolean;
  items: InventoryItem[];
  transactions: InventoryTransaction[];
  initialize: () => void;
  updateStock: (id: string, quantity: number, type: 'increment' | 'decrement') => void;
  addItem: (item: Omit<InventoryItem, 'id'>) => void;
  updateItem: (id: string, updates: Partial<InventoryItem>) => void;
  removeItem: (id: string) => void;
  getLowStockItems: () => InventoryItem[];
  getItemById: (id: string) => InventoryItem | undefined;
  placeOrder: (items: { id: string; quantity: number }[]) => void;
  receiveOrder: (orderId: string) => void;
}

interface InventoryTransaction {
  id: string;
  itemId: string;
  type: 'in' | 'out' | 'adjustment';
  quantity: number;
  date: Date;
  workOrderId?: string;
  notes?: string;
}

export const useInventoryStore = create<InventoryStore>()(
  persist(
    (set, get) => ({
      version: STORE_VERSION,
      initialized: false,
      items: [],
      transactions: [],

      initialize: () => {
        const initialItems: InventoryItem[] = partsData.map(part => ({
          ...part,
          minStock: 5,
          maxStock: 50,
          location: 'Main Warehouse',
          supplier: 'Rainbow Distributors',
          lastRestocked: new Date(),
          reorderPoint: 10,
          onOrder: 0,
        }));
        set({ items: initialItems, initialized: true });
      },

      updateStock: (id, quantity, type) => {
        set(state => ({
          items: state.items.map(item =>
            item.id === id
              ? {
                  ...item,
                  quantity:
                    type === 'increment'
                      ? item.quantity + quantity
                      : item.quantity - quantity,
                }
              : item
          ),
          transactions: [
            ...state.transactions,
            {
              id: Date.now().toString(),
              itemId: id,
              type: type === 'increment' ? 'in' : 'out',
              quantity,
              date: new Date(),
            },
          ],
        }));
      },

      addItem: (item) => {
        const id = Date.now().toString();
        set(state => ({
          items: [...state.items, { ...item, id }],
        }));
      },

      updateItem: (id, updates) => {
        set(state => ({
          items: state.items.map(item =>
            item.id === id ? { ...item, ...updates } : item
          ),
        }));
      },

      removeItem: (id) => {
        set(state => ({
          items: state.items.filter(item => item.id !== id),
        }));
      },

      getLowStockItems: () => {
        const { items } = get();
        return items.filter(item => item.quantity <= item.reorderPoint);
      },

      getItemById: (id) => {
        return get().items.find(item => item.id === id);
      },

      placeOrder: (items) => {
        set(state => ({
          items: state.items.map(item => {
            const orderItem = items.find(i => i.id === item.id);
            if (orderItem) {
              return {
                ...item,
                onOrder: item.onOrder + orderItem.quantity,
              };
            }
            return item;
          }),
        }));
      },

      receiveOrder: (orderId) => {
        // Implementation for receiving orders
      },
    }),
    {
      name: 'inventory-storage',
      version: STORE_VERSION,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        version: state.version,
        initialized: state.initialized,
        items: state.items,
        transactions: state.transactions,
      }),
      migrate: (persistedState: any, version) => {
        if (version === 0) {
          return {
            ...persistedState,
            version: STORE_VERSION,
            initialized: false,
            transactions: [],
            items: persistedState.items?.map((item: any) => ({
              ...item,
              lastRestocked: item.lastRestocked ? new Date(item.lastRestocked) : new Date(),
              onOrder: item.onOrder || 0,
              minStock: item.minStock || 5,
              maxStock: item.maxStock || 50,
              reorderPoint: item.reorderPoint || 10,
              location: item.location || 'Main Warehouse',
              supplier: item.supplier || 'Rainbow Distributors',
            })) || [],
          };
        }
        return persistedState as InventoryStore;
      },
    }
  )
);