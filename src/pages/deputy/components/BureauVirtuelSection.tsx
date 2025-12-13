import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, PenTool, Calendar, Download, Search } from "lucide-react";

export const BureauVirtuelSection = () => {
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
                                    <Button size="sm" variant="default" className="shadow-sm">
                                        <PenTool className="w-4 h-4 mr-2" /> Déposer un amendement
                                    </Button>
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
