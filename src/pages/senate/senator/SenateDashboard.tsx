import { useState, useEffect } from "react";
import {
    Landmark, Users, FileText, MapPin, ArrowLeftRight,
    Bell, Calendar, ChevronRight, AlertTriangle, Scale,
    Crown, MessageSquare, BarChart3, Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";

/**
 * Dashboard Sénateur - Espace de travail du Sénateur
 * Design cohérent avec l'AN, fonctionnalités spécifiques au Sénat
 */
const SenateDashboard = () => {
    const navigate = useNavigate();
    const [province] = useState("Woleu-Ntem"); // Récupérer depuis le profil

    // Données simulées
    const stats = [
        { label: "Textes à examiner", value: 8, icon: FileText, color: "text-primary" },
        { label: "Doléances locales", value: 12, icon: MessageSquare, color: "text-amber-600" },
        { label: "Visites terrain", value: 3, icon: MapPin, color: "text-blue-600" },
        { label: "Jours restants session", value: 45, icon: Calendar, color: "text-emerald-600" },
    ];

    const navetteTexts = [
        {
            id: 1,
            reference: "PL-2024-045",
            title: "Loi de finances pour l'exercice 2025",
            receivedAt: "10 Déc 2024",
            deadline: "30 Déc 2024",
            daysLeft: 16,
            priority: "high",
        },
        {
            id: 2,
            reference: "PL-2024-042",
            title: "Projet de loi sur la décentralisation territoriale",
            receivedAt: "5 Déc 2024",
            deadline: "25 Déc 2024",
            daysLeft: 11,
            priority: "urgent",
            isCollectivity: true,
        },
        {
            id: 3,
            reference: "PPL-2024-018",
            title: "Proposition de loi relative à la protection de l'environnement",
            receivedAt: "1 Déc 2024",
            deadline: "21 Déc 2024",
            daysLeft: 7,
            priority: "normal",
        },
    ];

    const localGrievances = [
        {
            id: 1,
            source: "Maire de Bitam",
            title: "Réfection de la route Bitam-Minvoul",
            category: "INFRASTRUCTURE",
            priority: 2,
        },
        {
            id: 2,
            source: "Conseil Départemental Woleu",
            title: "Demande de construction d'un centre de santé",
            category: "HEALTH",
            priority: 1,
        },
        {
            id: 3,
            source: "Préfet de Oyem",
            title: "Électrification rurale du canton d'Essong",
            category: "INFRASTRUCTURE",
            priority: 1,
        },
    ];

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Landmark className="h-8 w-8 text-primary" />
                            <div>
                                <h1 className="text-xl font-serif font-bold text-foreground">Espace Sénateur</h1>
                                <p className="text-xs text-muted-foreground flex items-center gap-1">
                                    <MapPin className="h-3 w-3" />
                                    Province: {province}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => navigate("/")}
                            >
                                <Scale className="h-4 w-4 mr-1" />
                                Parlement
                            </Button>
                            <Button variant="ghost" size="icon">
                                <Bell className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 py-8">
                {/* Stats rapides */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {stats.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <Card key={index} className="bg-card shadow-sm hover:shadow-md transition-shadow">
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                                            <p className="text-sm text-muted-foreground">{stat.label}</p>
                                        </div>
                                        <Icon className={`h-8 w-8 ${stat.color} opacity-70`} />
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Widget Navette Parlementaire */}
                    <div className="lg:col-span-2">
                        <Card className="border-l-4 border-l-primary">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="flex items-center gap-2">
                                            <ArrowLeftRight className="h-5 w-5 text-primary" />
                                            Navette Parlementaire
                                        </CardTitle>
                                        <CardDescription>
                                            Textes en attente de deuxième lecture
                                        </CardDescription>
                                    </div>
                                    <Button variant="outline" size="sm">
                                        Voir tout
                                        <ChevronRight className="ml-1 h-4 w-4" />
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {navetteTexts.map((text) => (
                                    <div
                                        key={text.id}
                                        className="p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                                    >
                                        <div className="flex items-start justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <Badge variant="outline" className="text-xs">
                                                    {text.reference}
                                                </Badge>
                                                {text.isCollectivity && (
                                                    <Badge className="bg-amber-100 text-amber-700 text-xs">
                                                        <Crown className="h-3 w-3 mr-1" />
                                                        Collectivités
                                                    </Badge>
                                                )}
                                            </div>
                                            <Badge
                                                className={
                                                    text.priority === "urgent" ? "bg-red-500" :
                                                        text.priority === "high" ? "bg-orange-500" : "bg-green-500"
                                                }
                                            >
                                                {text.daysLeft}j restants
                                            </Badge>
                                        </div>
                                        <h4 className="font-medium text-foreground mb-2">{text.title}</h4>
                                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                                            <span>Reçu le {text.receivedAt}</span>
                                            <span className="flex items-center gap-1">
                                                <Clock className="h-3 w-3" />
                                                Échéance: {text.deadline}
                                            </span>
                                        </div>
                                        <Progress
                                            value={100 - (text.daysLeft / 20) * 100}
                                            className="mt-2 h-1"
                                        />
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Widget Territoires */}
                    <div className="space-y-6">
                        {/* Doléances locales */}
                        <Card className="border-l-4 border-l-amber-500">
                            <CardHeader className="pb-2">
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <MessageSquare className="h-5 w-5 text-amber-600" />
                                    Remontées du Terrain
                                </CardTitle>
                                <CardDescription>
                                    {province} - Doléances en attente
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {localGrievances.map((grievance) => (
                                    <div
                                        key={grievance.id}
                                        className="p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                                    >
                                        <div className="flex items-start justify-between mb-1">
                                            <Badge
                                                variant="outline"
                                                className={
                                                    grievance.priority === 2 ? "border-red-500 text-red-600" :
                                                        "border-amber-500 text-amber-600"
                                                }
                                            >
                                                {grievance.priority === 2 ? "Urgent" : "Important"}
                                            </Badge>
                                            <Badge variant="secondary" className="text-xs">
                                                {grievance.category}
                                            </Badge>
                                        </div>
                                        <h5 className="font-medium text-sm text-foreground">{grievance.title}</h5>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            De: {grievance.source}
                                        </p>
                                    </div>
                                ))}
                                <Button variant="outline" className="w-full">
                                    Voir toutes les doléances
                                    <ChevronRight className="ml-2 h-4 w-4" />
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Actions rapides */}
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg">Actions Rapides</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <Button variant="outline" className="w-full justify-start">
                                    <FileText className="mr-2 h-4 w-4" />
                                    Déposer un amendement
                                </Button>
                                <Button variant="outline" className="w-full justify-start">
                                    <MapPin className="mr-2 h-4 w-4" />
                                    Rapport de visite terrain
                                </Button>
                                <Button variant="outline" className="w-full justify-start">
                                    <Users className="mr-2 h-4 w-4" />
                                    Messagerie élus locaux
                                </Button>
                                <Button variant="outline" className="w-full justify-start">
                                    <BarChart3 className="mr-2 h-4 w-4" />
                                    Mes statistiques
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Alerte Commission des Collectivités */}
                <Card className="mt-6 bg-primary/5 border-primary/20">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                            <AlertTriangle className="h-8 w-8 text-primary" />
                            <div className="flex-1">
                                <h4 className="font-semibold text-foreground">Commission des Collectivités Locales</h4>
                                <p className="text-sm text-muted-foreground">
                                    Prochaine réunion le 18 Décembre 2024 à 10h00 - Salle B12 du Palais Omar Bongo Ondimba
                                </p>
                            </div>
                            <Button size="sm">
                                Voir l'ordre du jour
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default SenateDashboard;
