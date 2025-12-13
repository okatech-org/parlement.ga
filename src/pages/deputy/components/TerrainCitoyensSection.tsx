import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Map, TrendingUp, MessageSquare, AlertTriangle, CheckCircle2 } from "lucide-react";
import GabonMap from "@/components/map/GabonMap";
import RegionalStats from "@/components/map/RegionalStats";

export const TerrainCitoyensSection = () => {
    return (
        <div className="p-6 space-y-6 animate-fade-in">
            <div>
                <h1 className="text-3xl font-serif font-bold mb-2">Terrain & Citoyens</h1>
                <p className="text-muted-foreground">
                    Gestion de la circonscription, statistiques locales et doléances citoyennes (CRM)
                </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">

                {/* KPI Cards */}
                <Card className="p-4 neu-raised flex items-center gap-4">
                    <div className="p-3 rounded-full neu-inset text-blue-500">
                        <TrendingUp size={24} />
                    </div>
                    <div>
                        <div className="text-2xl font-bold">20</div>
                        <div className="text-xs text-muted-foreground">Doléances actives</div>
                    </div>
                </Card>
                <Card className="p-4 neu-raised flex items-center gap-4">
                    <div className="p-3 rounded-full neu-inset text-green-500">
                        <Map size={24} />
                    </div>
                    <div>
                        <div className="text-2xl font-bold">5</div>
                        <div className="text-xs text-muted-foreground">Projets locaux</div>
                    </div>
                </Card>
                <Card className="p-4 neu-raised flex items-center gap-4">
                    <div className="p-3 rounded-full neu-inset text-orange-500">
                        <MessageSquare size={24} />
                    </div>
                    <div>
                        <div className="text-2xl font-bold">128</div>
                        <div className="text-xs text-muted-foreground">Messages citoyens</div>
                    </div>
                </Card>

                {/* Map Section */}
                <Card className="lg:col-span-2 p-6 neu-raised min-h-[500px]">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-lg">Carte des Doléances</h3>
                        <div className="flex gap-2 text-xs">
                            <div className="flex items-center gap-1">
                                <div className="h-3 w-3 rounded-full bg-blue-500" />
                                <span>Eau/Élec</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <div className="h-3 w-3 rounded-full bg-red-500" />
                                <span>Santé</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <div className="h-3 w-3 rounded-full bg-purple-500" />
                                <span>Route</span>
                            </div>
                        </div>
                    </div>
                    <div className="h-[400px] w-full">
                        <GabonMap />
                    </div>
                </Card>

                {/* Sidebar Stats & Recent Requests */}
                <div className="space-y-6">
                    <RegionalStats />

                    <Card className="p-6 neu-raised">
                        <h4 className="font-bold mb-4 text-sm uppercase tracking-wider text-muted-foreground">Dernières Remontées</h4>
                        <div className="space-y-3">
                            <div className="p-3 bg-muted/30 rounded-xl border-l-4 border-red-500 hover:bg-muted/50 transition-colors cursor-pointer">
                                <div className="flex justify-between items-start mb-1">
                                    <Badge variant="outline" className="text-[10px] px-1 py-0 border-red-200 text-red-600">Urgent</Badge>
                                    <span className="text-[10px] text-muted-foreground">Il y a 2h</span>
                                </div>
                                <div className="font-bold text-sm mb-1">Manque de médicaments</div>
                                <div className="text-xs text-muted-foreground line-clamp-2">
                                    Le dispensaire de Bitam manque de stocks d'antibiotiques depuis 3 semaines.
                                </div>
                            </div>

                            <div className="p-3 bg-muted/30 rounded-xl border-l-4 border-blue-500 hover:bg-muted/50 transition-colors cursor-pointer">
                                <div className="flex justify-between items-start mb-1">
                                    <Badge variant="outline" className="text-[10px] px-1 py-0 border-blue-200 text-blue-600">Infra</Badge>
                                    <span className="text-[10px] text-muted-foreground">Hier</span>
                                </div>
                                <div className="font-bold text-sm mb-1">Pont endommagé</div>
                                <div className="text-xs text-muted-foreground line-clamp-2">
                                    Le pont sur la rivière Ntem nécessite des réparations urgentes avant la saison des pluies.
                                </div>
                            </div>

                            <Button variant="ghost" size="sm" className="w-full text-xs text-primary">
                                Voir toutes les doléances
                            </Button>
                        </div>
                    </Card>
                </div>

            </div>
        </div>
    );
};
