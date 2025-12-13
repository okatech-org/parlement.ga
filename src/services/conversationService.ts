// Local storage service for conversation persistence (no Supabase tables needed)

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

const SESSIONS_KEY = 'iasted_conversation_sessions';
const MESSAGES_KEY = 'iasted_conversation_messages';

function getSessions(): ConversationSession[] {
  const stored = localStorage.getItem(SESSIONS_KEY);
  return stored ? JSON.parse(stored) : [];
}

function saveSessions(sessions: ConversationSession[]): void {
  localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
}

function getMessages(): ConversationMessage[] {
  const stored = localStorage.getItem(MESSAGES_KEY);
  return stored ? JSON.parse(stored) : [];
}

function saveMessages(messages: ConversationMessage[]): void {
  localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));
}

export const conversationService = {
  // Sessions
  async getActiveSession(userId: string): Promise<ConversationSession | null> {
    const sessions = getSessions();
    const dayAgo = Date.now() - 24 * 60 * 60 * 1000;
    return sessions.find(s => 
      s.user_id === userId && 
      s.is_active && 
      new Date(s.updated_at).getTime() > dayAgo
    ) || null;
  },

  async createSession(userId: string, title: string = 'Conversation iAsted'): Promise<ConversationSession> {
    const sessions = getSessions();
    const now = new Date().toISOString();
    const session: ConversationSession = {
      id: crypto.randomUUID(),
      user_id: userId,
      title,
      is_active: true,
      created_at: now,
      updated_at: now
    };
    sessions.push(session);
    saveSessions(sessions);
    return session;
  },

  async deactivateSession(sessionId: string): Promise<void> {
    const sessions = getSessions();
    const index = sessions.findIndex(s => s.id === sessionId);
    if (index !== -1) {
      sessions[index].is_active = false;
      sessions[index].updated_at = new Date().toISOString();
      saveSessions(sessions);
    }
  },

  // Messages
  async getSessionMessages(sessionId: string): Promise<ConversationMessage[]> {
    const messages = getMessages();
    return messages
      .filter(m => m.session_id === sessionId)
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
  },

  async saveMessage(message: Omit<ConversationMessage, 'created_at'>): Promise<ConversationMessage> {
    const messages = getMessages();
    const newMessage: ConversationMessage = {
      ...message,
      created_at: new Date().toISOString()
    };
    messages.push(newMessage);
    saveMessages(messages);
    
    // Update session timestamp
    const sessions = getSessions();
    const sessionIndex = sessions.findIndex(s => s.id === message.session_id);
    if (sessionIndex !== -1) {
      sessions[sessionIndex].updated_at = new Date().toISOString();
      saveSessions(sessions);
    }
    
    return newMessage;
  },

  async deleteMessage(messageId: string): Promise<void> {
    const messages = getMessages();
    saveMessages(messages.filter(m => m.id !== messageId));
  },

  async updateMessage(messageId: string, content: string): Promise<void> {
    const messages = getMessages();
    const index = messages.findIndex(m => m.id === messageId);
    if (index !== -1) {
      messages[index].content = content;
      saveMessages(messages);
    }
  },

  async deleteSessionMessages(sessionId: string): Promise<void> {
    const messages = getMessages();
    saveMessages(messages.filter(m => m.session_id !== sessionId));
  }
};
