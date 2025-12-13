import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { MessageSquare, Plus, Trash2, Loader2, Search, Calendar, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatDistanceToNow, format, isAfter, isBefore, startOfDay, endOfDay } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';

interface ConversationSession {
  id: string;
  title: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface ConversationHistoryProps {
  userId: string;
  currentSessionId?: string;
  onSelectSession: (sessionId: string) => void;
  onNewSession: () => void;
}

export function ConversationHistory({
  userId,
  currentSessionId,
  onSelectSession,
  onNewSession
}: ConversationHistoryProps) {
  const [sessions, setSessions] = useState<ConversationSession[]>([]);
  const [filteredSessions, setFilteredSessions] = useState<ConversationSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFrom, setDateFrom] = useState<Date | undefined>();
  const [dateTo, setDateTo] = useState<Date | undefined>();
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (!userId) return;
    
    const fetchSessions = async () => {
      const { data, error } = await supabase
        .from('conversation_sessions')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false })
        .limit(50);

      if (!error && data) {
        setSessions(data);
        setFilteredSessions(data);
      }
      setLoading(false);
    };

    fetchSessions();

    // Subscribe to realtime changes
    const channel = supabase
      .channel('conversation_sessions_realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'conversation_sessions',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          console.log('Session realtime update:', payload);
          if (payload.eventType === 'INSERT') {
            setSessions(prev => [payload.new as ConversationSession, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setSessions(prev => prev.map(s => 
              s.id === (payload.new as ConversationSession).id ? payload.new as ConversationSession : s
            ));
          } else if (payload.eventType === 'DELETE') {
            setSessions(prev => prev.filter(s => s.id !== (payload.old as ConversationSession).id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  // Filter sessions based on search and date
  useEffect(() => {
    let filtered = [...sessions];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(s => 
        s.title.toLowerCase().includes(query)
      );
    }

    // Date from filter
    if (dateFrom) {
      filtered = filtered.filter(s => 
        isAfter(new Date(s.updated_at), startOfDay(dateFrom))
      );
    }

    // Date to filter
    if (dateTo) {
      filtered = filtered.filter(s => 
        isBefore(new Date(s.updated_at), endOfDay(dateTo))
      );
    }

    setFilteredSessions(filtered);
  }, [sessions, searchQuery, dateFrom, dateTo]);

  const handleDeleteSession = async (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    await supabase
      .from('conversation_messages')
      .delete()
      .eq('session_id', sessionId);
    
    await supabase
      .from('conversation_sessions')
      .delete()
      .eq('id', sessionId);
    
    setSessions(prev => prev.filter(s => s.id !== sessionId));
  };

  const clearFilters = () => {
    setSearchQuery('');
    setDateFrom(undefined);
    setDateTo(undefined);
  };

  const hasActiveFilters = searchQuery || dateFrom || dateTo;

  if (loading) {
    return (
      <div className="p-4 flex items-center justify-center">
        <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b border-border space-y-2">
        <Button
          onClick={onNewSession}
          className="w-full justify-start gap-2"
          variant="outline"
          size="sm"
        >
          <Plus className="w-4 h-4" />
          Nouvelle conversation
        </Button>

        {/* Search input */}
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 h-8 text-sm"
          />
        </div>

        {/* Filter toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
          className="w-full justify-between text-xs"
        >
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            Filtres par date
          </span>
          {hasActiveFilters && (
            <span className="bg-primary text-primary-foreground text-[10px] px-1.5 py-0.5 rounded-full">
              Actif
            </span>
          )}
        </Button>

        {/* Date filters */}
        {showFilters && (
          <div className="space-y-2 pt-2 border-t border-border/50">
            <div className="flex gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="flex-1 text-xs h-7 justify-start">
                    {dateFrom ? format(dateFrom, 'dd/MM/yy') : 'Du...'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={dateFrom}
                    onSelect={setDateFrom}
                    locale={fr}
                  />
                </PopoverContent>
              </Popover>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="flex-1 text-xs h-7 justify-start">
                    {dateTo ? format(dateTo, 'dd/MM/yy') : 'Au...'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <CalendarComponent
                    mode="single"
                    selected={dateTo}
                    onSelect={setDateTo}
                    locale={fr}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="w-full text-xs h-7 text-muted-foreground hover:text-foreground"
              >
                <X className="w-3 h-3 mr-1" />
                Effacer les filtres
              </Button>
            )}
          </div>
        )}
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {filteredSessions.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-4">
              {hasActiveFilters ? 'Aucun résultat' : 'Aucune conversation'}
            </p>
          ) : (
            filteredSessions.map((session) => (
              <button
                key={session.id}
                onClick={() => onSelectSession(session.id)}
                className={`w-full text-left p-2 rounded-lg transition-colors group flex items-start gap-2 ${
                  currentSessionId === session.id
                    ? 'bg-primary/10 text-primary'
                    : 'hover:bg-muted/50'
                }`}
              >
                <MessageSquare className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{session.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(session.updated_at), {
                      addSuffix: true,
                      locale: fr
                    })}
                  </p>
                </div>
                <button
                  onClick={(e) => handleDeleteSession(session.id, e)}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:bg-destructive/10 hover:text-destructive rounded transition-all"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </button>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
