import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Notification {
  id: string;
  type: 'new_session' | 'new_message';
  title: string;
  description: string;
  timestamp: Date;
  read: boolean;
  sessionId?: string;
}

export function useRealtimeNotifications(userId: string | null) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    if (!userId) return;

    // Subscribe to new messages
    const messagesChannel = supabase
      .channel('messages_notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'conversation_messages'
        },
        async (payload) => {
          const message = payload.new as { session_id: string; role: string; content: string };
          
          // Only notify for assistant messages
          if (message.role !== 'assistant') return;

          // Check if this session belongs to the current user
          const { data: session } = await supabase
            .from('conversation_sessions')
            .select('user_id, title')
            .eq('id', message.session_id)
            .maybeSingle();

          if (session?.user_id !== userId) return;

          const notification: Notification = {
            id: crypto.randomUUID(),
            type: 'new_message',
            title: 'Nouveau message iAsted',
            description: message.content.substring(0, 50) + (message.content.length > 50 ? '...' : ''),
            timestamp: new Date(),
            read: false,
            sessionId: message.session_id
          };

          setNotifications(prev => [notification, ...prev].slice(0, 20));
          setUnreadCount(prev => prev + 1);

          toast({
            title: notification.title,
            description: notification.description,
            duration: 5000,
          });
        }
      )
      .subscribe();

    // Subscribe to new sessions
    const sessionsChannel = supabase
      .channel('sessions_notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'conversation_sessions',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          const session = payload.new as { id: string; title: string };

          const notification: Notification = {
            id: crypto.randomUUID(),
            type: 'new_session',
            title: 'Nouvelle conversation',
            description: session.title,
            timestamp: new Date(),
            read: false,
            sessionId: session.id
          };

          setNotifications(prev => [notification, ...prev].slice(0, 20));
          setUnreadCount(prev => prev + 1);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(messagesChannel);
      supabase.removeChannel(sessionsChannel);
    };
  }, [userId, toast]);

  const markAsRead = useCallback((notificationId: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
    setUnreadCount(0);
  }, []);

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearNotifications
  };
}
