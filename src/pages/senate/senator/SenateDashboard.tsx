import { useState } from "react";
import {
    Landmark, Users, FileText, MapPin, ArrowLeftRight,
    Bell, Calendar, ChevronRight, AlertTriangle, Scale,
    Crown, MessageSquare, BarChart3, Clock, LayoutDashboard,
    Eye, Clipboard
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import LocalCollectivityFeed from "@/components/senate/LocalCollectivityFeed";

// Boutons d'accès rapide aux fonctionnalités
const QUICK_ACCESS = [
    { label: "Doléances", path: "/senat/espace/doleances", icon: AlertTriangle, color: "bg-amber-500", count: 12 },
    { label: "Visites terrain", path: "/senat/espace/visites", icon: MapPin, color: "bg-blue-500", count: 3 },
    { label: "Textes navette", path: "/senat/espace/navette", icon: ArrowLeftRight, color: "bg-primary", count: 8 },
    { label: "Messages", path: "/senat/espace/messages", icon: MessageSquare, color: "bg-green-500", count: 5 },
];

/**
 * Dashboard Sénateur - Espace de travail du Sénateur
 * Intègre la gestion territoriale et législative avec une structure à onglets
 */
const SenateDashboard = () => {
    const navigate = useNavigate();
    const [province] = useState("Woleu-Ntem"); // À dynamiser avec le service profil
    const [activeTab, setActiveTab] = useState("overview");

    // Données simulées pour la vue synthétique
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
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                    <TabsList className="grid w-full grid-cols-3 max-w-[600px]">
                        <TabsTrigger value="overview" className="flex items-center gap-2">
                            <LayoutDashboard className="h-4 w-4" />
                            Vue d'ensemble
                        </TabsTrigger>
                        <TabsTrigger value="territory" className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            Territoires
                        </TabsTrigger>
                        <TabsTrigger value="legislation" className="flex items-center gap-2">
                            <ArrowLeftRight className="h-4 w-4" />
                            Législation
                        </TabsTrigger>
                    </TabsList>

                    {/* Onglet Vue d'ensemble */}
                    <TabsContent value="overview" className="space-y-6">
                        {/* Accès rapide aux fonctionnalités */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {QUICK_ACCESS.map((item, index) => {
                                const Icon = item.icon;
                                return (
                                    <Card 
                                        key={index} 
                                        className="cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1"
                                        onClick={() => navigate(item.path)}
                                    >
                                        <CardContent className="p-4">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className={`p-2 rounded-lg ${item.color}`}>
                                                    <Icon className="h-5 w-5 text-white" />
                                                </div>
                                                <Badge variant="secondary">{item.count}</Badge>
                                            </div>
                                            <p className="font-medium text-sm">{item.label}</p>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>

                        {/* Stats rapides */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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

                        <div className="grid lg:grid-cols-2 gap-6">
                            {/* Widget Navette (Résumé) */}
                            <Card className="border-l-4 border-l-primary h-full">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <ArrowLeftRight className="h-5 w-5 text-primary" />
                                        Navette - Urgences
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {navetteTexts.slice(0, 2).map((text) => (
                                        <div key={text.id} className="p-3 bg-muted/30 rounded-lg border border-transparent hover:border-border transition-colors">
                                            <div className="flex justify-between mb-1">
                                                <span className="text-xs font-bold text-foreground/80">{text.reference}</span>
                                                <Badge variant={text.priority === 'urgent' ? 'destructive' : 'default'} className="h-5 text-[10px]">
                                                    {text.daysLeft}j restants
                                                </Badge>
                                            </div>
                                            <p className="font-medium text-sm line-clamp-1">{text.title}</p>
                                        </div>
                                    ))}
                                    <Button variant="outline" className="w-full mt-2" onClick={() => setActiveTab("legislation")}>
                                        Voir tous les textes
                                        <ChevronRight className="ml-1 h-3 w-3" />
                                    </Button>
                                </CardContent>
                            </Card>

                            {/* Widget Commission */}
                            <Card className="bg-primary/5 border-primary/20 h-full flex flex-col justify-center">
                                <CardContent className="p-6">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="p-3 bg-primary/10 rounded-full">
                                            <AlertTriangle className="h-8 w-8 text-primary" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-lg text-primary">Commission des Collectivités</h4>
                                            <p className="text-sm text-muted-foreground">Prochaine réunion : Demain à 10h00</p>
                                            <p className="text-xs text-muted-foreground mt-1">Salle B12 - Examen du PL Décentralisation</p>
                                        </div>
                                    </div>
                                    <Button className="w-full">Consulter l'ordre du jour</Button>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    {/* Onglet Territoires - Intègre le nouveau composant */}
                    <TabsContent value="territory">
                        <LocalCollectivityFeed senatorProvince={province} />
                    </TabsContent>

                    {/* Onglet Législation (Placeholder amélioré) */}
                    <TabsContent value="legislation">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <FileText className="h-5 w-5 text-primary" />
                                    Textes en Navette Parlementaire
                                </CardTitle>
                                <CardDescription>Suivi détaillé des textes transmis par l'Assemblée Nationale</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {navetteTexts.map((text) => (
                                        <div
                                            key={text.id}
                                            className="p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer border border-border/50"
                                        >
                                            <div className="flex items-start justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    <Badge variant="outline">
                                                        {text.reference}
                                                    </Badge>
                                                    {text.isCollectivity && (
                                                        <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-200 border-amber-200">
                                                            <Crown className="h-3 w-3 mr-1" />
                                                            Collectivités
                                                        </Badge>
                                                    )}
                                                </div>
                                                <Badge
                                                    className={
                                                        text.priority === "urgent" ? "bg-red-500 hover:bg-red-600" :
                                                            text.priority === "high" ? "bg-orange-500 hover:bg-orange-600" : "bg-green-500 hover:bg-green-600"
                                                    }
                                                >
                                                    {text.daysLeft} jours restants
                                                </Badge>
                                            </div>
                                            <h4 className="font-medium text-foreground mb-2 text-lg">{text.title}</h4>
                                            <div className="flex items-center justify-between text-sm text-muted-foreground">
                                                <span>Reçu le {text.receivedAt}</span>
                                                <span className="flex items-center gap-1">
                                                    <Clock className="h-3 w-3" />
                                                    Échéance: {text.deadline}
                                                </span>
                                            </div>
                                            <Progress
                                                value={100 - (text.daysLeft / 20) * 100}
                                                className="mt-3 h-2"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};

export default SenateDashboard;
