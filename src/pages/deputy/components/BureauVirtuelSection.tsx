import React, { useState, useEffect, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, PenTool, Calendar, Download, Search, Send, Loader2, CheckCircle, XCircle, Clock, Eye, Users, UserPlus, Bell, Filter, BarChart3 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format, isAfter, isBefore, startOfDay, endOfDay } from "date-fns";
import { fr } from "date-fns/locale";
import { AmendmentDetailModal } from "@/components/parliamentary/AmendmentDetailModal";
import { AmendmentFiltersComponent, AmendmentFilters } from "@/components/parliamentary/AmendmentFilters";
import { LegislativeAnalyticsDashboard } from "@/components/parliamentary/LegislativeAnalyticsDashboard";

interface Amendment {
    id: string;
    author_id: string;
    project_law_id: string;
    article_number: number;
    amendment_type: string;
    proposed_text: string;
    justification: string;
    status: string;
    created_at: string;
    vote_pour: number;
    vote_contre: number;
    vote_abstention?: number;
    cosignatures_count?: number;
}

interface Cosignature {
    id: string;
    amendment_id: string;
    deputy_id: string;
    signed_at: string;
}

const defaultFilters: AmendmentFilters = {
    status: 'all',
    type: 'all',
    dateFrom: undefined,
    dateTo: undefined,
    search: ''
};

export const BureauVirtuelSection = () => {
    const [isAmendmentDialogOpen, setIsAmendmentDialogOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [amendments, setAmendments] = useState<Amendment[]>([]);
    const [cosignatures, setCosignatures] = useState<Record<string, Cosignature[]>>({});
    const [loadingAmendments, setLoadingAmendments] = useState(true);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const [selectedAmendmentId, setSelectedAmendmentId] = useState<string | null>(null);
    const [filters, setFilters] = useState<AmendmentFilters>(defaultFilters);
    const [activeTab, setActiveTab] = useState('amendements');
    const [amendmentForm, setAmendmentForm] = useState({
        billReference: "",
        articleNumber: "",
        amendmentType: "modification" as "ajout" | "suppression" | "modification",
        currentText: "",
        proposedText: "",
        justification: ""
    });

    // Get current user
    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setCurrentUserId(user?.id || null);
        };
        getUser();
    }, []);

    // Fetch amendments and cosignatures
    useEffect(() => {
        fetchAmendments();
        fetchAllCosignatures();
    }, []);

    // Subscribe to realtime changes
    useEffect(() => {
        const channel = supabase
            .channel('amendments-changes')
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'amendments'
                },
                (payload) => {
                    console.log('Amendment updated:', payload);
                    const updated = payload.new as Amendment;
                    const old = payload.old as Amendment;

                    // Show notification for status change
                    if (old.status !== updated.status) {
                        const statusLabels: Record<string, string> = {
                            'adopte': 'adopté',
                            'rejete': 'rejeté',
                            'en_examen': 'en examen',
                            'retire': 'retiré'
                        };

                        const statusLabel = statusLabels[updated.status] || updated.status;

                        if (updated.status === 'adopte') {
                            toast.success(`Amendement ${updated.project_law_id} Art.${updated.article_number} adopté !`, {
                                icon: <CheckCircle className="w-5 h-5 text-green-500" />,
                                description: `Votes: ${updated.vote_pour} pour / ${updated.vote_contre} contre`
                            });
                        } else if (updated.status === 'rejete') {
                            toast.error(`Amendement ${updated.project_law_id} Art.${updated.article_number} rejeté`, {
                                icon: <XCircle className="w-5 h-5 text-red-500" />,
                                description: `Votes: ${updated.vote_pour} pour / ${updated.vote_contre} contre`
                            });
                        } else {
                            toast.info(`Statut de l'amendement ${updated.project_law_id} Art.${updated.article_number} : ${statusLabel}`, {
                                icon: <Bell className="w-5 h-5" />
                            });
                        }
                    }

                    // Update local state
                    setAmendments(prev => prev.map(a => a.id === updated.id ? { ...a, ...updated } : a));
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
                    console.log('New amendment:', payload);
                    const newAmendment = payload.new as Amendment;
                    setAmendments(prev => [newAmendment, ...prev]);
                    toast.info(`Nouvel amendement déposé sur ${newAmendment.project_law_id}`, {
                        icon: <PenTool className="w-5 h-5" />
                    });
                }
            )
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'amendment_cosignatures'
                },
                (payload) => {
                    console.log('Cosignature change:', payload);
                    fetchAllCosignatures();

                    if (payload.eventType === 'INSERT') {
                        const newCosig = payload.new as Cosignature;
                        const amendment = amendments.find(a => a.id === newCosig.amendment_id);
                        if (amendment) {
                            toast.info(`Nouvelle co-signature sur l'amendement ${amendment.project_law_id}`, {
                                icon: <UserPlus className="w-5 h-5" />
                            });
                        }
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [amendments]);

    const fetchAmendments = async () => {
        try {
            const { data, error } = await supabase
                .from('amendments')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(20);

            if (error) throw error;
            setAmendments(data || []);
        } catch (error) {
            console.error('Error fetching amendments:', error);
        } finally {
            setLoadingAmendments(false);
        }
    };

    const fetchAllCosignatures = async () => {
        try {
            const { data, error } = await supabase
                .from('amendment_cosignatures')
                .select('*');

            if (error) throw error;

            // Group by amendment_id
            const grouped: Record<string, Cosignature[]> = {};
            (data || []).forEach((cosig: Cosignature) => {
                if (!grouped[cosig.amendment_id]) {
                    grouped[cosig.amendment_id] = [];
                }
                grouped[cosig.amendment_id].push(cosig);
            });
            setCosignatures(grouped);
        } catch (error) {
            console.error('Error fetching cosignatures:', error);
        }
    };

    const handleCosign = async (amendmentId: string) => {
        if (!currentUserId) {
            toast.error("Vous devez être connecté pour co-signer");
            return;
        }

        try {
            const { error } = await supabase
                .from('amendment_cosignatures')
                .insert({
                    amendment_id: amendmentId,
                    deputy_id: currentUserId
                });

            if (error) {
                if (error.code === '23505') {
                    toast.info("Vous avez déjà co-signé cet amendement");
                } else {
                    throw error;
                }
            } else {
                toast.success("Co-signature enregistrée !");
            }
        } catch (error) {
            console.error('Error cosigning:', error);
            toast.error("Erreur lors de la co-signature");
        }
    };

    const handleRemoveCosign = async (amendmentId: string) => {
        if (!currentUserId) return;

        try {
            const { error } = await supabase
                .from('amendment_cosignatures')
                .delete()
                .eq('amendment_id', amendmentId)
                .eq('deputy_id', currentUserId);

            if (error) throw error;
            toast.success("Co-signature retirée");
        } catch (error) {
            console.error('Error removing cosignature:', error);
            toast.error("Erreur lors du retrait de la co-signature");
        }
    };

    const hasCosigned = (amendmentId: string) => {
        const amendmentCosigs = cosignatures[amendmentId] || [];
        return amendmentCosigs.some(c => c.deputy_id === currentUserId);
    };

    const getCosignaturesCount = (amendmentId: string) => {
        return (cosignatures[amendmentId] || []).length;
    };

    const handleAmendmentSubmit = async () => {
        if (!amendmentForm.billReference || !amendmentForm.articleNumber || !amendmentForm.proposedText || !amendmentForm.justification) {
            toast.error("Veuillez remplir tous les champs obligatoires");
            return;
        }

        setIsSubmitting(true);
        try {
            const userId = currentUserId;

            if (userId) {
                const { error } = await supabase.from('amendments').insert({
                    author_id: userId,
                    project_law_id: amendmentForm.billReference,
                    article_number: parseInt(amendmentForm.articleNumber) || 1,
                    amendment_type: amendmentForm.amendmentType,
                    original_text: amendmentForm.currentText || null,
                    proposed_text: amendmentForm.proposedText,
                    justification: amendmentForm.justification,
                    status: 'en_attente'
                });

                if (error) throw error;

                toast.success("Amendement déposé avec succès");

                setIsAmendmentDialogOpen(false);
                setAmendmentForm({
                    billReference: "",
                    articleNumber: "",
                    amendmentType: "modification",
                    currentText: "",
                    proposedText: "",
                    justification: ""
                });
            } else {
                toast.error("Vous devez être connecté pour déposer un amendement");
            }
        } catch (error) {
            console.error('Error submitting amendment:', error);
            toast.error("Une erreur est survenue lors du dépôt");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Filtrage des amendements
    const filteredAmendments = useMemo(() => {
        return amendments.filter(amendment => {
            // Filtre par statut
            if (filters.status !== 'all' && amendment.status !== filters.status) {
                return false;
            }
            // Filtre par type
            if (filters.type !== 'all' && amendment.amendment_type !== filters.type) {
                return false;
            }
            // Filtre par date de début
            if (filters.dateFrom) {
                const amendmentDate = new Date(amendment.created_at);
                if (isBefore(amendmentDate, startOfDay(filters.dateFrom))) {
                    return false;
                }
            }
            // Filtre par date de fin
            if (filters.dateTo) {
                const amendmentDate = new Date(amendment.created_at);
                if (isAfter(amendmentDate, endOfDay(filters.dateTo))) {
                    return false;
                }
            }
            // Filtre par recherche textuelle
            if (filters.search) {
                const searchLower = filters.search.toLowerCase();
                return (
                    amendment.project_law_id.toLowerCase().includes(searchLower) ||
                    amendment.proposed_text.toLowerCase().includes(searchLower) ||
                    amendment.justification.toLowerCase().includes(searchLower)
                );
            }
            return true;
        });
    }, [amendments, filters]);

    // Compteur de filtres actifs
    const activeFiltersCount = useMemo(() => {
        let count = 0;
        if (filters.status !== 'all') count++;
        if (filters.type !== 'all') count++;
        if (filters.dateFrom) count++;
        if (filters.dateTo) count++;
        if (filters.search) count++;
        return count;
    }, [filters]);

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'adopte':
                return <Badge className="bg-green-600"><CheckCircle className="w-3 h-3 mr-1" /> Adopté</Badge>;
            case 'rejete':
                return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" /> Rejeté</Badge>;
            case 'en_examen':
                return <Badge className="bg-amber-600"><Eye className="w-3 h-3 mr-1" /> En examen</Badge>;
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

    return (
        <div className="p-6 space-y-6 animate-fade-in">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-serif font-bold mb-2">Bureau Virtuel</h1>
                    <p className="text-muted-foreground">
                        Espace de travail législatif : Textes, Amendements et Commissions
                    </p>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    Temps réel activé
                </div>
            </div>

            {/* Tabs pour basculer entre amendements et analytics */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                    <TabsTrigger value="amendements" className="gap-2">
                        <PenTool className="w-4 h-4" />
                        Amendements
                    </TabsTrigger>
                    <TabsTrigger value="analytics" className="gap-2">
                        <BarChart3 className="w-4 h-4" />
                        Tableau de bord
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="analytics" className="mt-6">
                    <LegislativeAnalyticsDashboard amendments={amendments} />
                </TabsContent>

                <TabsContent value="amendements" className="mt-6 space-y-6">
                    <div className="grid md:grid-cols-3 gap-6">

                        {/* Textes en examen */}
                        <Card className="md:col-span-2 p-6 neu-raised">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold flex items-center gap-2">
                                    <FileText className="text-primary" /> Textes en examen
                                </h3>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm"><Search className="w-4 h-4 mr-2" /> Rechercher</Button>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="p-4 border border-border rounded-xl hover:bg-muted/30 transition-colors group">
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="font-semibold text-lg group-hover:text-primary transition-colors">
                                                Projet de loi n°{240 + i} / 2025
                                            </h4>
                                            <Badge>Commission Lois</Badge>
                                        </div>
                                        <p className="text-sm text-muted-foreground mb-4">
                                            Relatif à la modernisation de l'administration publique et à la digitalisation des services de l'État.
                                        </p>
                                        <div className="flex gap-3">
                                            <Dialog open={isAmendmentDialogOpen} onOpenChange={setIsAmendmentDialogOpen}>
                                                <DialogTrigger asChild>
                                                    <Button size="sm" variant="default" className="shadow-sm">
                                                        <PenTool className="w-4 h-4 mr-2" /> Déposer un amendement
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                                                    <DialogHeader>
                                                        <DialogTitle className="flex items-center gap-2">
                                                            <PenTool className="w-5 h-5 text-primary" />
                                                            Rédiger un amendement
                                                        </DialogTitle>
                                                    </DialogHeader>
                                                    <div className="space-y-4 mt-4">
                                                        <div className="grid grid-cols-2 gap-4">
                                                            <div className="space-y-2">
                                                                <Label htmlFor="billRef">Référence du texte *</Label>
                                                                <Input
                                                                    id="billRef"
                                                                    placeholder="Ex: PL-241/2025"
                                                                    value={amendmentForm.billReference}
                                                                    onChange={(e) => setAmendmentForm(prev => ({ ...prev, billReference: e.target.value }))}
                                                                />
                                                            </div>
                                                            <div className="space-y-2">
                                                                <Label htmlFor="articleNum">Article concerné *</Label>
                                                                <Input
                                                                    id="articleNum"
                                                                    placeholder="Ex: 5"
                                                                    value={amendmentForm.articleNumber}
                                                                    onChange={(e) => setAmendmentForm(prev => ({ ...prev, articleNumber: e.target.value }))}
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="space-y-2">
                                                            <Label>Type d'amendement</Label>
                                                            <Select
                                                                value={amendmentForm.amendmentType}
                                                                onValueChange={(value: "ajout" | "suppression" | "modification") =>
                                                                    setAmendmentForm(prev => ({ ...prev, amendmentType: value }))
                                                                }
                                                            >
                                                                <SelectTrigger>
                                                                    <SelectValue />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="modification">Modification</SelectItem>
                                                                    <SelectItem value="ajout">Ajout</SelectItem>
                                                                    <SelectItem value="suppression">Suppression</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        </div>

                                                        {amendmentForm.amendmentType !== "ajout" && (
                                                            <div className="space-y-2">
                                                                <Label htmlFor="currentText">Texte actuel</Label>
                                                                <Textarea
                                                                    id="currentText"
                                                                    placeholder="Copiez ici le texte de l'article à modifier..."
                                                                    className="min-h-[100px]"
                                                                    value={amendmentForm.currentText}
                                                                    onChange={(e) => setAmendmentForm(prev => ({ ...prev, currentText: e.target.value }))}
                                                                />
                                                            </div>
                                                        )}

                                                        {amendmentForm.amendmentType !== "suppression" && (
                                                            <div className="space-y-2">
                                                                <Label htmlFor="proposedText">Texte proposé *</Label>
                                                                <Textarea
                                                                    id="proposedText"
                                                                    placeholder="Rédigez votre nouvelle formulation..."
                                                                    className="min-h-[100px]"
                                                                    value={amendmentForm.proposedText}
                                                                    onChange={(e) => setAmendmentForm(prev => ({ ...prev, proposedText: e.target.value }))}
                                                                />
                                                            </div>
                                                        )}

                                                        <div className="space-y-2">
                                                            <Label htmlFor="justification">Exposé des motifs *</Label>
                                                            <Textarea
                                                                id="justification"
                                                                placeholder="Justifiez votre amendement (clarté, cohérence, opportunité juridique...)"
                                                                className="min-h-[120px]"
                                                                value={amendmentForm.justification}
                                                                onChange={(e) => setAmendmentForm(prev => ({ ...prev, justification: e.target.value }))}
                                                            />
                                                        </div>

                                                        <div className="flex justify-end gap-3 pt-4">
                                                            <Button variant="outline" onClick={() => setIsAmendmentDialogOpen(false)}>
                                                                Annuler
                                                            </Button>
                                                            <Button onClick={handleAmendmentSubmit} disabled={isSubmitting}>
                                                                {isSubmitting ? (
                                                                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Préparation...</>
                                                                ) : (
                                                                    <><Send className="w-4 h-4 mr-2" /> Soumettre l'amendement</>
                                                                )}
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </DialogContent>
                                            </Dialog>
                                            <Button size="sm" variant="ghost">
                                                <Download className="w-4 h-4 mr-2" /> Texte intégral (PDF)
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>

                        {/* Sidebar: Commissions & Outils */}
                        <div className="space-y-6">
                            <Card className="p-6 neu-raised">
                                <h3 className="font-bold mb-4 flex items-center gap-2">
                                    <Calendar className="text-secondary" /> Agenda Commissions
                                </h3>
                                <div className="space-y-4">
                                    <div className="pl-4 border-l-2 border-primary relative">
                                        <div className="absolute -left-[5px] top-0 w-2.5 h-2.5 rounded-full bg-primary"></div>
                                        <div className="text-sm font-bold">Aujourd'hui, 10:00</div>
                                        <div className="text-sm">Commission des Finances</div>
                                        <div className="text-xs text-muted-foreground">Salle Léon Mba</div>
                                    </div>
                                    <div className="pl-4 border-l-2 border-muted relative">
                                        <div className="absolute -left-[5px] top-0 w-2.5 h-2.5 rounded-full bg-muted-foreground"></div>
                                        <div className="text-sm font-bold">Demain, 14:30</div>
                                        <div className="text-sm">Commission des Lois</div>
                                        <div className="text-xs text-muted-foreground">Salle Omar Bongo</div>
                                    </div>
                                </div>
                            </Card>

                            <Card className="p-6 neu-raised bg-primary/5 border-primary/10">
                                <h3 className="font-bold mb-2 text-primary">Statistiques Législatives</h3>
                                <div className="grid grid-cols-2 gap-4 text-center">
                                    <div className="p-3 bg-background rounded-lg shadow-sm">
                                        <div className="text-2xl font-bold">{amendments.length}</div>
                                        <div className="text-xs text-muted-foreground">Amendements déposés</div>
                                    </div>
                                    <div className="p-3 bg-background rounded-lg shadow-sm">
                                        <div className="text-2xl font-bold">{amendments.filter(a => a.status === 'adopte').length}</div>
                                        <div className="text-xs text-muted-foreground">Adoptés</div>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>

                    {/* Tableau de suivi des amendements avec filtres */}
                    <Card className="p-6 neu-raised">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold flex items-center gap-2">
                                <PenTool className="text-primary" /> Suivi des Amendements
                            </h3>
                            <div className="flex items-center gap-2">
                                {activeFiltersCount > 0 && (
                                    <Badge variant="secondary">
                                        <Filter className="w-3 h-3 mr-1" />
                                        {activeFiltersCount} filtre(s)
                                    </Badge>
                                )}
                                <Badge variant="outline">
                                    {filteredAmendments.length} / {amendments.length} amendement(s)
                                </Badge>
                            </div>
                        </div>

                        {/* Filtres avancés */}
                        <div className="mb-6">
                            <AmendmentFiltersComponent
                                filters={filters}
                                onFiltersChange={setFilters}
                                onReset={() => setFilters(defaultFilters)}
                                activeFiltersCount={activeFiltersCount}
                            />
                        </div>

                        {loadingAmendments ? (
                            <div className="flex items-center justify-center py-8">
                                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                            </div>
                        ) : filteredAmendments.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                                <PenTool className="w-12 h-12 mx-auto mb-3 opacity-30" />
                                <p>{amendments.length === 0 ? "Aucun amendement déposé pour le moment" : "Aucun amendement ne correspond aux filtres"}</p>
                                {activeFiltersCount > 0 && (
                                    <Button variant="link" onClick={() => setFilters(defaultFilters)} className="mt-2">
                                        Réinitialiser les filtres
                                    </Button>
                                )}
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <TooltipProvider>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Texte</TableHead>
                                                <TableHead>Article</TableHead>
                                                <TableHead>Type</TableHead>
                                                <TableHead>Statut</TableHead>
                                                <TableHead>Co-signatures</TableHead>
                                                <TableHead>Date</TableHead>
                                                <TableHead>Votes</TableHead>
                                                <TableHead>Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {filteredAmendments.map((amendment) => (
                                                <TableRow key={amendment.id}>
                                                    <TableCell className="font-medium">{amendment.project_law_id}</TableCell>
                                                    <TableCell>Art. {amendment.article_number}</TableCell>
                                                    <TableCell>{getTypeLabel(amendment.amendment_type)}</TableCell>
                                                    <TableCell>{getStatusBadge(amendment.status)}</TableCell>
                                                    <TableCell>
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <div className="flex items-center gap-1 cursor-help">
                                                                    <Users className="w-4 h-4 text-muted-foreground" />
                                                                    <span className="font-medium">{getCosignaturesCount(amendment.id)}</span>
                                                                </div>
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                {getCosignaturesCount(amendment.id)} co-signataire(s)
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </TableCell>
                                                    <TableCell className="text-muted-foreground text-sm">
                                                        {format(new Date(amendment.created_at), 'dd MMM yyyy', { locale: fr })}
                                                    </TableCell>
                                                    <TableCell>
                                                        {amendment.status !== 'en_attente' && (
                                                            <span className="text-sm">
                                                                <span className="text-green-600">{amendment.vote_pour}</span>
                                                                {' / '}
                                                                <span className="text-red-600">{amendment.vote_contre}</span>
                                                            </span>
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-1">
                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                onClick={() => setSelectedAmendmentId(amendment.id)}
                                                            >
                                                                <Eye className="w-4 h-4" />
                                                            </Button>
                                                            {amendment.status === 'en_attente' && amendment.author_id !== currentUserId && (
                                                                hasCosigned(amendment.id) ? (
                                                                    <Button
                                                                        size="sm"
                                                                        variant="outline"
                                                                        onClick={() => handleRemoveCosign(amendment.id)}
                                                                    >
                                                                        <CheckCircle className="w-4 h-4 mr-1 text-green-600" />
                                                                        Signé
                                                                    </Button>
                                                                ) : (
                                                                    <Button
                                                                        size="sm"
                                                                        variant="secondary"
                                                                        onClick={() => handleCosign(amendment.id)}
                                                                    >
                                                                        <UserPlus className="w-4 h-4 mr-1" />
                                                                        Co-signer
                                                                    </Button>
                                                                )
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TooltipProvider>
                            </div>
                        )}
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Amendment Detail Modal */}
            <AmendmentDetailModal
                amendmentId={selectedAmendmentId}
                open={!!selectedAmendmentId}
                onOpenChange={(open) => !open && setSelectedAmendmentId(null)}
            />
        </div>
    );
};
