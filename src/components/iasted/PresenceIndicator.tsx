import React from 'react';
import { Users, Circle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { usePresence, PresenceUser } from '@/hooks/usePresence';

interface PresenceIndicatorProps {
  userId?: string;
  userName?: string;
  compact?: boolean;
}

const statusColors = {
  online: 'bg-success',
  away: 'bg-warning',
  busy: 'bg-destructive',
};

const statusLabels = {
  online: 'En ligne',
  away: 'Absent',
  busy: 'Occupé',
};

export const PresenceIndicator: React.FC<PresenceIndicatorProps> = ({
  userId,
  userName,
  compact = false,
}) => {
  const { onlineUsers, userCount, isTracking } = usePresence(userId, userName);

  if (!isTracking) {
    return null;
  }

  if (compact) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-success/10 text-success">
              <Circle className="w-2 h-2 fill-current animate-pulse" />
              <span className="text-xs font-medium">{userCount}</span>
            </div>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="max-w-xs">
            <div className="space-y-2">
              <p className="text-xs font-medium">{userCount} utilisateur(s) connecté(s)</p>
              {onlineUsers.length > 0 && (
                <div className="space-y-1">
                  {onlineUsers.slice(0, 5).map((user) => (
                    <div key={user.id} className="flex items-center gap-2 text-xs">
                      <div className={`w-2 h-2 rounded-full ${statusColors[user.status]}`} />
                      <span>{user.name || 'Utilisateur'}</span>
                    </div>
                  ))}
                  {onlineUsers.length > 5 && (
                    <p className="text-xs text-muted-foreground">
                      +{onlineUsers.length - 5} autres
                    </p>
                  )}
                </div>
              )}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <div className="neu-raised rounded-lg p-3 space-y-2">
      <div className="flex items-center gap-2 text-sm font-medium">
        <Users className="w-4 h-4 text-primary" />
        <span>Utilisateurs en ligne</span>
        <span className="ml-auto px-2 py-0.5 rounded-full bg-success/10 text-success text-xs">
          {userCount}
        </span>
      </div>

      <AnimatePresence mode="popLayout">
        {onlineUsers.length === 0 ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-xs text-muted-foreground"
          >
            Vous êtes le seul utilisateur connecté
          </motion.p>
        ) : (
          <div className="space-y-1.5 max-h-32 overflow-y-auto">
            {onlineUsers.map((user) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="flex items-center gap-2 p-1.5 rounded-md hover:bg-muted/50 transition-colors"
              >
                <div className="relative">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-xs font-medium text-primary">
                      {(user.name || 'U').charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div
                    className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-background ${statusColors[user.status]}`}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate">{user.name || 'Utilisateur'}</p>
                  <p className="text-xs text-muted-foreground">{statusLabels[user.status]}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
