import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, User, MapPin, Award, Calendar, AlertCircle, FileText, CheckCircle2, ArrowRight } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const DashboardSection = () => {
    return (
        <div className="p-6 space-y-6 animate-fade-in">
            <div>
                <h1 className="text-3xl font-serif font-bold mb-2">Tableau de Bord</h1>
                <p className="text-muted-foreground">
                    Bienvenue, Honorable Jean Dupont. Voici votre aperçu quotidien.
                </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">

                {/* Left Column: Profile & Quick Actions */}
                <div className="space-y-6">
                    {/* Profile Card */}
                    <Card className="p-6 neu-raised text-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-primary/20 to-secondary/20"></div>
                        <div className="relative mt-8 mb-4">
                            <Avatar className="w-24 h-24 mx-auto border-4 border-background shadow-xl">
                                <AvatarImage src="/placeholder-avatar.jpg" />
                                <AvatarFallback className="text-2xl bg-primary text-primary-foreground">JD</AvatarFallback>
                            </Avatar>
                            <Badge className="absolute bottom-0 right-1/2 translate-x-12 translate-y-2 bg-green-500 hover:bg-green-600 border-2 border-background">
                                Actif
                            </Badge>
                        </div>

                        <h2 className="text-xl font-bold font-serif">Hon. Jean Dupont</h2>
                        <p className="text-sm text-muted-foreground mb-4">Député de la 1ère Circonscription du Komo</p>

                        <div className="flex justify-center gap-2 mb-6">
                            <Badge variant="secondary" className="font-normal">Parti Démocratique</Badge>
                            <Badge variant="outline" className="font-normal">Commission Finances</Badge>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-left text-sm border-t border-border pt-4">
                            <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-muted-foreground" />
                                <span className="truncate">Kango, Estuaire</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Award className="w-4 h-4 text-muted-foreground" />
                                <span>Mandat 2023-2028</span>
                            </div>
                        </div>
                    </Card>

                    {/* Next Agenda Item */}
                    <Card className="p-6 neu-raised bg-primary/5 border-primary/10">
                        <h3 className="font-bold text-primary mb-4 flex items-center gap-2">
                            <Calendar className="w-5 h-5" /> Prochain Rendez-vous
                        </h3>
                        <div className="space-y-1 mb-4">
                            <div className="text-2xl font-bold">15:00</div>
                            <div className="font-medium">Questions au Gouvernement</div>
                            <div className="text-sm text-muted-foreground">Hémicycle • Séance Publique</div>
                        </div>
                        <Button className="w-full shadow-md">Voir l'agenda complet</Button>
                    </Card>
                </div>

                {/* Right Column: Notifications & Activity */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Notifications Widget */}
                    <Card className="p-6 neu-raised">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold flex items-center gap-2">
                                <Bell className="text-primary" /> Notifications Récentes
                            </h3>
                            <Button variant="ghost" size="sm" className="text-xs">Tout marquer comme lu</Button>
                        </div>

                        <div className="space-y-4">
                            {[
                                { type: "urgent", icon: AlertCircle, color: "text-red-500", bg: "bg-red-500/10", title: "Vote Solennel - Rappel", desc: "Le vote sur la Loi Finances débute dans 1 heure.", time: "Il y a 30 min" },
                                { type: "info", icon: FileText, color: "text-blue-500", bg: "bg-blue-500/10", title: "Nouveau texte déposé", desc: "Projet de loi sur le numérique disponible dans votre bureau virtuel.", time: "Il y a 2h" },
                                { type: "success", icon: CheckCircle2, color: "text-green-500", bg: "bg-green-500/10", title: "Mission Validée", desc: "Votre ordre de mission pour Port-Gentil a été signé.", time: "Hier" },
                            ].map((notif, i) => {
                                const Icon = notif.icon;
                                return (
                                    <div key={i} className="flex gap-4 p-4 rounded-xl border border-border/50 hover:bg-muted/30 transition-colors group cursor-pointer">
                                        <div className={`p-3 rounded-full ${notif.bg} ${notif.color} h-fit`}>
                                            <Icon size={20} />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start mb-1">
                                                <h4 className="font-bold text-sm group-hover:text-primary transition-colors">{notif.title}</h4>
                                                <span className="text-xs text-muted-foreground">{notif.time}</span>
                                            </div>
                                            <p className="text-sm text-muted-foreground line-clamp-1">{notif.desc}</p>
                                        </div>
                                        {i === 0 && <div className="w-2 h-2 rounded-full bg-red-500 mt-2 animate-pulse"></div>}
                                    </div>
                                );
                            })}
                        </div>

                        <Button variant="ghost" className="w-full mt-4 text-muted-foreground hover:text-primary">
                            Voir toutes les notifications <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </Card>

                    {/* Quick Stats / Activity */}
                    <div className="grid sm:grid-cols-3 gap-4">
                        <Card className="p-4 neu-raised flex flex-col items-center justify-center text-center hover:scale-[1.02] transition-transform cursor-pointer">
                            <div className="text-3xl font-bold text-primary mb-1">85%</div>
                            <div className="text-xs text-muted-foreground">Présence Hémicycle</div>
                        </Card>
                        <Card className="p-4 neu-raised flex flex-col items-center justify-center text-center hover:scale-[1.02] transition-transform cursor-pointer">
                            <div className="text-3xl font-bold text-secondary mb-1">12</div>
                            <div className="text-xs text-muted-foreground">Questions Posées</div>
                        </Card>
                        <Card className="p-4 neu-raised flex flex-col items-center justify-center text-center hover:scale-[1.02] transition-transform cursor-pointer">
                            <div className="text-3xl font-bold text-green-500 mb-1">20</div>
                            <div className="text-xs text-muted-foreground">Doléances Traitées</div>
                        </Card>
                    </div>

                </div>

            </div>
        </div>
    );
};
