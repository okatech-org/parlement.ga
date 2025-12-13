// Messaging types

export interface Message {
  id: string;
  sender_id: string;
  senderId?: string; // Alias for compatibility
  recipient_id: string;
  recipientId?: string; // Alias for compatibility
  subject?: string;
  content: string;
  read: boolean;
  attachments?: any[];
  created_at: string;
  createdAt?: string; // Alias for compatibility
  updated_at: string;
}

export interface Conversation {
  id: string;
  subject?: string;
  participants: string[];
  last_message?: Message;
  unread_count?: number;
  is_starred?: boolean;
  is_archived?: boolean;
  created_at: string;
  updated_at: string;
}

export interface MessageThread {
  id: string;
  messages: Message[];
  participants: string[];
}
