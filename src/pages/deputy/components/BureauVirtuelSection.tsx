import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText, PenTool, Calendar, Download, Search, Send, Loader2, CheckCircle, XCircle, Clock, Eye } from "lucide-react";
import { LegislativeSkills } from "@/Cortex/Skills/AdministrativeSkills";
import { iAstedSoul } from "@/Consciousness/iAstedSoul";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface Amendment {
    id: string;
    project_law_id: string;
    article_number: number;
    amendment_type: string;
    proposed_text: string;
    justification: string;
    status: string;
    created_at: string;
    vote_pour: number;
    vote_contre: number;
}

export const BureauVirtuelSection = () => {
    const [isAmendmentDialogOpen, setIsAmendmentDialogOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [amendments, setAmendments] = useState<Amendment[]>([]);
    const [loadingAmendments, setLoadingAmendments] = useState(true);
    const [amendmentForm, setAmendmentForm] = useState({
        billReference: "",
        articleNumber: "",
        amendmentType: "modification" as "ajout" | "suppression" | "modification",
        currentText: "",
        proposedText: "",
        justification: ""
    });

    // Fetch amendments from database
    useEffect(() => {
        fetchAmendments();
    }, []);

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

    const handleAmendmentSubmit = async () => {
        if (!amendmentForm.billReference || !amendmentForm.articleNumber || !amendmentForm.proposedText || !amendmentForm.justification) {
            toast.error("Veuillez remplir tous les champs obligatoires");
            return;
        }

        setIsSubmitting(true);
        try {
            const soulState = iAstedSoul.getState();
            const userId = soulState.user.id;

            // Prepare amendment with skill
            const result = await LegislativeSkills.prepareAmendment(
                {
                    skillName: "prepareAmendment",
                    activatedBy: "click",
                    soulState: soulState,
                    timestamp: new Date(),
                    priority: "normal"
                },
                {
                    projectLawId: amendmentForm.billReference,
                    articleNumber: parseInt(amendmentForm.articleNumber) || 1,
                    amendmentType: amendmentForm.amendmentType,
                    originalText: amendmentForm.currentText || undefined,
                    proposedText: amendmentForm.proposedText,
                    justification: amendmentForm.justification,
                    authorId: userId || "anonymous"
                }
            );

            if (result.success && userId) {
                // Persist to database
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

                toast.success("Amendement déposé avec succès", {
                    description: result.vocalFeedback
                });
                
                setIsAmendmentDialogOpen(false);
                setAmendmentForm({
                    billReference: "",
                    articleNumber: "",
                    amendmentType: "modification",
                    currentText: "",
                    proposedText: "",
                    justification: ""
                });
                
                // Refresh list
                fetchAmendments();
            } else if (!userId) {
                toast.error("Vous devez être connecté pour déposer un amendement");
            } else {
                toast.error("Erreur lors de la préparation de l'amendement");
            }
        } catch (error) {
            console.error('Error submitting amendment:', error);
            toast.error("Une erreur est survenue lors du dépôt");
        } finally {
            setIsSubmitting(false);
        }
    };

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
            <div>
                <h1 className="text-3xl font-serif font-bold mb-2">Bureau Virtuel</h1>
                <p className="text-muted-foreground">
                    Espace de travail législatif : Textes, Amendements et Commissions
                </p>
            </div>

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

            {/* Tableau de suivi des amendements */}
            <Card className="p-6 neu-raised">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                        <PenTool className="text-primary" /> Suivi des Amendements
                    </h3>
                    <Badge variant="outline">{amendments.length} amendement(s)</Badge>
                </div>

                {loadingAmendments ? (
                    <div className="flex items-center justify-center py-8">
                        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                    </div>
                ) : amendments.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                        <PenTool className="w-12 h-12 mx-auto mb-3 opacity-30" />
                        <p>Aucun amendement déposé pour le moment</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Texte</TableHead>
                                    <TableHead>Article</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Statut</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Votes</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {amendments.map((amendment) => (
                                    <TableRow key={amendment.id}>
                                        <TableCell className="font-medium">{amendment.project_law_id}</TableCell>
                                        <TableCell>Art. {amendment.article_number}</TableCell>
                                        <TableCell>{getTypeLabel(amendment.amendment_type)}</TableCell>
                                        <TableCell>{getStatusBadge(amendment.status)}</TableCell>
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
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </Card>
        </div>
    );
};
