import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Vote, Clock, CheckCircle2, XCircle, AlertCircle } from "lucide-react";

export const HemicycleSection = () => {
    return (
        <div className="p-6 space-y-6 animate-fade-in">
            <div>
                <h1 className="text-3xl font-serif font-bold mb-2">E-Hémicycle</h1>
                <p className="text-muted-foreground">
                    Système de vote électronique sécurisé et suivi des séances
                </p>
            </div>

            {/* Active Vote Card */}
            <Card className="p-6 neu-raised border-primary/20">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <Badge variant="outline" className="mb-2 bg-green-500/10 text-green-600 border-green-500/20 animate-pulse">
                            <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                            Vote en cours
                        </Badge>
                        <h3 className="text-xl font-serif font-bold mt-2">
                            Loi portant protection de l'environnement et des forêts
                        </h3>
                    </div>
                    <div className="text-right">
                        <div className="text-sm text-muted-foreground">Temps restant</div>
                        <div className="text-2xl font-mono font-bold text-primary">04:12:59</div>
                    </div>
                </div>

                <div className="bg-muted/30 p-4 rounded-xl mb-6 text-sm">
                    <p className="mb-2"><strong>Résumé :</strong> Ce projet de loi vise à renforcer les sanctions contre l'exploitation forestière illégale et à promouvoir la gestion durable des ressources.</p>
                    <div className="flex gap-2">
                        <Badge variant="secondary">Commission Environnement</Badge>
                        <Badge variant="outline">Lecture 1</Badge>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button className="bg-green-600 hover:bg-green-700 text-white h-12 text-lg shadow-md hover:shadow-lg transition-all">
                        <CheckCircle2 className="mr-2" /> POUR
                    </Button>
                    <Button className="bg-red-600 hover:bg-red-700 text-white h-12 text-lg shadow-md hover:shadow-lg transition-all">
                        <XCircle className="mr-2" /> CONTRE
                    </Button>
                    <Button className="bg-slate-500 hover:bg-slate-600 text-white h-12 text-lg shadow-md hover:shadow-lg transition-all">
                        <AlertCircle className="mr-2" /> ABSTENTION
                    </Button>
                </div>
            </Card>

            {/* History and Upcoming */}
            <div className="grid md:grid-cols-2 gap-6">
                <Card className="p-6 neu-raised">
                    <h3 className="font-bold mb-4 flex items-center gap-2">
                        <Clock className="text-primary" size={20} /> Historique de vos votes
                    </h3>
                    <div className="space-y-4">
                        {[
                            { title: "Budget de l'État 2025", date: "28 Nov 2024", vote: "Pour", color: "text-green-600" },
                            { title: "Loi Numérique", date: "15 Nov 2024", vote: "Pour", color: "text-green-600" },
                            { title: "Réforme Fiscale", date: "02 Nov 2024", vote: "Abstention", color: "text-slate-500" },
                        ].map((item, i) => (
                            <div key={i} className="flex justify-between items-center p-3 neu-inset rounded-lg">
                                <div>
                                    <div className="font-semibold text-sm">{item.title}</div>
                                    <div className="text-xs text-muted-foreground">{item.date}</div>
                                </div>
                                <div className={`font-bold text-sm ${item.color}`}>{item.vote}</div>
                            </div>
                        ))}
                    </div>
                </Card>

                <Card className="p-6 neu-raised">
                    <h3 className="font-bold mb-4 flex items-center gap-2">
                        <Vote className="text-secondary" size={20} /> Prochaines Séances
                    </h3>
                    <div className="space-y-4">
                        <div className="p-3 border border-border rounded-lg">
                            <div className="flex justify-between mb-1">
                                <span className="font-bold text-sm">Mardi 05 Déc</span>
                                <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">14:00</span>
                            </div>
                            <p className="text-sm text-muted-foreground">Questions au Gouvernement</p>
                        </div>
                        <div className="p-3 border border-border rounded-lg">
                            <div className="flex justify-between mb-1">
                                <span className="font-bold text-sm">Jeudi 07 Déc</span>
                                <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">09:30</span>
                            </div>
                            <p className="text-sm text-muted-foreground">Examen Projet de Loi Finances</p>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};
