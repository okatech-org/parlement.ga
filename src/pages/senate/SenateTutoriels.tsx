import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
    Landmark, ArrowLeft, PlayCircle, BookOpen, GraduationCap, Search,
    ChevronRight, Clock, CheckCircle, Star, Download, Share2, Filter,
    Video, FileText, Monitor, Smartphone, Lock, Users, Settings,
    Mail, Calendar, Vote, BarChart3, Map, Bell, MessageSquare
} from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

/**
 * Page Tutoriels du Sénat
 * Guides pratiques pour utiliser la plateforme numérique
 */
const SenateTutoriels = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [levelFilter, setLevelFilter] = useState("all");

    const tutorials = [
        {
            id: 1,
            title: "Se connecter à l'espace sénateur",
            description: "Apprenez à vous authentifier de manière sécurisée sur la plateforme avec l'authentification à deux facteurs.",
            category: "Authentification",
            level: "Débutant",
            duration: "5 min",
            icon: Lock,
            color: "red",
            steps: 4,
            views: 2450,
            featured: true,
            videoUrl: "#"
        },
        {
            id: 2,
            title: "Consulter les textes en navette",
            description: "Découvrez comment accéder aux projets de loi transmis par l'Assemblée Nationale et suivre leur état d'avancement.",
            category: "Navette",
            level: "Débutant",
            duration: "8 min",
            icon: FileText,
            color: "blue",
            steps: 6,
            views: 1890,
            featured: true,
            videoUrl: "#"
        },
        {
            id: 3,
            title: "Proposer un amendement",
            description: "Guide complet pour rédiger, soumettre et suivre un amendement sur un texte en discussion.",
            category: "Législation",
            level: "Intermédiaire",
            duration: "15 min",
            icon: FileText,
            color: "purple",
            steps: 10,
            views: 1560,
            featured: true,
            videoUrl: "#"
        },
        {
            id: 4,
            title: "Gérer son agenda parlementaire",
            description: "Paramétrez votre calendrier, synchronisez-le avec vos appareils et recevez des rappels.",
            category: "Agenda",
            level: "Débutant",
            duration: "7 min",
            icon: Calendar,
            color: "green",
            steps: 5,
            views: 1340,
            featured: false,
            videoUrl: "#"
        },
        {
            id: 5,
            title: "Voter en séance plénière",
            description: "Maîtrisez le système de vote électronique : vote pour, contre, abstention et délégation.",
            category: "Vote",
            level: "Intermédiaire",
            duration: "10 min",
            icon: Vote,
            color: "amber",
            steps: 8,
            views: 2100,
            featured: true,
            videoUrl: "#"
        },
        {
            id: 6,
            title: "Utiliser la messagerie sécurisée",
            description: "Communiquez en toute confidentialité avec vos collègues et les services du Sénat.",
            category: "Communication",
            level: "Débutant",
            duration: "6 min",
            icon: Mail,
            color: "cyan",
            steps: 4,
            views: 980,
            featured: false,
            videoUrl: "#"
        },
        {
            id: 7,
            title: "Accéder aux statistiques de travail",
            description: "Consultez vos indicateurs de performance : présence, votes, interventions, amendements.",
            category: "Statistiques",
            level: "Intermédiaire",
            duration: "8 min",
            icon: BarChart3,
            color: "indigo",
            steps: 5,
            views: 760,
            featured: false,
            videoUrl: "#"
        },
        {
            id: 8,
            title: "Gérer les doléances territoriales",
            description: "Recevez et traitez les demandes des élus locaux et citoyens de votre circonscription.",
            category: "Territoire",
            level: "Avancé",
            duration: "20 min",
            icon: Map,
            color: "emerald",
            steps: 12,
            views: 1120,
            featured: false,
            videoUrl: "#"
        },
        {
            id: 9,
            title: "Paramétrer les notifications",
            description: "Configurez vos alertes pour les textes urgents, les convocations et les votes.",
            category: "Paramètres",
            level: "Débutant",
            duration: "4 min",
            icon: Bell,
            color: "orange",
            steps: 3,
            views: 650,
            featured: false,
            videoUrl: "#"
        },
        {
            id: 10,
            title: "Participer à une CMP virtuelle",
            description: "Rejoignez une Commission Mixte Paritaire en visioconférence et collaborez sur un texte commun.",
            category: "CMP",
            level: "Avancé",
            duration: "25 min",
            icon: Users,
            color: "rose",
            steps: 15,
            views: 890,
            featured: false,
            videoUrl: "#"
        },
        {
            id: 11,
            title: "Utiliser iAsted, l'assistant IA",
            description: "Découvrez comment l'assistant intelligent peut vous aider dans vos travaux législatifs.",
            category: "IA",
            level: "Intermédiaire",
            duration: "12 min",
            icon: MessageSquare,
            color: "violet",
            steps: 7,
            views: 2340,
            featured: true,
            videoUrl: "#"
        },
        {
            id: 12,
            title: "Accéder à la plateforme mobile",
            description: "Installez l'application mobile et accédez à vos outils depuis votre smartphone ou tablette.",
            category: "Mobile",
            level: "Débutant",
            duration: "5 min",
            icon: Smartphone,
            color: "slate",
            steps: 4,
            views: 1560,
            featured: false,
            videoUrl: "#"
        }
    ];

    const categories = [
        { value: "all", label: "Toutes les catégories" },
        { value: "Authentification", label: "Authentification" },
        { value: "Navette", label: "Navette Parlementaire" },
        { value: "Législation", label: "Législation" },
        { value: "Agenda", label: "Agenda" },
        { value: "Vote", label: "Vote" },
        { value: "Communication", label: "Communication" },
        { value: "Statistiques", label: "Statistiques" },
        { value: "Territoire", label: "Territoire" },
        { value: "Paramètres", label: "Paramètres" },
        { value: "CMP", label: "CMP" },
        { value: "IA", label: "Intelligence Artificielle" },
        { value: "Mobile", label: "Application Mobile" },
    ];

    const levels = [
        { value: "all", label: "Tous les niveaux" },
        { value: "Débutant", label: "Débutant" },
        { value: "Intermédiaire", label: "Intermédiaire" },
        { value: "Avancé", label: "Avancé" },
    ];

    const filteredTutorials = tutorials.filter(tuto => {
        const matchSearch = tuto.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            tuto.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchCategory = categoryFilter === "all" || tuto.category === categoryFilter;
        const matchLevel = levelFilter === "all" || tuto.level === levelFilter;
        return matchSearch && matchCategory && matchLevel;
    });

    const featuredTutorials = filteredTutorials.filter(t => t.featured);

    const getLevelColor = (level: string) => {
        switch (level) {
            case "Débutant": return "bg-green-100 text-green-700 border-green-200";
            case "Intermédiaire": return "bg-amber-100 text-amber-700 border-amber-200";
            case "Avancé": return "bg-red-100 text-red-700 border-red-200";
            default: return "bg-gray-100 text-gray-700";
        }
    };

    // Stats
    const totalTutorials = tutorials.length;
    const totalDuration = tutorials.reduce((acc, t) => acc + parseInt(t.duration), 0);
    const totalViews = tutorials.reduce((acc, t) => acc + t.views, 0);

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="border-b border-border bg-gradient-to-r from-amber-600 to-amber-700 text-white sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => navigate("/senat")}
                                className="text-white hover:bg-white/20"
                            >
                                <ArrowLeft className="h-5 w-5" />
                            </Button>
                            <div className="flex items-center gap-3">
                                <GraduationCap className="h-8 w-8" />
                                <div>
                                    <h1 className="text-xl font-serif font-bold">Tutoriels</h1>
                                    <p className="text-amber-100 text-sm">Guides pratiques</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="secondary" size="sm" onClick={() => navigate("/senat/login")}>
                                Espace sénateur
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="bg-gradient-to-b from-amber-50 to-background dark:from-amber-950/20 dark:to-background py-12">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <Badge className="mb-4 bg-amber-100 text-amber-700 border-amber-200" variant="outline">
                            <BookOpen className="h-3 w-3 mr-1" />
                            {totalTutorials} tutoriels disponibles
                        </Badge>
                        <h2 className="text-4xl font-serif font-bold mb-4">
                            Maîtrisez la plateforme du Sénat
                        </h2>
                        <p className="text-xl text-muted-foreground mb-8">
                            Des guides pas-à-pas pour exploiter toutes les fonctionnalités de votre espace numérique
                        </p>

                        {/* Search & Filters */}
                        <div className="flex flex-col md:flex-row gap-4 max-w-3xl mx-auto">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Rechercher un tutoriel..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                                <SelectTrigger className="w-full md:w-[180px]">
                                    <Filter className="h-4 w-4 mr-2" />
                                    <SelectValue placeholder="Catégorie" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map(cat => (
                                        <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Select value={levelFilter} onValueChange={setLevelFilter}>
                                <SelectTrigger className="w-full md:w-[150px]">
                                    <SelectValue placeholder="Niveau" />
                                </SelectTrigger>
                                <SelectContent>
                                    {levels.map(level => (
                                        <SelectItem key={level.value} value={level.value}>{level.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto mt-8">
                        <Card className="text-center p-4 bg-white/80 dark:bg-card">
                            <Video className="h-6 w-6 mx-auto text-amber-500 mb-2" />
                            <div className="text-2xl font-bold">{totalTutorials}</div>
                            <div className="text-xs text-muted-foreground">Tutoriels</div>
                        </Card>
                        <Card className="text-center p-4 bg-white/80 dark:bg-card">
                            <Clock className="h-6 w-6 mx-auto text-blue-500 mb-2" />
                            <div className="text-2xl font-bold">{totalDuration}</div>
                            <div className="text-xs text-muted-foreground">Minutes de contenu</div>
                        </Card>
                        <Card className="text-center p-4 bg-white/80 dark:bg-card">
                            <Star className="h-6 w-6 mx-auto text-yellow-500 mb-2" />
                            <div className="text-2xl font-bold">{(totalViews / 1000).toFixed(1)}k</div>
                            <div className="text-xs text-muted-foreground">Vues totales</div>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Featured Tutorials */}
            {featuredTutorials.length > 0 && (
                <section className="py-12 container mx-auto px-4">
                    <h3 className="text-2xl font-serif font-bold mb-6 flex items-center gap-2">
                        <Star className="h-6 w-6 text-amber-500" />
                        Tutoriels recommandés
                    </h3>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {featuredTutorials.map((tutorial) => {
                            const Icon = tutorial.icon;
                            return (
                                <Card
                                    key={tutorial.id}
                                    className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group border-t-4"
                                    style={{ borderTopColor: `var(--${tutorial.color}-500, #f59e0b)` }}
                                >
                                    <div className={`relative h-40 bg-gradient-to-br from-${tutorial.color}-100 to-${tutorial.color}-200 dark:from-${tutorial.color}-900/30 dark:to-${tutorial.color}-800/30 flex items-center justify-center`}>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <Icon className={`h-16 w-16 text-${tutorial.color}-500/30`} />
                                        </div>
                                        <div className="relative z-10 w-16 h-16 rounded-full bg-white dark:bg-card shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                                            <PlayCircle className="h-8 w-8 text-amber-600" />
                                        </div>
                                        <div className="absolute top-3 left-3">
                                            <Badge className={getLevelColor(tutorial.level)}>{tutorial.level}</Badge>
                                        </div>
                                        <div className="absolute top-3 right-3">
                                            <Badge variant="secondary" className="bg-white/90">
                                                <Clock className="h-3 w-3 mr-1" />
                                                {tutorial.duration}
                                            </Badge>
                                        </div>
                                    </div>
                                    <CardHeader>
                                        <CardTitle className="text-lg group-hover:text-amber-600 transition-colors">
                                            {tutorial.title}
                                        </CardTitle>
                                        <CardDescription className="line-clamp-2">
                                            {tutorial.description}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                                            <span className="flex items-center gap-1">
                                                <CheckCircle className="h-4 w-4" />
                                                {tutorial.steps} étapes
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Star className="h-4 w-4 text-yellow-500" />
                                                {tutorial.views.toLocaleString()} vues
                                            </span>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </section>
            )}

            {/* All Tutorials */}
            <section className="py-12 bg-muted/30">
                <div className="container mx-auto px-4">
                    <h3 className="text-2xl font-serif font-bold mb-6 flex items-center gap-2">
                        <BookOpen className="h-6 w-6 text-amber-500" />
                        Tous les tutoriels ({filteredTutorials.length})
                    </h3>

                    <Tabs defaultValue="all" className="w-full">
                        <TabsList className="mb-6">
                            <TabsTrigger value="all">Tous</TabsTrigger>
                            <TabsTrigger value="Débutant">Débutant</TabsTrigger>
                            <TabsTrigger value="Intermédiaire">Intermédiaire</TabsTrigger>
                            <TabsTrigger value="Avancé">Avancé</TabsTrigger>
                        </TabsList>

                        {["all", "Débutant", "Intermédiaire", "Avancé"].map(level => (
                            <TabsContent key={level} value={level}>
                                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    {filteredTutorials
                                        .filter(t => level === "all" || t.level === level)
                                        .map((tutorial) => {
                                            const Icon = tutorial.icon;
                                            return (
                                                <Card
                                                    key={tutorial.id}
                                                    className="hover:shadow-lg transition-all duration-300 cursor-pointer group"
                                                >
                                                    <CardHeader className="pb-2">
                                                        <div className="flex items-start justify-between mb-2">
                                                            <div className={`w-10 h-10 rounded-lg bg-${tutorial.color}-100 dark:bg-${tutorial.color}-900/30 flex items-center justify-center`}>
                                                                <Icon className={`h-5 w-5 text-${tutorial.color}-600`} />
                                                            </div>
                                                            <Badge variant="outline" className={getLevelColor(tutorial.level)}>
                                                                {tutorial.level}
                                                            </Badge>
                                                        </div>
                                                        <CardTitle className="text-base group-hover:text-amber-600 transition-colors line-clamp-2">
                                                            {tutorial.title}
                                                        </CardTitle>
                                                    </CardHeader>
                                                    <CardContent>
                                                        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                                                            {tutorial.description}
                                                        </p>
                                                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                                                            <span className="flex items-center gap-1">
                                                                <Clock className="h-3 w-3" />
                                                                {tutorial.duration}
                                                            </span>
                                                            <span className="flex items-center gap-1">
                                                                <CheckCircle className="h-3 w-3" />
                                                                {tutorial.steps} étapes
                                                            </span>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            );
                                        })}
                                </div>
                            </TabsContent>
                        ))}
                    </Tabs>
                </div>
            </section>

            {/* Learning Path */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <Badge className="mb-4 bg-amber-100 text-amber-700 border-amber-200" variant="outline">
                            <GraduationCap className="h-3 w-3 mr-1" />
                            Parcours d'apprentissage
                        </Badge>
                        <h3 className="text-3xl font-serif font-bold mb-4">Démarrez votre formation</h3>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Suivez notre parcours recommandé pour maîtriser tous les outils
                        </p>
                    </div>

                    <div className="max-w-4xl mx-auto">
                        <div className="space-y-4">
                            {[
                                { title: "1. Les bases", tutorials: ["Se connecter", "Naviguer dans l'interface"], progress: 100 },
                                { title: "2. Travail législatif", tutorials: ["Consulter les textes", "Proposer un amendement"], progress: 60 },
                                { title: "3. Communication", tutorials: ["Messagerie", "Notifications"], progress: 30 },
                                { title: "4. Fonctionnalités avancées", tutorials: ["Vote électronique", "CMP virtuelle"], progress: 0 },
                            ].map((path, index) => (
                                <Card key={index} className="p-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <div>
                                            <h4 className="font-semibold">{path.title}</h4>
                                            <p className="text-sm text-muted-foreground">{path.tutorials.join(" • ")}</p>
                                        </div>
                                        <Badge variant={path.progress === 100 ? "default" : "outline"}>
                                            {path.progress === 100 ? (
                                                <><CheckCircle className="h-3 w-3 mr-1" /> Terminé</>
                                            ) : (
                                                `${path.progress}%`
                                            )}
                                        </Badge>
                                    </div>
                                    <Progress value={path.progress} className="h-2" />
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-gradient-to-r from-amber-600 to-amber-700 text-white">
                <div className="container mx-auto px-4 text-center">
                    <h3 className="text-3xl font-serif font-bold mb-4">Besoin d'aide supplémentaire ?</h3>
                    <p className="text-amber-100 mb-8 max-w-2xl mx-auto">
                        Notre équipe de support est disponible pour vous accompagner dans l'utilisation de la plateforme.
                    </p>
                    <div className="flex gap-4 justify-center">
                        <Button size="lg" variant="secondary">
                            <MessageSquare className="mr-2 h-5 w-5" />
                            Contacter le support
                        </Button>
                        <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/20">
                            <Download className="mr-2 h-5 w-5" />
                            Télécharger le guide PDF
                        </Button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-card border-t py-8">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <Landmark className="h-5 w-5 text-amber-500" />
                            <span className="font-serif font-semibold">Sénat de la République Gabonaise</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <Button variant="ghost" size="sm" onClick={() => navigate("/senat")}>
                                Accueil
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => navigate("/senat/actualites")}>
                                Actualités
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => navigate("/senat/sensibilisation")}>
                                Sensibilisation
                            </Button>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            © {new Date().getFullYear()} Tous droits réservés
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default SenateTutoriels;
