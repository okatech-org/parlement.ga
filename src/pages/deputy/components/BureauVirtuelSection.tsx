import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FileText, PenTool, Calendar, Download, Search, Send, Loader2 } from "lucide-react";
import { LegislativeSkills } from "@/Cortex/Skills/AdministrativeSkills";
import { ParliamentaryRole } from "@/Cortex/entities/ParliamentaryRole";
import { iAstedSoul } from "@/Consciousness/iAstedSoul";
import { toast } from "sonner";

export const BureauVirtuelSection = () => {
    const [isAmendmentDialogOpen, setIsAmendmentDialogOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [amendmentForm, setAmendmentForm] = useState({
        billReference: "",
        articleNumber: "",
        amendmentType: "modification" as "ajout" | "suppression" | "modification",
        currentText: "",
        proposedText: "",
        justification: ""
    });

    const handleAmendmentSubmit = async () => {
        if (!amendmentForm.billReference || !amendmentForm.articleNumber || !amendmentForm.proposedText || !amendmentForm.justification) {
            toast.error("Veuillez remplir tous les champs obligatoires");
            return;
        }

        setIsSubmitting(true);
        try {
            const soulState = iAstedSoul.getState();
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
                    authorId: soulState.user.id || "anonymous"
                }
            );

            if (result.success) {
                toast.success("Amendement préparé avec succès", {
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
            } else {
                toast.error("Erreur lors de la préparation de l'amendement");
            }
        } catch (error) {
            toast.error("Une erreur est survenue");
        } finally {
            setIsSubmitting(false);
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
                                                            placeholder="Ex: Article 5"
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
                                <div className="text-2xl font-bold">12</div>
                                <div className="text-xs text-muted-foreground">Amendements déposés</div>
                            </div>
                            <div className="p-3 bg-background rounded-lg shadow-sm">
                                <div className="text-2xl font-bold">4</div>
                                <div className="text-xs text-muted-foreground">Adoptés</div>
                            </div>
                        </div>
                    </Card>
                </div>

            </div>
        </div>
    );
};
