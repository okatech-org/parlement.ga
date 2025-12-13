import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, Calendar, FileText, AlertCircle, CheckCircle2 } from "lucide-react";

export const NotificationsSection = () => {
    return (
        <div className="p-6 space-y-6 animate-fade-in">
            <div>
                <h1 className="text-3xl font-serif font-bold mb-2">Notifications</h1>
                <p className="text-muted-foreground">
                    Centre d'alertes et d'informations parlementaires
                </p>
            </div>

            <Card className="p-6 neu-raised">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                        <Bell className="text-primary" /> Récentes
                    </h3>
                    <Button variant="ghost" size="sm">Tout marquer comme lu</Button>
                </div>

                <div className="space-y-4">
                    {[
                        { type: "urgent", icon: AlertCircle, color: "text-red-500", title: "Vote Solennel - Rappel", desc: "Le vote sur la Loi Finances débute dans 1 heure.", time: "Il y a 30 min" },
                        { type: "info", icon: FileText, color: "text-blue-500", title: "Nouveau texte déposé", desc: "Projet de loi sur le numérique disponible dans votre bureau virtuel.", time: "Il y a 2h" },
                        { type: "success", icon: CheckCircle2, color: "text-green-500", title: "Mission Validée", desc: "Votre ordre de mission pour Port-Gentil a été signé.", time: "Hier" },
                        { type: "agenda", icon: Calendar, color: "text-purple-500", title: "Changement de salle", desc: "La Commission des Lois se réunira en Salle Bongo.", time: "Hier" },
                        { type: "info", icon: Bell, color: "text-slate-500", title: "Maintenance Système", desc: "L'E-Hémicycle sera indisponible ce soir de 22h à 00h.", time: "28 Nov" },
                    ].map((notif, i) => {
                        const Icon = notif.icon;
                        return (
                            <div key={i} className={`flex gap-4 p-4 rounded-xl border border-border hover:bg-muted/30 transition-colors ${notif.type === 'urgent' ? 'bg-red-500/5 border-red-500/20' : ''}`}>
                                <div className={`p-2 rounded-full neu-inset h-fit ${notif.color}`}>
                                    <Icon size={20} />
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-1">
                                        <h4 className="font-bold text-sm">{notif.title}</h4>
                                        <span className="text-xs text-muted-foreground">{notif.time}</span>
                                    </div>
                                    <p className="text-sm text-muted-foreground">{notif.desc}</p>
                                </div>
                                {i < 2 && <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>}
                            </div>
                        );
                    })}
                </div>
            </Card>
        </div>
    );
};
