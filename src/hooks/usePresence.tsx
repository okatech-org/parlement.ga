import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface PresenceUser {
  id: string;
  email?: string;
  name?: string;
  online_at: string;
  status: 'online' | 'away' | 'busy';
}

export interface UsePresenceReturn {
  onlineUsers: PresenceUser[];
  isTracking: boolean;
  userCount: number;
  updateStatus: (status: 'online' | 'away' | 'busy') => Promise<void>;
}

export const usePresence = (userId?: string, userName?: string): UsePresenceReturn => {
  const [onlineUsers, setOnlineUsers] = useState<PresenceUser[]>([]);
  const [isTracking, setIsTracking] = useState(false);

  const updateStatus = useCallback(async (status: 'online' | 'away' | 'busy') => {
    const channel = supabase.channel('iasted-presence');
    await channel.track({
      id: userId || 'anonymous',
      name: userName || 'Utilisateur',
      online_at: new Date().toISOString(),
      status,
    });
  }, [userId, userName]);

  useEffect(() => {
    if (!userId) return;

    const channel = supabase.channel('iasted-presence');

    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        const users: PresenceUser[] = [];
        
        Object.keys(state).forEach((key) => {
          const presences = state[key] as any[];
          presences.forEach((presence) => {
            if (presence.id !== userId) {
              users.push({
                id: presence.id,
                email: presence.email,
                name: presence.name,
                online_at: presence.online_at,
                status: presence.status || 'online',
              });
            }
          });
        });
        
        setOnlineUsers(users);
      })
      .on('presence', { event: 'join' }, ({ newPresences }) => {
        console.log('User joined:', newPresences);
      })
      .on('presence', { event: 'leave' }, ({ leftPresences }) => {
        console.log('User left:', leftPresences);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          setIsTracking(true);
          await channel.track({
            id: userId,
            name: userName || 'Utilisateur',
            online_at: new Date().toISOString(),
            status: 'online',
          });
        }
      });

    return () => {
      channel.unsubscribe();
      setIsTracking(false);
    };
  }, [userId, userName]);

  return {
    onlineUsers,
    isTracking,
    userCount: onlineUsers.length + 1,
    updateStatus,
  };
};
