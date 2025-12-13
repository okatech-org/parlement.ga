import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mic2, FileText, Send, Clock, CheckCircle } from "lucide-react";

export const QuestionsSection = () => {
    return (
        <div className="p-6 space-y-6 animate-fade-in">
            <div>
                <h1 className="text-3xl font-serif font-bold mb-2">Questions au Gouvernement</h1>
                <p className="text-muted-foreground">
                    Contrôle de l'action gouvernementale : Questions Orales et Écrites
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">

                {/* Questions Orales */}
                <Card className="p-6 neu-raised h-full flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold flex items-center gap-2">
                            <Mic2 className="text-primary" /> Questions Orales
                        </h3>
                        <Button size="sm">
                            <Send className="w-4 h-4 mr-2" /> Inscrire une question
                        </Button>
                    </div>

                    <div className="bg-primary/5 p-4 rounded-xl mb-6 border border-primary/10">
                        <h4 className="font-bold text-primary mb-2">Prochaine séance de QAG</h4>
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">Mardi 12 Décembre à 15h00</span>
                            <Badge>Séance Publique</Badge>
                        </div>
                        <div className="mt-3 text-sm text-muted-foreground">
                            Vous avez <strong>1</strong> question inscrite à l'ordre du jour.
                        </div>
                    </div>

                    <div className="space-y-4 flex-1">
                        <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Vos dernières interventions</h4>
                        <div className="p-4 neu-inset rounded-xl">
                            <div className="flex justify-between mb-2">
                                <Badge variant="outline">Éducation</Badge>
                                <span className="text-xs text-muted-foreground">28 Nov 2024</span>
                            </div>
                            <p className="font-medium text-sm mb-2">Sur la réhabilitation des lycées techniques de l'Estuaire.</p>
                            <div className="flex items-center gap-2 text-xs text-green-600">
                                <CheckCircle className="w-3 h-3" /> Réponse du Ministre obtenue
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Questions Écrites */}
                <Card className="p-6 neu-raised h-full flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold flex items-center gap-2">
                            <FileText className="text-secondary" /> Questions Écrites
                        </h3>
                        <Button size="sm" variant="secondary">
                            <Send className="w-4 h-4 mr-2" /> Rédiger
                        </Button>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="text-center p-3 neu-inset rounded-lg">
                            <div className="text-2xl font-bold text-primary">12</div>
                            <div className="text-xs text-muted-foreground">Posées (2025)</div>
                        </div>
                        <div className="text-center p-3 neu-inset rounded-lg">
                            <div className="text-2xl font-bold text-orange-500">2</div>
                            <div className="text-xs text-muted-foreground">En attente</div>
                        </div>
                        <div className="text-center p-3 neu-inset rounded-lg">
                            <div className="text-2xl font-bold text-green-500">10</div>
                            <div className="text-xs text-muted-foreground">Répondues</div>
                        </div>
                    </div>

                    <div className="space-y-3 flex-1 overflow-y-auto max-h-[300px] pr-2">
                        {[
                            { status: "waiting", title: "Desserte en eau potable à Oyem", date: "Il y a 15 jours" },
                            { status: "waiting", title: "Entretien de la route nationale 2", date: "Il y a 20 jours" },
                            { status: "answered", title: "Postes budgétaires Santé", date: "Répondu le 10/11" },
                        ].map((q, i) => (
                            <div key={i} className="p-3 border border-border rounded-lg hover:bg-muted/30 transition-colors cursor-pointer">
                                <div className="flex justify-between items-start mb-1">
                                    <span className="font-medium text-sm line-clamp-1">{q.title}</span>
                                    {q.status === 'waiting' ? (
                                        <Clock className="w-4 h-4 text-orange-500 shrink-0" />
                                    ) : (
                                        <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                                    )}
                                </div>
                                <div className="text-xs text-muted-foreground">{q.date}</div>
                            </div>
                        ))}
                    </div>
                </Card>

            </div>
        </div>
    );
};
