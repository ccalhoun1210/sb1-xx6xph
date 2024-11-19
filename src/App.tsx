import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { useAppStore } from '@/store';
import { useAuth } from '@/hooks/useAuth';
import { useWorkOrderStore } from '@/store/workOrderStore';
import { useInventoryStore } from '@/store/inventoryStore';
import { useChatStore } from '@/store/chatStore';
import { useRealtimeSubscription } from '@/hooks/useRealtimeSubscription';

export default function App() {
  const { initialize } = useAppStore();
  const { user } = useAuth();
  const { initialize: initWorkOrders } = useWorkOrderStore();
  const { initialize: initInventory } = useInventoryStore();
  const { initialize: initChat } = useChatStore();

  // Set up realtime subscriptions
  useRealtimeSubscription();

  useEffect(() => {
    // Initialize app state
    initialize();

    // Initialize other stores if user is authenticated
    if (user) {
      initWorkOrders();
      initInventory();
      initChat();
    }
  }, [initialize, user, initWorkOrders, initInventory, initChat]);

  return (
    <>
      <Outlet />
      <Toaster />
    </>
  );
}