import { useState } from "react";
import {
    Landmark, Users, FileText, Scale, ArrowLeftRight,
    Bell, Calendar, ChevronRight, Shield, Crown,
    CheckCircle, XCircle, Send, BarChart3, Clock,
    AlertTriangle, Gavel, PenTool
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";

/**
 * Espace Président du Sénat
 * Gestion de la navette, ordre du jour, validation des transmissions
 */
const PresidentSenateSpace = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("navette");

    // Statistiques du mandat
    const mandateStats = [
        { label: "Textes reçus", value: 45, subLabel: "Cette législature" },
        { label: "Textes amendés", value: 32, subLabel: "71% du total" },
        { label: "Lois adoptées conformes", value: 13, subLabel: "29% du total" },
        { label: "CMP convoquées", value: 5, subLabel: "Désaccords résolus" },
    ];

    // Textes en attente de transmission
    const pendingTransmissions = [
        {
            id: 1,
            reference: "PL-2024-041",
            title: "Loi organique sur le statut des collectivités",
            status: "SN_ADOPTED",
            votedAt: "12 Déc 2024",
            destination: "PRESIDENCY", // Vers promulgation
        },
        {
            id: 2,
            reference: "PL-2024-039",
            title: "Projet de loi portant code minier",
            status: "SN_ADOPTED",
            votedAt: "10 Déc 2024",
            destination: "ASSEMBLY", // Retour AN (amendé)
        },
    ];

    // Ordre du jour de la prochaine séance
    const agendaItems = [
        {
            id: 1,
            time: "09:00",
            type: "OPENING",
            title: "Ouverture de séance",
        },
        {
            id: 2,
            time: "09:30",
            type: "DEBATE",
            title: "Discussion générale - PL sur la décentralisation",
            reference: "PL-2024-042",
        },
        {
            id: 3,
            time: "11:00",
            type: "VOTE",
            title: "Vote sur les amendements de la Commission",
        },
        {
            id: 4,
            time: "12:00",
            type: "QUESTIONS",
            title: "Questions au Gouvernement",
        },
        {
            id: 5,
            time: "14:30",
            type: "VOTE",
            title: "Vote solennel - Loi de finances 2025",
            reference: "PL-2024-045",
        },
    ];

    return (
        <div className="min-h-screen bg-background">
            {/* Header Présidentiel */}
            <header className="border-b border-border bg-gradient-to-r from-primary/10 to-primary/5 backdrop-blur-sm sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                                <Crown className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <h1 className="text-xl font-serif font-bold text-foreground">Présidence du Sénat</h1>
                                <p className="text-xs text-muted-foreground flex items-center gap-1">
                                    <Landmark className="h-3 w-3" />
                                    Palais Omar Bongo Ondimba
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon" className="relative">
                                <Bell className="h-5 w-5" />
                                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                                    3
                                </span>
                            </Button>
                            <Button variant="destructive" size="sm">
                                <Shield className="h-4 w-4 mr-1" />
                                Sécurité
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => navigate("/")}
                            >
                                <Scale className="h-4 w-4 mr-1" />
                                Parlement
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 py-8">
                {/* Statistiques du mandat */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {mandateStats.map((stat, index) => (
                        <Card key={index} className="bg-card shadow-sm">
                            <CardContent className="p-4 text-center">
                                <p className="text-3xl font-bold text-primary">{stat.value}</p>
                                <p className="font-medium text-foreground">{stat.label}</p>
                                <p className="text-xs text-muted-foreground">{stat.subLabel}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Onglets principaux */}
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="mb-6">
                        <TabsTrigger value="navette" className="flex items-center gap-2">
                            <ArrowLeftRight className="h-4 w-4" />
                            Validation Navette
                        </TabsTrigger>
                        <TabsTrigger value="agenda" className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            Ordre du Jour
                        </TabsTrigger>
                        <TabsTrigger value="stats" className="flex items-center gap-2">
                            <BarChart3 className="h-4 w-4" />
                            Statistiques
                        </TabsTrigger>
                    </TabsList>

                    {/* Validation Navette */}
                    <TabsContent value="navette">
                        <div className="grid lg:grid-cols-2 gap-6">
                            {/* Transmissions en attente */}
                            <Card className="border-l-4 border-l-primary">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Send className="h-5 w-5 text-primary" />
                                        Transmissions en attente
                                    </CardTitle>
                                    <CardDescription>
                                        Textes adoptés par le Sénat, en attente de signature
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {pendingTransmissions.map((text) => (
                                        <div
                                            key={text.id}
                                            className="p-4 bg-muted/30 rounded-lg border"
                                        >
                                            <div className="flex items-start justify-between mb-2">
                                                <Badge variant="outline">{text.reference}</Badge>
                                                <Badge className={
                                                    text.destination === "PRESIDENCY"
                                                        ? "bg-green-500"
                                                        : "bg-blue-500"
                                                }>
                                                    {text.destination === "PRESIDENCY"
                                                        ? "→ Promulgation"
                                                        : "→ Retour AN"}
                                                </Badge>
                                            </div>
                                            <h4 className="font-medium text-foreground mb-2">{text.title}</h4>
                                            <p className="text-sm text-muted-foreground mb-4">
                                                Voté le {text.votedAt}
                                            </p>
                                            <div className="flex gap-2">
                                                <Button size="sm" className="flex-1">
                                                    <PenTool className="h-4 w-4 mr-1" />
                                                    Signer et Transmettre
                                                </Button>
                                                <Button size="sm" variant="outline">
                                                    Détails
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>

                            {/* Convoquer une CMP */}
                            <Card className="border-l-4 border-l-amber-500">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Gavel className="h-5 w-5 text-amber-600" />
                                        Commission Mixte Paritaire
                                    </CardTitle>
                                    <CardDescription>
                                        Convoquer une CMP en cas de désaccord persistant
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="p-4 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-800 mb-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <AlertTriangle className="h-5 w-5 text-amber-600" />
                                            <h4 className="font-medium text-amber-800 dark:text-amber-200">
                                                Texte en désaccord
                                            </h4>
                                        </div>
                                        <p className="text-sm text-amber-700 dark:text-amber-300">
                                            PL-2024-038: "Code de la fonction publique territoriale"
                                        </p>
                                        <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                                            3 navettes effectuées - Désaccord persistant
                                        </p>
                                    </div>
                                    <Button className="w-full bg-amber-600 hover:bg-amber-700">
                                        <ArrowLeftRight className="h-4 w-4 mr-2" />
                                        Convoquer la CMP (7+7)
                                    </Button>
                                    <p className="text-xs text-muted-foreground mt-2 text-center">
                                        7 Sénateurs + 7 Députés seront convoqués
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    {/* Ordre du Jour */}
                    <TabsContent value="agenda">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="flex items-center gap-2">
                                            <Calendar className="h-5 w-5 text-primary" />
                                            Séance Plénière du 18 Décembre 2024
                                        </CardTitle>
                                        <CardDescription>
                                            Ordre du jour définitif
                                        </CardDescription>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm">
                                            Modifier
                                        </Button>
                                        <Button size="sm">
                                            Publier
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {agendaItems.map((item, index) => (
                                        <div
                                            key={item.id}
                                            className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg"
                                        >
                                            <div className="text-center min-w-[60px]">
                                                <Clock className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
                                                <span className="text-sm font-medium">{item.time}</span>
                                            </div>
                                            <div className="w-px h-12 bg-border" />
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <Badge variant={
                                                        item.type === "VOTE" ? "default" :
                                                            item.type === "DEBATE" ? "secondary" :
                                                                item.type === "QUESTIONS" ? "outline" : "secondary"
                                                    }>
                                                        {item.type === "VOTE" ? "Vote" :
                                                            item.type === "DEBATE" ? "Débat" :
                                                                item.type === "QUESTIONS" ? "Questions" :
                                                                    item.type === "OPENING" ? "Ouverture" : item.type}
                                                    </Badge>
                                                    {item.reference && (
                                                        <Badge variant="outline" className="text-xs">
                                                            {item.reference}
                                                        </Badge>
                                                    )}
                                                </div>
                                                <p className="font-medium text-foreground">{item.title}</p>
                                            </div>
                                            <Button variant="ghost" size="icon">
                                                <ChevronRight className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Statistiques */}
                    <TabsContent value="stats">
                        <div className="grid md:grid-cols-2 gap-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Impact du Sénat</CardTitle>
                                    <CardDescription>Textes amendés vs adoptés conformes</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div>
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-sm font-medium">Textes amendés</span>
                                                <span className="text-sm text-muted-foreground">71%</span>
                                            </div>
                                            <Progress value={71} className="h-3" />
                                        </div>
                                        <div>
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-sm font-medium">Adoptés conformes</span>
                                                <span className="text-sm text-muted-foreground">29%</span>
                                            </div>
                                            <Progress value={29} className="h-3 bg-green-100" />
                                        </div>
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-4">
                                        Le Sénat a modifié 32 textes sur 45 reçus de l'Assemblée Nationale
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Délais de traitement</CardTitle>
                                    <CardDescription>Respect des délais constitutionnels</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950/30 rounded-lg">
                                            <div className="flex items-center gap-2">
                                                <CheckCircle className="h-5 w-5 text-green-600" />
                                                <span className="font-medium">Dans les délais</span>
                                            </div>
                                            <span className="text-xl font-bold text-green-600">42</span>
                                        </div>
                                        <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-950/30 rounded-lg">
                                            <div className="flex items-center gap-2">
                                                <XCircle className="h-5 w-5 text-red-600" />
                                                <span className="font-medium">Hors délai</span>
                                            </div>
                                            <span className="text-xl font-bold text-red-600">3</span>
                                        </div>
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-4">
                                        93% des textes traités dans le délai de 20 jours
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};

export default PresidentSenateSpace;
