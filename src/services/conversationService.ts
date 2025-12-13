// Supabase-based conversation persistence service
import { supabase } from '@/integrations/supabase/client';

export interface ConversationMessage {
  id: string;
  session_id: string;
  role: 'user' | 'assistant';
  content: string;
  metadata?: Record<string, any>;
  created_at: string;
}

export interface ConversationSession {
  id: string;
  user_id: string;
  title: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Type-safe helper for tables
const db = supabase as any;

export const conversationService = {
  // Sessions
  async getActiveSession(userId: string): Promise<ConversationSession | null> {
    const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    
    const { data, error } = await db
      .from('conversation_sessions')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .gte('updated_at', dayAgo)
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    
    if (error) {
      console.error('Error fetching active session:', error);
      return null;
    }
    
    return data;
  },

  async createSession(userId: string, title: string = 'Conversation iAsted'): Promise<ConversationSession | null> {
    const { data, error } = await db
      .from('conversation_sessions')
      .insert({
        user_id: userId,
        title,
        is_active: true
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating session:', error);
      return null;
    }
    
    return data;
  },

  async deactivateSession(sessionId: string): Promise<void> {
    const { error } = await db
      .from('conversation_sessions')
      .update({ is_active: false })
      .eq('id', sessionId);
    
    if (error) {
      console.error('Error deactivating session:', error);
    }
  },

  async getUserSessions(userId: string): Promise<ConversationSession[]> {
    const { data, error } = await db
      .from('conversation_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching user sessions:', error);
      return [];
    }
    
    return data || [];
  },

  // Messages
  async getSessionMessages(sessionId: string): Promise<ConversationMessage[]> {
    const { data, error } = await db
      .from('conversation_messages')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true });
    
    if (error) {
      console.error('Error fetching session messages:', error);
      return [];
    }
    
    return data || [];
  },

  async saveMessage(message: Omit<ConversationMessage, 'created_at'>): Promise<ConversationMessage | null> {
    const { data, error } = await db
      .from('conversation_messages')
      .insert({
        id: message.id,
        session_id: message.session_id,
        role: message.role,
        content: message.content,
        metadata: message.metadata
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error saving message:', error);
      return null;
    }
    
    // Update session timestamp
    await db
      .from('conversation_sessions')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', message.session_id);
    
    return data;
  },

  async deleteMessage(messageId: string): Promise<void> {
    const { error } = await db
      .from('conversation_messages')
      .delete()
      .eq('id', messageId);
    
    if (error) {
      console.error('Error deleting message:', error);
    }
  },

  async updateMessage(messageId: string, content: string): Promise<void> {
    // Note: conversation_messages doesn't have an update policy by design
    // If needed, delete and recreate the message
    console.warn('Message update not supported - messages are immutable');
  },

  async deleteSessionMessages(sessionId: string): Promise<void> {
    const { error } = await db
      .from('conversation_messages')
      .delete()
      .eq('session_id', sessionId);
    
    if (error) {
      console.error('Error deleting session messages:', error);
    }
  }
};
