// Push Notification Service for Web Push
const VAPID_PUBLIC_KEY = 'BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3qBUYIHBQFLXYp5Nksh8U';

interface NotificationPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  data?: Record<string, any>;
}

class PushNotificationService {
  private registration: ServiceWorkerRegistration | null = null;
  private subscription: PushSubscription | null = null;

  async init(): Promise<boolean> {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      console.warn('[Push] Push notifications not supported');
      return false;
    }

    try {
      // Register service worker
      this.registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      });
      console.log('[Push] Service worker registered:', this.registration);

      // Wait for the service worker to be ready
      await navigator.serviceWorker.ready;
      console.log('[Push] Service worker ready');

      return true;
    } catch (error) {
      console.error('[Push] Error registering service worker:', error);
      return false;
    }
  }

  async requestPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      console.warn('[Push] Notifications not supported');
      return 'denied';
    }

    const permission = await Notification.requestPermission();
    console.log('[Push] Permission:', permission);
    return permission;
  }

  async subscribe(): Promise<PushSubscription | null> {
    if (!this.registration) {
      console.warn('[Push] Service worker not registered');
      return null;
    }

    try {
      // Check existing subscription
      this.subscription = await this.registration.pushManager.getSubscription();
      
      if (this.subscription) {
        console.log('[Push] Existing subscription found');
        return this.subscription;
      }

      // Create new subscription
      this.subscription = await this.registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(VAPID_PUBLIC_KEY) as BufferSource
      });

      console.log('[Push] New subscription created:', this.subscription);
      return this.subscription;
    } catch (error) {
      console.error('[Push] Error subscribing:', error);
      return null;
    }
  }

  async unsubscribe(): Promise<boolean> {
    if (!this.subscription) {
      return true;
    }

    try {
      await this.subscription.unsubscribe();
      this.subscription = null;
      console.log('[Push] Unsubscribed successfully');
      return true;
    } catch (error) {
      console.error('[Push] Error unsubscribing:', error);
      return false;
    }
  }

  async getSubscription(): Promise<PushSubscription | null> {
    if (!this.registration) {
      return null;
    }
    return this.registration.pushManager.getSubscription();
  }

  isSupported(): boolean {
    return 'serviceWorker' in navigator && 'PushManager' in window;
  }

  getPermissionStatus(): NotificationPermission {
    if (!('Notification' in window)) {
      return 'denied';
    }
    return Notification.permission;
  }

  // Show local notification (for testing or when app is open)
  async showLocalNotification(payload: NotificationPayload): Promise<void> {
    if (!this.registration) {
      // Fallback to browser Notification API
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(payload.title, {
          body: payload.body,
          icon: payload.icon || '/favicon.ico',
          badge: payload.badge || '/favicon.ico',
          tag: payload.tag || 'iasted-notification',
          data: payload.data
        });
      }
      return;
    }

    await this.registration.showNotification(payload.title, {
      body: payload.body,
      icon: payload.icon || '/favicon.ico',
      badge: payload.badge || '/favicon.ico',
      tag: payload.tag || 'iasted-notification',
      data: payload.data,
      requireInteraction: false
    });
  }

  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }
}

export const pushNotificationService = new PushNotificationService();
