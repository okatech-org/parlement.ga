import React from 'react';
import { Bell, Check, Trash2, FileText, Users, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ParliamentaryNotification } from '@/hooks/useParliamentaryNotifications';

interface NotificationCenterProps {
  notifications: ParliamentaryNotification[];
  unreadCount: number;
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onClear: () => void;
  onNotificationClick?: (notification: ParliamentaryNotification) => void;
}

export function NotificationCenter({
  notifications,
  unreadCount,
  onMarkAsRead,
  onMarkAllAsRead,
  onClear,
  onNotificationClick
}: NotificationCenterProps) {
  const getIcon = (type: ParliamentaryNotification['type'], status?: string) => {
    if (type === 'status_change') {
      if (status === 'adopte') return <CheckCircle className="w-4 h-4 text-green-500" />;
      if (status === 'rejete') return <XCircle className="w-4 h-4 text-red-500" />;
      return <FileText className="w-4 h-4 text-amber-500" />;
    }
    if (type === 'new_cosignature') return <Users className="w-4 h-4 text-blue-500" />;
    return <FileText className="w-4 h-4 text-primary" />;
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center animate-pulse">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0" align="end">
        <div className="flex items-center justify-between p-3 border-b border-border bg-muted/50">
          <h4 className="font-semibold text-sm flex items-center gap-2">
            <Bell className="w-4 h-4 text-primary" />
            Centre de notifications
          </h4>
          <div className="flex gap-1">
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onMarkAllAsRead}
                className="h-7 text-xs"
              >
                <Check className="w-3 h-3 mr-1" />
                Tout lu
              </Button>
            )}
            {notifications.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClear}
                className="h-7 text-xs text-muted-foreground"
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            )}
          </div>
        </div>
        
        <ScrollArea className="h-[400px]">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <Bell className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm">Aucune notification</p>
              <p className="text-xs mt-1">Les mises à jour des amendements apparaîtront ici</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {notifications.map((notification) => (
                <button
                  key={notification.id}
                  onClick={() => {
                    if (!notification.read) {
                      onMarkAsRead(notification.id);
                    }
                    onNotificationClick?.(notification);
                  }}
                  className={`w-full text-left p-4 hover:bg-muted/50 transition-colors ${
                    !notification.read ? 'bg-primary/5' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`mt-0.5 p-2 rounded-full ${
                      !notification.read ? 'bg-primary/10' : 'bg-muted'
                    }`}>
                      {getIcon(notification.type, notification.metadata?.status)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium ${!notification.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {notification.title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {notification.description}
                      </p>
                      {notification.metadata?.votePour !== undefined && (
                        <p className="text-xs mt-1">
                          <span className="text-green-600">{notification.metadata.votePour} pour</span>
                          {' / '}
                          <span className="text-red-600">{notification.metadata.voteContre} contre</span>
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground/70 mt-2">
                        {formatDistanceToNow(notification.timestamp, {
                          addSuffix: true,
                          locale: fr
                        })}
                      </p>
                    </div>
                    {!notification.read && (
                      <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-2" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
