import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Message, Conversation } from '@/types/message';

const STORE_VERSION = 1;

interface ChatStore {
  version: number;
  initialized: boolean;
  conversations: Conversation[];
  activeConversation: string | null;
  initialize: () => void;
  addMessage: (message: Message) => void;
  markAsRead: (conversationId: string) => void;
  createConversation: (participants: Conversation['participants'], tags: Conversation['tags']) => string;
  getConversation: (id: string) => Conversation | undefined;
  getConversationsByTag: (tagType: string, tagValue?: string) => Conversation[];
  getUnreadCount: () => number;
  deleteConversation: (id: string) => void;
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      version: STORE_VERSION,
      initialized: false,
      conversations: [],
      activeConversation: null,

      initialize: () => set({ initialized: true }),

      addMessage: (message) => {
        set((state) => {
          const conversation = state.conversations.find(
            (c) => c.id === message.workOrderId || 
                  c.participants.some(p => p.id === message.recipientId)
          );

          if (!conversation) {
            // Create new conversation if none exists
            const newConversation: Conversation = {
              id: Date.now().toString(),
              participants: [
                {
                  id: message.senderId,
                  name: message.senderName,
                  role: message.senderRole,
                },
                message.recipientId ? {
                  id: message.recipientId,
                  name: '', // This should be fetched from user store
                  role: message.senderRole === 'admin' ? 'technician' : 'admin',
                } : null,
              ].filter(Boolean) as Conversation['participants'],
              messages: [message],
              unreadCount: 1,
              tags: message.tags,
              workOrderId: message.workOrderId,
              createdAt: new Date(),
              updatedAt: new Date(),
            };

            return {
              conversations: [...state.conversations, newConversation],
            };
          }

          return {
            conversations: state.conversations.map((conv) =>
              conv.id === conversation.id
                ? {
                    ...conv,
                    messages: [...conv.messages, message],
                    lastMessage: message,
                    unreadCount: conv.unreadCount + 1,
                    updatedAt: new Date(),
                  }
                : conv
            ),
          };
        });
      },

      markAsRead: (conversationId) => {
        set((state) => ({
          conversations: state.conversations.map((conv) =>
            conv.id === conversationId
              ? {
                  ...conv,
                  unreadCount: 0,
                  messages: conv.messages.map((msg) => ({
                    ...msg,
                    readStatus: true,
                  })),
                }
              : conv
          ),
        }));
      },

      createConversation: (participants, tags) => {
        const id = Date.now().toString();
        set((state) => ({
          conversations: [
            ...state.conversations,
            {
              id,
              participants,
              messages: [],
              unreadCount: 0,
              tags,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ],
        }));
        return id;
      },

      getConversation: (id) => {
        return get().conversations.find((conv) => conv.id === id);
      },

      getConversationsByTag: (tagType, tagValue) => {
        return get().conversations.filter((conv) =>
          conv.tags.some(
            (tag) => tag.type === tagType && (!tagValue || tag.value === tagValue)
          )
        );
      },

      getUnreadCount: () => {
        return get().conversations.reduce(
          (sum, conv) => sum + conv.unreadCount,
          0
        );
      },

      deleteConversation: (id) => {
        set((state) => ({
          conversations: state.conversations.filter((conv) => conv.id !== id),
        }));
      },
    }),
    {
      name: 'chat-storage',
      version: STORE_VERSION,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        version: state.version,
        initialized: state.initialized,
        conversations: state.conversations,
        activeConversation: state.activeConversation,
      }),
      migrate: (persistedState: any, version) => {
        if (version === 0) {
          return {
            ...persistedState,
            version: STORE_VERSION,
            initialized: false,
            conversations: persistedState.conversations?.map((conv: any) => ({
              ...conv,
              createdAt: conv.createdAt ? new Date(conv.createdAt) : new Date(),
              updatedAt: conv.updatedAt ? new Date(conv.updatedAt) : new Date(),
              unreadCount: conv.unreadCount || 0,
              messages: conv.messages?.map((msg: any) => ({
                ...msg,
                timestamp: msg.timestamp ? new Date(msg.timestamp) : new Date(),
                readStatus: msg.readStatus || false,
                tags: msg.tags || [],
              })) || [],
              tags: conv.tags || [],
            })) || [],
          };
        }
        return persistedState as ChatStore;
      },
    }
  )
);