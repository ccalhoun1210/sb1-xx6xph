import { useState, useEffect } from 'react';
import { ref, onValue, push, set } from 'firebase/database';
import { database } from '@/lib/firebase';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export function useSocket() {
  const [isConnected, setIsConnected] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!user?.companyId) return;

    // Monitor connection state
    const connectedRef = ref(database, '.info/connected');
    const unsubscribe = onValue(connectedRef, (snap) => {
      const connected = snap.val();
      setIsConnected(connected);
      
      if (connected) {
        toast({
          title: 'Connected',
          description: 'Real-time connection established',
        });
      } else {
        toast({
          title: 'Disconnected',
          description: 'Real-time connection lost',
          variant: 'destructive',
        });
      }
    });

    return () => {
      unsubscribe();
    };
  }, [user?.companyId, toast]);

  const sendMessage = async (workOrderId: string, text: string) => {
    if (!user?.companyId || !isConnected) {
      throw new Error('Not connected');
    }

    try {
      const messagesRef = ref(database, `messages/${user.companyId}/${workOrderId}`);
      await push(messagesRef, {
        text,
        senderId: user.id,
        timestamp: Date.now(),
      });
      return true;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  };

  const sendTypingIndicator = async (workOrderId: string) => {
    if (!user?.companyId || !isConnected) return;

    try {
      const typingRef = ref(
        database,
        `typing/${user.companyId}/${workOrderId}/${user.id}`
      );
      await set(typingRef, true);
      // Remove typing indicator after 1 second
      setTimeout(() => {
        set(typingRef, false).catch(console.error);
      }, 1000);
    } catch (error) {
      console.error('Error sending typing indicator:', error);
    }
  };

  return {
    isConnected,
    sendMessage,
    sendTypingIndicator,
  };
}