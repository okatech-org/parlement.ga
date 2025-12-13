import React, { useState, useEffect } from 'react';
import { WifiOff, Wifi, Cloud, CloudOff, RefreshCw, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { offlineSyncService } from '@/services/offline-sync-service';
import { useToast } from '@/hooks/use-toast';

export const OfflineIndicator: React.FC = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [unsyncedCount, setUnsyncedCount] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = offlineSyncService.onStatusChange((online) => {
      setIsOnline(online);
      if (online) {
        handleAutoSync();
      }
    });

    // Initial check
    setUnsyncedCount(offlineSyncService.getUnsyncedCount());

    return () => {
      unsubscribe();
    };
  }, []);

  const handleAutoSync = async () => {
    const count = offlineSyncService.getUnsyncedCount();
    if (count > 0) {
      setIsSyncing(true);
      const result = await offlineSyncService.attemptSync();
      setIsSyncing(false);
      setUnsyncedCount(offlineSyncService.getUnsyncedCount());

      if (result.synced > 0) {
        toast({
          title: "Synchronisation réussie",
          description: `${result.synced} message(s) synchronisé(s).`,
        });
      }
    }
  };

  const handleManualSync = async () => {
    if (!isOnline) {
      toast({
        title: "Hors ligne",
        description: "La synchronisation nécessite une connexion internet.",
        variant: "destructive"
      });
      return;
    }

    setIsSyncing(true);
    const result = await offlineSyncService.attemptSync();
    setIsSyncing(false);
    setUnsyncedCount(offlineSyncService.getUnsyncedCount());

    toast({
      title: result.synced > 0 ? "Synchronisation réussie" : "Rien à synchroniser",
      description: result.synced > 0 
        ? `${result.synced} message(s) synchronisé(s).`
        : "Tous les messages sont déjà synchronisés.",
    });
  };

  const storage = offlineSyncService.getStorageUsage();

  return (
    <div className="relative">
      <button
        onClick={() => setShowDetails(!showDetails)}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all ${
          isOnline 
            ? 'bg-success/10 text-success hover:bg-success/20' 
            : 'bg-warning/10 text-warning hover:bg-warning/20'
        }`}
      >
        {isOnline ? (
          <Wifi className="w-4 h-4" />
        ) : (
          <WifiOff className="w-4 h-4" />
        )}
        <span className="text-xs font-medium">
          {isOnline ? 'En ligne' : 'Hors ligne'}
        </span>
        {unsyncedCount > 0 && (
          <span className="flex items-center justify-center w-5 h-5 rounded-full bg-warning text-warning-foreground text-xs font-bold">
            {unsyncedCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {showDetails && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute top-full right-0 mt-2 w-72 p-4 rounded-xl neu-raised bg-card z-50"
          >
            <div className="space-y-4">
              {/* Status */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {isOnline ? (
                    <Cloud className="w-5 h-5 text-success" />
                  ) : (
                    <CloudOff className="w-5 h-5 text-warning" />
                  )}
                  <span className="font-medium">
                    {isOnline ? 'Connecté' : 'Mode hors ligne'}
                  </span>
                </div>
                {isOnline && (
                  <Check className="w-4 h-4 text-success" />
                )}
              </div>

              {/* Unsynced count */}
              {unsyncedCount > 0 && (
                <div className="p-3 rounded-lg bg-warning/10 border border-warning/20">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">
                      {unsyncedCount} message(s) en attente
                    </span>
                    <button
                      onClick={handleManualSync}
                      disabled={isSyncing || !isOnline}
                      className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium transition-colors ${
                        isOnline 
                          ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                          : 'bg-muted text-muted-foreground cursor-not-allowed'
                      }`}
                    >
                      <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
                      {isSyncing ? 'Sync...' : 'Synchroniser'}
                    </button>
                  </div>
                </div>
              )}

              {/* Storage info */}
              <div className="text-xs text-muted-foreground space-y-1">
                <div className="flex justify-between">
                  <span>Messages en cache</span>
                  <span>{storage.items}</span>
                </div>
                <div className="flex justify-between">
                  <span>Espace utilisé</span>
                  <span>{(storage.used / 1024).toFixed(1)} Ko</span>
                </div>
              </div>

              {/* Offline mode info */}
              {!isOnline && (
                <p className="text-xs text-muted-foreground">
                  Vos messages seront automatiquement synchronisés dès que vous serez de nouveau connecté.
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
