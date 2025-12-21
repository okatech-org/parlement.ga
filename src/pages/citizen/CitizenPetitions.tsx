import { useState } from "react";
import {
    Heart, Plus, Search, Filter, Share2, ThumbsUp, MessageSquare,
    AlertCircle, ChevronRight, PenTool
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const CitizenPetitions = () => {
    const petitions = [
        {
            id: 1,
            title: "Pour une meilleure couverture internet en zone rurale",
            author: "Association des Jeunes Connectés",
            date: "12 Déc 2024",
            signatures: 12543,
            goal: 50000,
            status: "En cours",
            description: "Nous demandons au gouvernement d'accélérer le déploiement de la fibre optique dans les provinces de l'intérieur...",
            category: "Numérique"
        },
        {
            id: 2,
            title: "Préservation des parcs nationaux urbains",
            author: "Collectif Libreville Verte",
            date: "05 Nov 2024",
            signatures: 4520,
            goal: 10000,
            status: "Examinée",
            description: "Demande de classement de nouvelles zones forestières urbaines en parcs protégés pour lutter contre l'érosion.",
            category: "Environnement"
        },
        {
            id: 3,
            title: "Réforme du baccalauréat technique",
            author: "Syndicat des Enseignants",
            date: "20 Oct 2024",
            signatures: 8900,
            goal: 15000,
            status: "Clôturée",
            description: "Propositions pour adapter les filières techniques aux besoins réels du marché de l'emploi local.",
            category: "Éducation"
        }
    ];

    return (
        <div className="space-y-6 container mx-auto max-w-6xl pb-10">
            {/* Header */}
            <div className="bg-gradient-to-r from-pink-500 to-rose-500 rounded-xl p-8 text-white text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-6">
                <div>
                    <h1 className="text-3xl font-bold mb-2 flex items-center justify-center md:justify-start gap-3">
                        <Heart className="w-8 h-8 fill-white" />
                        Espace Pétitions
                    </h1>
                    <p className="text-white/90 max-w-xl">
                        Participez à la vie démocratique en signant des pétitions ou en proposant vos propres initiatives citoyennes.
                    </p>
                </div>
                <Button size="lg" className="bg-white text-rose-600 hover:bg-white/90 font-bold shadow-lg">
                    <Plus className="w-5 h-5 mr-2" />
                    Lancer une pétition
                </Button>
            </div>

            {/* Filter & Search */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Rechercher une pétition..." className="pl-9" />
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
                    <Button variant="outline" className="whitespace-nowrap bg-background">
                        <Filter className="w-4 h-4 mr-2" />
                        Toutes les catégories
                    </Button>
                    <Button variant="outline" className="whitespace-nowrap bg-background">
                        Les plus populaires
                    </Button>
                    <Button variant="outline" className="whitespace-nowrap bg-background">
                        Récemment ajoutées
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="encours" className="w-full">
                <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
                    <TabsTrigger value="encours">En cours</TabsTrigger>
                    <TabsTrigger value="signees">Mes signatures</TabsTrigger>
                    <TabsTrigger value="creees">Mes pétitions</TabsTrigger>
                </TabsList>

                <TabsContent value="encours" className="mt-6 space-y-6">
                    {petitions.map((petition) => (
                        <Card key={petition.id} className="hover:border-pink-200 transition-colors">
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div className="space-y-1">
                                        <Badge variant="secondary" className="mb-2 bg-pink-50 text-pink-700 hover:bg-pink-100 border-pink-100">
                                            {petition.category}
                                        </Badge>
                                        <CardTitle className="text-xl hover:text-pink-600 cursor-pointer transition-colors">
                                            {petition.title}
                                        </CardTitle>
                                        <CardDescription className="flex items-center gap-2">
                                            <PenTool className="w-3 h-3" />
                                            Initiée par {petition.author} • le {petition.date}
                                        </CardDescription>
                                    </div>
                                    <Badge variant={petition.status === 'En cours' ? 'default' : 'outline'}>
                                        {petition.status}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <p className="text-muted-foreground line-clamp-2">
                                    {petition.description}
                                </p>

                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm font-medium">
                                        <span className="flex items-center gap-1 text-pink-600">
                                            <Heart className="w-4 h-4 fill-pink-600" />
                                            {petition.signatures.toLocaleString()} signataires
                                        </span>
                                        <span className="text-muted-foreground">Objectif : {petition.goal.toLocaleString()}</span>
                                    </div>
                                    <Progress value={(petition.signatures / petition.goal) * 100} className="h-2 bg-pink-100 [&>div]:bg-pink-500" />
                                </div>
                            </CardContent>
                            <CardFooter className="bg-muted/30 p-4 flex gap-4 justify-end">
                                <Button variant="ghost" size="sm" className="text-muted-foreground">
                                    <Share2 className="w-4 h-4 mr-2" />
                                    Partager
                                </Button>
                                <Button className="bg-pink-600 hover:bg-pink-700 text-white">
                                    <ThumbsUp className="w-4 h-4 mr-2" />
                                    Signer cette pétition
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                    <Button variant="outline" className="w-full py-6 text-muted-foreground border-dashed">
                        Voir plus de pétitions
                    </Button>
                </TabsContent>
                {/* Placeholders for other tabs */}
                <TabsContent value="signees">
                    <div className="bg-muted/20 border-dashed border-2 rounded-xl p-10 text-center space-y-4">
                        <Heart className="w-12 h-12 mx-auto text-muted-foreground/30" />
                        <h3 className="text-lg font-medium text-muted-foreground">Vous n'avez signé aucune pétition pour le moment</h3>
                        <Button variant="secondary">Parcourir les pétitions</Button>
                    </div>
                </TabsContent>
                <TabsContent value="creees">
                    <div className="bg-muted/20 border-dashed border-2 rounded-xl p-10 text-center space-y-4">
                        <PenTool className="w-12 h-12 mx-auto text-muted-foreground/30" />
                        <h3 className="text-lg font-medium text-muted-foreground">Vous n'avez créé aucune pétition</h3>
                        <Button className="bg-pink-600 hover:bg-pink-700 text-white">
                            <Plus className="w-4 h-4 mr-2" />
                            Créer ma première pétition
                        </Button>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default CitizenPetitions;
