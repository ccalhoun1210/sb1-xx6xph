import { useEffect } from 'react';
import { ref, onValue, onDisconnect } from 'firebase/database';
import { database } from '@/lib/firebase';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export function useRealtimeSubscription() {
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!user?.companyId) return;

    try {
      // Set up presence
      const presenceRef = ref(database, `presence/${user.companyId}/${user.id}`);
      const connectedRef = ref(database, '.info/connected');

      const unsubscribe = onValue(connectedRef, (snap) => {
        if (snap.val() === true) {
          // Client is connected
          onDisconnect(presenceRef).remove();
          presenceRef.set({
            online: true,
            lastSeen: Date.now()
          });
        }
      });

      // Subscribe to work order updates
      const workOrdersRef = ref(database, `workOrders/${user.companyId}`);
      const workOrdersUnsubscribe = onValue(workOrdersRef, (snapshot) => {
        if (snapshot.exists()) {
          // Handle work order updates
          const updates = snapshot.val();
          // Update your local state here
        }
      });

      return () => {
        unsubscribe();
        workOrdersUnsubscribe();
        // Set offline when component unmounts
        presenceRef.set({
          online: false,
          lastSeen: Date.now()
        });
      };
    } catch (error) {
      toast({
        title: 'Connection Error',
        description: error instanceof Error ? error.message : 'Failed to establish realtime connection',
        variant: 'destructive',
      });
    }
  }, [user?.companyId, user?.id, toast]);
}