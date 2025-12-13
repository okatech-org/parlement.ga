// Offline sync service for iAsted conversations
import { supabase } from '@/integrations/supabase/client';

const OFFLINE_MESSAGES_KEY = 'iasted_offline_messages';
const OFFLINE_QUEUE_KEY = 'iasted_sync_queue';

interface OfflineMessage {
  id: string;
  session_id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  synced: boolean;
}

interface SyncQueueItem {
  id: string;
  type: 'message';
  data: any;
  createdAt: string;
  retryCount: number;
}

class OfflineSyncService {
  private isOnline: boolean = navigator.onLine;
  private syncInProgress: boolean = false;
  private listeners: Set<(online: boolean) => void> = new Set();

  constructor() {
    this.setupEventListeners();
    this.attemptSync();
  }

  private setupEventListeners() {
    window.addEventListener('online', () => {
      console.log('[OfflineSync] Back online');
      this.isOnline = true;
      this.notifyListeners();
      this.attemptSync();
    });

    window.addEventListener('offline', () => {
      console.log('[OfflineSync] Gone offline');
      this.isOnline = false;
      this.notifyListeners();
    });
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.isOnline));
  }

  onStatusChange(callback: (online: boolean) => void) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  getOnlineStatus(): boolean {
    return this.isOnline;
  }

  // Save message locally
  saveMessageLocally(message: Omit<OfflineMessage, 'synced'>): void {
    const messages = this.getLocalMessages();
    const newMessage: OfflineMessage = {
      ...message,
      synced: this.isOnline
    };
    messages.push(newMessage);
    localStorage.setItem(OFFLINE_MESSAGES_KEY, JSON.stringify(messages));

    if (!this.isOnline) {
      this.addToSyncQueue({
        id: message.id,
        type: 'message',
        data: message,
        createdAt: new Date().toISOString(),
        retryCount: 0
      });
    }
  }

  // Get all local messages
  getLocalMessages(): OfflineMessage[] {
    try {
      const stored = localStorage.getItem(OFFLINE_MESSAGES_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  // Get messages for a specific session
  getSessionMessages(sessionId: string): OfflineMessage[] {
    return this.getLocalMessages().filter(m => m.session_id === sessionId);
  }

  // Get unsynced messages count
  getUnsyncedCount(): number {
    return this.getLocalMessages().filter(m => !m.synced).length;
  }

  // Add item to sync queue
  private addToSyncQueue(item: SyncQueueItem): void {
    const queue = this.getSyncQueue();
    queue.push(item);
    localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(queue));
  }

  // Get sync queue
  private getSyncQueue(): SyncQueueItem[] {
    try {
      const stored = localStorage.getItem(OFFLINE_QUEUE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  // Clear sync queue
  private clearSyncQueue(): void {
    localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify([]));
  }

  // Mark message as synced
  private markAsSynced(messageId: string): void {
    const messages = this.getLocalMessages();
    const updated = messages.map(m => 
      m.id === messageId ? { ...m, synced: true } : m
    );
    localStorage.setItem(OFFLINE_MESSAGES_KEY, JSON.stringify(updated));
  }

  // Attempt to sync pending items
  async attemptSync(): Promise<{ synced: number; failed: number }> {
    if (!this.isOnline || this.syncInProgress) {
      return { synced: 0, failed: 0 };
    }

    this.syncInProgress = true;
    const queue = this.getSyncQueue();
    let synced = 0;
    let failed = 0;

    console.log(`[OfflineSync] Starting sync of ${queue.length} items`);

    for (const item of queue) {
      try {
        if (item.type === 'message') {
          const { error } = await (supabase as any)
            .from('conversation_messages')
            .upsert({
              id: item.data.id,
              session_id: item.data.session_id,
              role: item.data.role,
              content: item.data.content,
              created_at: item.data.timestamp
            });

          if (error) {
            console.error('[OfflineSync] Failed to sync message:', error);
            failed++;
            item.retryCount++;
          } else {
            this.markAsSynced(item.data.id);
            synced++;
          }
        }
      } catch (error) {
        console.error('[OfflineSync] Sync error:', error);
        failed++;
        item.retryCount++;
      }
    }

    // Keep failed items with retry count < 5
    const remainingQueue = queue.filter(item => 
      !this.getLocalMessages().find(m => m.id === item.id && m.synced) && 
      item.retryCount < 5
    );
    localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(remainingQueue));

    this.syncInProgress = false;
    console.log(`[OfflineSync] Sync complete: ${synced} synced, ${failed} failed`);

    return { synced, failed };
  }

  // Clear all local data
  clearLocalData(): void {
    localStorage.removeItem(OFFLINE_MESSAGES_KEY);
    localStorage.removeItem(OFFLINE_QUEUE_KEY);
  }

  // Get storage usage
  getStorageUsage(): { used: number; items: number } {
    const messages = localStorage.getItem(OFFLINE_MESSAGES_KEY) || '';
    const queue = localStorage.getItem(OFFLINE_QUEUE_KEY) || '';
    return {
      used: messages.length + queue.length,
      items: this.getLocalMessages().length
    };
  }
}

export const offlineSyncService = new OfflineSyncService();
