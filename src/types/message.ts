interface MessageTag {
  id: string;
  type: 'work-order' | 'training' | 'general' | 'urgent' | 'payroll';
  value: string;
  label: string;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'admin' | 'technician';
  recipientId?: string;
  content: string;
  timestamp: Date;
  tags: MessageTag[];
  workOrderId?: string;
  readStatus: boolean;
  attachments?: {
    id: string;
    type: 'image' | 'document';
    url: string;
    name: string;
  }[];
}

export interface Conversation {
  id: string;
  participants: {
    id: string;
    name: string;
    role: 'admin' | 'technician';
  }[];
  messages: Message[];
  lastMessage?: Message;
  unreadCount: number;
  tags: MessageTag[];
  workOrderId?: string;
  createdAt: Date;
  updatedAt: Date;
}