import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface ParliamentaryNotification {
  id: string;
  type: 'status_change' | 'new_cosignature' | 'new_amendment';
  title: string;
  description: string;
  timestamp: Date;
  read: boolean;
  metadata?: {
    amendmentId?: string;
    status?: string;
    votePour?: number;
    voteContre?: number;
  };
}

const STORAGE_KEY = 'parliamentary_notifications';

export function useParliamentaryNotifications(userId: string | null) {
  const [notifications, setNotifications] = useState<ParliamentaryNotification[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed.map((n: any) => ({ ...n, timestamp: new Date(n.timestamp) }));
      }
    } catch (e) {
      console.error('Error loading notifications:', e);
    }
    return [];
  });
  const [unreadCount, setUnreadCount] = useState(0);

  // Persist notifications to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
    setUnreadCount(notifications.filter(n => !n.read).length);
  }, [notifications]);

  const addNotification = useCallback((notification: Omit<ParliamentaryNotification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: ParliamentaryNotification = {
      ...notification,
      id: crypto.randomUUID(),
      timestamp: new Date(),
      read: false
    };
    setNotifications(prev => [newNotification, ...prev].slice(0, 50));
  }, []);

  // Subscribe to realtime changes
  useEffect(() => {
    const channel = supabase
      .channel('parliamentary-notifications')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'amendments'
        },
        (payload) => {
          const updated = payload.new as any;
          const old = payload.old as any;
          
          if (old.status !== updated.status) {
            const statusLabels: Record<string, string> = {
              'adopte': 'adopté',
              'rejete': 'rejeté',
              'en_examen': 'en examen',
              'retire': 'retiré'
            };
            
            addNotification({
              type: 'status_change',
              title: updated.status === 'adopte' ? '✅ Amendement adopté' : 
                     updated.status === 'rejete' ? '❌ Amendement rejeté' : 
                     `📋 Statut modifié`,
              description: `${updated.project_law_id} Art.${updated.article_number} - ${statusLabels[updated.status] || updated.status}`,
              metadata: {
                amendmentId: updated.id,
                status: updated.status,
                votePour: updated.vote_pour,
                voteContre: updated.vote_contre
              }
            });
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'amendments'
        },
        (payload) => {
          const newAmendment = payload.new as any;
          addNotification({
            type: 'new_amendment',
            title: '📝 Nouvel amendement déposé',
            description: `${newAmendment.project_law_id} Art.${newAmendment.article_number}`,
            metadata: {
              amendmentId: newAmendment.id
            }
          });
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'amendment_cosignatures'
        },
        async (payload) => {
          const newCosig = payload.new as any;
          
          // Fetch amendment details
          const { data: amendment } = await supabase
            .from('amendments')
            .select('project_law_id, article_number, author_id')
            .eq('id', newCosig.amendment_id)
            .maybeSingle();
          
          if (amendment && amendment.author_id === userId) {
            addNotification({
              type: 'new_cosignature',
              title: '✍️ Nouvelle co-signature',
              description: `Votre amendement ${amendment.project_law_id} Art.${amendment.article_number} a reçu une nouvelle co-signature`,
              metadata: {
                amendmentId: newCosig.amendment_id
              }
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, addNotification]);

  const markAsRead = useCallback((notificationId: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearNotifications,
    addNotification
  };
}
