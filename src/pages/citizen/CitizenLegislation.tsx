import { useState } from "react";
import {
    Search, Filter, BookOpen, ChevronRight,
    Calendar, Building2, Landmark, Scale, FileText,
    ArrowRight
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const CitizenLegislation = () => {
    const [searchTerm, setSearchTerm] = useState("");

    const texts = [
        {
            id: 1,
            title: "Projet de loi sur la transition numérique",
            type: "Projet de loi",
            chamber: "AN",
            status: "En commission",
            date: "depuis le 15 Déc 2024",
            summary: "Modernisation des infrastructures numériques de l'administration publique.",
            tags: ["Numérique", "Administration", "Innovation"]
        },
        {
            id: 2,
            title: "Proposition de loi sur la protection des forêts",
            type: "Proposition de loi",
            chamber: "Sénat",
            status: "1ère lecture",
            date: "depuis le 10 Déc 2024",
            summary: "Renforcement des sanctions contre l'exploitation forestière illégale.",
            tags: ["Environnement", "Justice", "Écologie"]
        },
        {
            id: 3,
            title: "Budget de l'État 2025",
            type: "Projet de loi de finances",
            chamber: "Congrès",
            status: "Vote solennel",
            date: "Vote prévu le 20 Déc 2024",
            summary: "Loi de finances pour l'exercice 2025.",
            tags: ["Budget", "Économie", "Finance"]
        },
        {
            id: 4,
            title: "Loi sur l'encadrement des loyers",
            type: "Projet de loi",
            chamber: "AN",
            status: "Adopté",
            date: "Promulguée le 01 Déc 2024",
            summary: "Mesures pour limiter la hausse des loyers dans les zones tendues.",
            tags: ["Logement", "Social", "Urbanisme"]
        }
    ];

    const getChamberColor = (chamber: string) => {
        switch (chamber) {
            case 'AN': return "text-[#3A87FD] border-[#3A87FD] bg-[#3A87FD]/10";
            case 'Sénat': return "text-[#D19C00] border-[#D19C00] bg-[#D19C00]/10";
            case 'Congrès': return "text-[#77BA41] border-[#77BA41] bg-[#77BA41]/10";
            default: return "text-muted-foreground border-muted bg-muted";
        }
    };

    const getStatusColor = (status: string) => {
        if (status === "Adopté") return "bg-green-500/10 text-green-600 hover:bg-green-500/20";
        if (status === "Rejeté") return "bg-red-500/10 text-red-600 hover:bg-red-500/20";
        return "bg-blue-500/10 text-blue-600 hover:bg-blue-500/20";
    };

    return (
        <div className="space-y-6 container mx-auto max-w-6xl pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-card p-6 rounded-xl border shadow-sm">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <BookOpen className="w-6 h-6 text-[#04CDB9]" />
                        Suivi Législatif
                    </h1>
                    <p className="text-muted-foreground mt-1">Consultez et suivez l'évolution des textes de loi en temps réel.</p>
                </div>
                <div className="flex gap-2">
                    <Button className="bg-[#04CDB9] hover:bg-[#03A89A] text-white">
                        <Filter className="w-4 h-4 mr-2" />
                        Filtres avancés
                    </Button>
                </div>
            </div>

            {/* Search & Statistics */}
            <div className="grid md:grid-cols-3 gap-6">
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle className="text-lg">Rechercher un texte</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex gap-3">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Mots-clés, titre, numéro..."
                                    className="pl-9"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <Select defaultValue="tous">
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Type de texte" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="tous">Tous les types</SelectItem>
                                    <SelectItem value="projet">Projets de loi</SelectItem>
                                    <SelectItem value="proposition">Propositions de loi</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-[#04CDB9]/10 border-[#04CDB9]/20">
                    <CardContent className="p-6 flex flex-col justify-center h-full items-center text-center">
                        <div className="text-4xl font-bold text-[#04CDB9] mb-1">12</div>
                        <div className="font-medium text-[#03A89A]">Textes en cours d'examen</div>
                        <p className="text-xs text-muted-foreground mt-2">Cette session parlementaire</p>
                    </CardContent>
                </Card>
            </div>

            {/* Tabs & List */}
            <Tabs defaultValue="tous" className="w-full">
                <TabsList className="grid w-full grid-cols-4 lg:w-[400px]">
                    <TabsTrigger value="tous">Tous</TabsTrigger>
                    <TabsTrigger value="an">AN</TabsTrigger>
                    <TabsTrigger value="senat">Sénat</TabsTrigger>
                    <TabsTrigger value="congres">Congrès</TabsTrigger>
                </TabsList>

                <TabsContent value="tous" className="mt-6 space-y-4">
                    {texts.map((text) => (
                        <Card key={text.id} className="hover:shadow-md transition-shadow cursor-pointer group">
                            <CardContent className="p-6">
                                <div className="flex flex-col md:flex-row gap-4 justify-between">
                                    <div className="space-y-3 flex-1">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <Badge variant="outline" className={getChamberColor(text.chamber)}>
                                                {text.chamber === 'AN' && <Building2 className="w-3 h-3 mr-1" />}
                                                {text.chamber === 'Sénat' && <Landmark className="w-3 h-3 mr-1" />}
                                                {text.chamber === 'Congrès' && <Scale className="w-3 h-3 mr-1" />}
                                                {text.chamber === 'AN' ? 'Assemblée Nationale' : text.chamber}
                                            </Badge>
                                            <Badge className={getStatusColor(text.status)} variant="secondary">
                                                {text.status}
                                            </Badge>
                                            <span className="text-xs text-muted-foreground flex items-center">
                                                <Calendar className="w-3 h-3 mr-1" />
                                                {text.date}
                                            </span>
                                        </div>

                                        <div>
                                            <h3 className="text-lg font-bold group-hover:text-[#04CDB9] transition-colors">
                                                {text.title}
                                            </h3>
                                            <p className="text-muted-foreground mt-1 text-sm line-clamp-2">
                                                {text.summary}
                                            </p>
                                        </div>

                                        <div className="flex gap-2">
                                            {text.tags.map(tag => (
                                                <Badge key={tag} variant="secondary" className="font-normal text-xs bg-muted">
                                                    #{tag}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex flex-col justify-center items-end border-l pl-4 min-w-[120px]">
                                        <Button variant="ghost" className="group-hover:translate-x-1 transition-transform">
                                            Voir le dossier <ChevronRight className="w-4 h-4 ml-1" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </TabsContent>
                {/* Placeholder contents for other tabs */}
                <TabsContent value="an">
                    <div className="py-10 text-center text-muted-foreground">
                        Filtrage par Assemblée Nationale activé...
                    </div>
                </TabsContent>
                <TabsContent value="senat">
                    <div className="py-10 text-center text-muted-foreground">
                        Filtrage par Sénat activé...
                    </div>
                </TabsContent>
                <TabsContent value="congres">
                    <div className="py-10 text-center text-muted-foreground">
                        Filtrage par Congrès activé...
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default CitizenLegislation;
