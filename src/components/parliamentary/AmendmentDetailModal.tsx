import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Card } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { 
  CheckCircle, XCircle, Clock, Eye, Users, FileText, 
  Calendar, User, PenTool, Loader2, ThumbsUp, ThumbsDown
} from 'lucide-react';

interface Amendment {
  id: string;
  author_id: string;
  project_law_id: string;
  article_number: number;
  amendment_type: string;
  original_text: string | null;
  proposed_text: string;
  justification: string;
  status: string;
  created_at: string;
  vote_pour: number;
  vote_contre: number;
  vote_abstention: number;
}

interface Cosignature {
  id: string;
  deputy_id: string;
  signed_at: string;
}

interface AmendmentDetailModalProps {
  amendmentId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AmendmentDetailModal({ amendmentId, open, onOpenChange }: AmendmentDetailModalProps) {
  const [amendment, setAmendment] = useState<Amendment | null>(null);
  const [cosignatures, setCosignatures] = useState<Cosignature[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (amendmentId && open) {
      fetchAmendmentDetails();
    }
  }, [amendmentId, open]);

  const fetchAmendmentDetails = async () => {
    if (!amendmentId) return;
    
    setLoading(true);
    try {
      // Fetch amendment
      const { data: amendmentData, error: amendmentError } = await supabase
        .from('amendments')
        .select('*')
        .eq('id', amendmentId)
        .maybeSingle();

      if (amendmentError) throw amendmentError;
      setAmendment(amendmentData);

      // Fetch cosignatures
      const { data: cosigData, error: cosigError } = await supabase
        .from('amendment_cosignatures')
        .select('*')
        .eq('amendment_id', amendmentId)
        .order('signed_at', { ascending: false });

      if (cosigError) throw cosigError;
      setCosignatures(cosigData || []);
    } catch (error) {
      console.error('Error fetching amendment details:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'adopte':
        return <Badge className="bg-green-600 text-white"><CheckCircle className="w-3 h-3 mr-1" /> Adopté</Badge>;
      case 'rejete':
        return <Badge className="bg-red-600 text-white"><XCircle className="w-3 h-3 mr-1" /> Rejeté</Badge>;
      case 'en_examen':
        return <Badge className="bg-amber-600 text-white"><Eye className="w-3 h-3 mr-1" /> En examen</Badge>;
      case 'retire':
        return <Badge variant="secondary">Retiré</Badge>;
      default:
        return <Badge variant="outline"><Clock className="w-3 h-3 mr-1" /> En attente</Badge>;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'ajout': return 'Ajout';
      case 'suppression': return 'Suppression';
      default: return 'Modification';
    }
  };

  const totalVotes = (amendment?.vote_pour || 0) + (amendment?.vote_contre || 0) + (amendment?.vote_abstention || 0);
  const pourPercent = totalVotes > 0 ? Math.round((amendment?.vote_pour || 0) / totalVotes * 100) : 0;
  const contrePercent = totalVotes > 0 ? Math.round((amendment?.vote_contre || 0) / totalVotes * 100) : 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <PenTool className="w-5 h-5 text-primary" />
            Détail de l'amendement
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : amendment ? (
          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-6 pb-4">
              {/* Header Info */}
              <div className="flex flex-wrap items-center gap-3">
                {getStatusBadge(amendment.status)}
                <Badge variant="outline">{getTypeLabel(amendment.amendment_type)}</Badge>
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {format(new Date(amendment.created_at), 'dd MMMM yyyy à HH:mm', { locale: fr })}
                </span>
              </div>

              {/* Reference */}
              <Card className="p-4 bg-muted/50">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Texte de référence</span>
                    <p className="font-semibold">{amendment.project_law_id}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Article concerné</span>
                    <p className="font-semibold">Article {amendment.article_number}</p>
                  </div>
                </div>
              </Card>

              {/* Vote Results */}
              {amendment.status !== 'en_attente' && totalVotes > 0 && (
                <Card className="p-4">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-primary" />
                    Résultats du vote
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2 text-green-600">
                        <ThumbsUp className="w-4 h-4" /> Pour
                      </span>
                      <span className="font-bold">{amendment.vote_pour} ({pourPercent}%)</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div 
                        className="h-full bg-green-500 transition-all duration-500" 
                        style={{ width: `${pourPercent}%` }}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2 text-red-600">
                        <ThumbsDown className="w-4 h-4" /> Contre
                      </span>
                      <span className="font-bold">{amendment.vote_contre} ({contrePercent}%)</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div 
                        className="h-full bg-red-500 transition-all duration-500" 
                        style={{ width: `${contrePercent}%` }}
                      />
                    </div>

                    {(amendment.vote_abstention || 0) > 0 && (
                      <p className="text-sm text-muted-foreground">
                        Abstentions : {amendment.vote_abstention}
                      </p>
                    )}
                  </div>
                </Card>
              )}

              {/* Text Changes */}
              {amendment.original_text && (
                <>
                  <Separator />
                  <div>
                    <h4 className="font-semibold mb-2 text-muted-foreground">Texte actuel</h4>
                    <Card className="p-4 bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900">
                      <p className="text-sm whitespace-pre-wrap">{amendment.original_text}</p>
                    </Card>
                  </div>
                </>
              )}

              <div>
                <h4 className="font-semibold mb-2 text-muted-foreground">Texte proposé</h4>
                <Card className="p-4 bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900">
                  <p className="text-sm whitespace-pre-wrap">{amendment.proposed_text}</p>
                </Card>
              </div>

              <div>
                <h4 className="font-semibold mb-2 text-muted-foreground">Exposé des motifs</h4>
                <Card className="p-4">
                  <p className="text-sm whitespace-pre-wrap">{amendment.justification}</p>
                </Card>
              </div>

              {/* Cosignatures */}
              <Separator />
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary" />
                  Co-signataires ({cosignatures.length})
                </h4>
                {cosignatures.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Aucune co-signature pour le moment</p>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    {cosignatures.map((cosig) => (
                      <Card key={cosig.id} className="p-3 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="w-4 h-4 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            Député #{cosig.deputy_id.slice(0, 8)}...
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(cosig.signed_at), 'dd/MM/yyyy', { locale: fr })}
                          </p>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </ScrollArea>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            Amendement non trouvé
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
