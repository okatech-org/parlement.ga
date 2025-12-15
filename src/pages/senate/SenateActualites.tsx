import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
    Landmark, ArrowLeft, Newspaper, Calendar, Clock, Search, Filter,
    ChevronRight, MapPin, Users, FileText, Scale, Globe, Bookmark,
    Share2, ThumbsUp, MessageSquare, Eye, Tag, ArrowUpRight
} from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { SENATORS, PROVINCES, ELECTORAL_STATS } from "@/data/politicalData";

/**
 * Page Actualités du Sénat
 * Design cohérent avec l'environnement Sénat (ton ambre/doré)
 */
const SenateActualites = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("all");

    // Actualités du Sénat (données réalistes Ve République)
    const actualites = [
        {
            id: 1,
            title: "Élection de Madeleine Sidonie Revangue à la présidence du Sénat",
            excerpt: "Le nouveau bureau du Sénat a été installé avec l'élection de la sénatrice du Moyen-Ogooué à la présidence de la chambre haute.",
            category: "Institutionnel",
            date: "2025-11-20",
            image: "/images/senate-president.jpg",
            author: "Bureau du Sénat",
            province: "Moyen-Ogooué",
            views: 15420,
            featured: true,
            tags: ["Présidence", "Bureau", "Ve République"]
        },
        {
            id: 2,
            title: "Examen du projet de loi sur la décentralisation territoriale",
            excerpt: "Le Sénat entame l'examen en commission du texte visant à renforcer les compétences des collectivités locales.",
            category: "Législation",
            date: "2025-12-10",
            image: "/images/senate-commission.jpg",
            author: "Commission des Lois",
            province: null,
            views: 8230,
            featured: true,
            tags: ["Décentralisation", "Collectivités", "Réforme"]
        },
        {
            id: 3,
            title: "Visite du Sénat au Haut-Ogooué : rencontre avec les élus locaux",
            excerpt: "Une délégation sénatoriale s'est rendue à Franceville pour recueillir les doléances des maires et conseillers départementaux.",
            category: "Territoire",
            date: "2025-12-08",
            image: "/images/senate-visit.jpg",
            author: "Délégation sénatoriale",
            province: "Haut-Ogooué",
            views: 5640,
            featured: false,
            tags: ["Territoire", "Haut-Ogooué", "Doléances"]
        },
        {
            id: 4,
            title: "Session plénière : adoption du budget 2026",
            excerpt: "Le Sénat a adopté à l'unanimité le projet de loi de finances pour l'exercice 2026, après amendements sur les dotations aux collectivités.",
            category: "Plénière",
            date: "2025-12-05",
            image: "/images/senate-pleniere.jpg",
            author: "Présidence",
            province: null,
            views: 12100,
            featured: true,
            tags: ["Budget", "Loi de finances", "2026"]
        },
        {
            id: 5,
            title: "Installation de la Commission des Affaires Économiques",
            excerpt: "Le sénateur Casimir Oyé Mba a été élu président de la commission chargée des questions économiques et budgétaires.",
            category: "Commission",
            date: "2025-12-01",
            image: "/images/senate-eco.jpg",
            author: "Bureau du Sénat",
            province: "Haut-Ogooué",
            views: 4320,
            featured: false,
            tags: ["Commission", "Économie", "Installation"]
        },
        {
            id: 6,
            title: "Navette parlementaire : le Sénat suspend son examen du texte sur les mines",
            excerpt: "Conformément à la Constitution, le Sénat a transmis ses observations sur le projet de loi minière à l'Assemblée Nationale.",
            category: "Navette",
            date: "2025-11-28",
            image: "/images/senate-navette.jpg",
            author: "Secrétariat Général",
            province: null,
            views: 6780,
            featured: false,
            tags: ["Navette", "Mines", "AN"]
        },
        {
            id: 7,
            title: "Journée portes ouvertes au Palais Omar Bongo Ondimba",
            excerpt: "Le Sénat a accueilli plus de 500 citoyens lors de la journée de sensibilisation sur le rôle de la chambre haute.",
            category: "Événement",
            date: "2025-11-25",
            image: "/images/senate-portes.jpg",
            author: "Communication",
            province: "Estuaire",
            views: 8900,
            featured: false,
            tags: ["Portes ouvertes", "Sensibilisation", "Citoyens"]
        },
        {
            id: 8,
            title: "Signature d'un accord avec le Sénat français",
            excerpt: "Partenariat technique pour la modernisation des outils numériques et le renforcement des capacités du personnel.",
            category: "International",
            date: "2025-11-22",
            image: "/images/senate-france.jpg",
            author: "Présidence",
            province: null,
            views: 7430,
            featured: false,
            tags: ["Coopération", "France", "Numérique"]
        }
    ];

    const categories = [
        { value: "all", label: "Toutes les catégories" },
        { value: "Institutionnel", label: "Institutionnel" },
        { value: "Législation", label: "Législation" },
        { value: "Territoire", label: "Territoire" },
        { value: "Plénière", label: "Séance Plénière" },
        { value: "Commission", label: "Commissions" },
        { value: "Navette", label: "Navette Parlementaire" },
        { value: "Événement", label: "Événements" },
        { value: "International", label: "International" },
    ];

    const filteredActualites = actualites.filter(actu => {
        const matchSearch = actu.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            actu.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
        const matchCategory = categoryFilter === "all" || actu.category === categoryFilter;
        return matchSearch && matchCategory;
    });

    const featuredNews = filteredActualites.filter(a => a.featured);
    const regularNews = filteredActualites.filter(a => !a.featured);

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    const getCategoryColor = (category: string) => {
        const colors: Record<string, string> = {
            "Institutionnel": "bg-amber-100 text-amber-700 border-amber-200",
            "Législation": "bg-blue-100 text-blue-700 border-blue-200",
            "Territoire": "bg-green-100 text-green-700 border-green-200",
            "Plénière": "bg-purple-100 text-purple-700 border-purple-200",
            "Commission": "bg-indigo-100 text-indigo-700 border-indigo-200",
            "Navette": "bg-orange-100 text-orange-700 border-orange-200",
            "Événement": "bg-pink-100 text-pink-700 border-pink-200",
            "International": "bg-cyan-100 text-cyan-700 border-cyan-200",
        };
        return colors[category] || "bg-gray-100 text-gray-700";
    };

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
                                <Landmark className="h-8 w-8" />
                                <div>
                                    <h1 className="text-xl font-serif font-bold">Actualités du Sénat</h1>
                                    <p className="text-amber-100 text-sm">Ve République Gabonaise</p>
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
                            <Newspaper className="h-3 w-3 mr-1" />
                            {filteredActualites.length} articles disponibles
                        </Badge>
                        <h2 className="text-4xl font-serif font-bold mb-4">
                            Toute l'actualité du Sénat
                        </h2>
                        <p className="text-xl text-muted-foreground mb-8">
                            Suivez les travaux législatifs, les visites territoriales et les événements de la chambre haute
                        </p>

                        {/* Search & Filter */}
                        <div className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Rechercher une actualité..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                                <SelectTrigger className="w-full md:w-[200px]">
                                    <Filter className="h-4 w-4 mr-2" />
                                    <SelectValue placeholder="Catégorie" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map(cat => (
                                        <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured News */}
            {featuredNews.length > 0 && (
                <section className="py-12 container mx-auto px-4">
                    <h3 className="text-2xl font-serif font-bold mb-6 flex items-center gap-2">
                        <Bookmark className="h-6 w-6 text-amber-500" />
                        À la une
                    </h3>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {featuredNews.map((article, index) => (
                            <Card
                                key={article.id}
                                className={`overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group ${index === 0 ? "md:col-span-2 lg:col-span-2" : ""}`}
                            >
                                <div className={`relative ${index === 0 ? "h-64" : "h-48"} bg-gradient-to-br from-amber-200 to-amber-300 dark:from-amber-800 dark:to-amber-900`}>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <Landmark className="h-16 w-16 text-amber-600/30 dark:text-amber-400/30" />
                                    </div>
                                    <div className="absolute top-4 left-4">
                                        <Badge className={getCategoryColor(article.category)}>
                                            {article.category}
                                        </Badge>
                                    </div>
                                    <div className="absolute top-4 right-4">
                                        <Badge className="bg-amber-500 text-white">À la une</Badge>
                                    </div>
                                </div>
                                <CardHeader>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                                        <Calendar className="h-4 w-4" />
                                        {formatDate(article.date)}
                                        {article.province && (
                                            <>
                                                <span>•</span>
                                                <MapPin className="h-4 w-4" />
                                                {article.province}
                                            </>
                                        )}
                                    </div>
                                    <CardTitle className="group-hover:text-amber-600 transition-colors line-clamp-2">
                                        {article.title}
                                    </CardTitle>
                                    <CardDescription className="line-clamp-3">
                                        {article.excerpt}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                            <span className="flex items-center gap-1">
                                                <Eye className="h-4 w-4" />
                                                {article.views.toLocaleString()}
                                            </span>
                                        </div>
                                        <Button variant="ghost" size="sm" className="group-hover:text-amber-600">
                                            Lire <ChevronRight className="h-4 w-4 ml-1" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </section>
            )}

            {/* Regular News Grid */}
            <section className="py-12 bg-muted/30">
                <div className="container mx-auto px-4">
                    <h3 className="text-2xl font-serif font-bold mb-6 flex items-center gap-2">
                        <FileText className="h-6 w-6 text-amber-500" />
                        Dernières actualités
                    </h3>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {regularNews.map((article) => (
                            <Card
                                key={article.id}
                                className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group"
                            >
                                <div className="relative h-40 bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800">
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <Newspaper className="h-10 w-10 text-slate-400" />
                                    </div>
                                    <div className="absolute top-3 left-3">
                                        <Badge variant="outline" className={getCategoryColor(article.category)}>
                                            {article.category}
                                        </Badge>
                                    </div>
                                </div>
                                <CardHeader className="pb-2">
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                                        <Clock className="h-3 w-3" />
                                        {formatDate(article.date)}
                                    </div>
                                    <CardTitle className="text-base group-hover:text-amber-600 transition-colors line-clamp-2">
                                        {article.title}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                                        {article.excerpt}
                                    </p>
                                    <div className="flex flex-wrap gap-1">
                                        {article.tags.slice(0, 2).map(tag => (
                                            <Badge key={tag} variant="outline" className="text-xs">
                                                <Tag className="h-2 w-2 mr-1" />
                                                {tag}
                                            </Badge>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 bg-gradient-to-br from-amber-600 to-amber-700 text-white">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        <div>
                            <div className="text-4xl font-bold mb-2">{SENATORS.length}</div>
                            <div className="text-amber-100">Sénateurs</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold mb-2">{PROVINCES.length}</div>
                            <div className="text-amber-100">Provinces</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold mb-2">45+</div>
                            <div className="text-amber-100">Textes examinés</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold mb-2">20</div>
                            <div className="text-amber-100">Jours de délai légal</div>
                        </div>
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
                            <Button variant="ghost" size="sm" onClick={() => navigate("/senat/sensibilisation")}>
                                Sensibilisation
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => navigate("/senat/tutoriels")}>
                                Tutoriels
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

export default SenateActualites;
