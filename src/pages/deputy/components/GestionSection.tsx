import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Wallet, Plane, FileText, PieChart, Download, Plus } from "lucide-react";

export const GestionSection = () => {
    return (
        <div className="p-6 space-y-6 animate-fade-in">
            <div>
                <h1 className="text-3xl font-serif font-bold mb-2">Ma Gestion</h1>
                <p className="text-muted-foreground">
                    Tableau de bord financier : Indemnités, Frais de Mandat et Missions
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">

                {/* Indemnités & Frais */}
                <Card className="p-6 neu-raised">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold flex items-center gap-2">
                            <Wallet className="text-primary" /> Indemnités & Frais
                        </h3>
                        <Badge variant="outline">Décembre 2025</Badge>
                    </div>

                    <div className="space-y-6">
                        <div className="p-4 neu-inset rounded-xl">
                            <div className="text-sm text-muted-foreground mb-1">Indemnité Parlementaire</div>
                            <div className="text-2xl font-bold text-foreground">X.XXX.XXX FCFA</div>
                            <div className="text-xs text-green-600 mt-1 flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-green-500"></span> Versée le 25/11
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="font-semibold">Frais de Mandat (IRFM)</span>
                                <span className="text-muted-foreground">85% consommé</span>
                            </div>
                            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                                <div className="h-full bg-primary w-[85%]"></div>
                            </div>
                            <div className="flex justify-between text-xs text-muted-foreground mt-1">
                                <span>Reste: 150.000 FCFA</span>
                                <span>Plafond: 1.000.000 FCFA</span>
                            </div>
                        </div>

                        <Button variant="outline" className="w-full">
                            <FileText className="w-4 h-4 mr-2" /> Télécharger mes fiches de paie
                        </Button>
                    </div>
                </Card>

                {/* Missions */}
                <Card className="p-6 neu-raised">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold flex items-center gap-2">
                            <Plane className="text-secondary" /> Missions & Déplacements
                        </h3>
                        <Button size="sm">
                            <Plus className="w-4 h-4 mr-2" /> Nouvelle demande
                        </Button>
                    </div>

                    <div className="space-y-4">
                        {[
                            { dest: "Paris (France)", motif: "COP 29", date: "10-15 Nov", status: "Remboursé", amount: "1.200.000" },
                            { dest: "Port-Gentil", motif: "Commission Terrain", date: "02-04 Nov", status: "En cours", amount: "450.000" },
                            { dest: "Yaoundé (Cameroun)", motif: "Parlement CEMAC", date: "25-28 Oct", status: "Remboursé", amount: "800.000" },
                        ].map((mission, i) => (
                            <div key={i} className="flex justify-between items-center p-3 border border-border rounded-lg">
                                <div>
                                    <div className="font-bold text-sm">{mission.dest}</div>
                                    <div className="text-xs text-muted-foreground">{mission.motif} • {mission.date}</div>
                                </div>
                                <div className="text-right">
                                    <div className="font-mono font-bold text-sm">{mission.amount}</div>
                                    <Badge variant={mission.status === 'Remboursé' ? 'default' : 'secondary'} className="text-[10px] px-1.5 py-0">
                                        {mission.status}
                                    </Badge>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

            </div>
        </div>
    );
};
