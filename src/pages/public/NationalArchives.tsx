import { useState } from "react";
import {
    Search, BookOpen, FileText, Calendar, Download,
    Filter, ChevronRight, ExternalLink, Landmark, Scale,
    Clock, CheckCircle, ArrowRight, Building, Users
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

/**
 * Archives Nationales - Journal Officiel Numérique
 * Accessible au public depuis /parlement/archives
 */
const NationalArchives = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    const [legislatureFilter, setLegislatureFilter] = useState("all");
    const [typeFilter, setTypeFilter] = useState("all");
    const [domainFilter, setDomainFilter] = useState("all");

    // Données simulées des archives
    const archiveItems = [
        {
            id: "1",
            reference: "Loi n°2024-015",
            title: "Loi de finances pour l'exercice 2024",
            shortTitle: "LF 2024",
            type: "LAW",
            domains: ["FINANCES", "BUDGET"],
            adoptedAt: "15 décembre 2023",
            promulgatedAt: "28 décembre 2023",
            publishedAt: "30 décembre 2023",
            originChamber: "ASSEMBLY",
            legislature: 14,
            journalNumber: "JO n°2023-52",
            timeline: [
                { step: "Dépôt AN", date: "10 oct.", icon: "deposit", chamber: "ASSEMBLY" },
                { step: "Adopté AN", date: "25 nov.", icon: "vote", chamber: "ASSEMBLY" },
                { step: "Transmis Sénat", date: "26 nov.", icon: "transfer", chamber: "JOINT" },
                { step: "Adopté Sénat", date: "10 déc.", icon: "vote", chamber: "SENATE" },
                { step: "Conforme", date: "10 déc.", icon: "check", chamber: "JOINT" },
                { step: "Promulgué", date: "28 déc.", icon: "promulgation", chamber: "JOINT" },
            ],
        },
        {
            id: "2",
            reference: "Loi n°2024-008",
            title: "Loi portant modification du Code de la décentralisation",
            shortTitle: "Code Décentralisation",
            type: "LAW",
            domains: ["DÉCENTRALISATION", "COLLECTIVITÉS"],
            adoptedAt: "5 juin 2024",
            promulgatedAt: "20 juin 2024",
            publishedAt: "25 juin 2024",
            originChamber: "SENATE",
            legislature: 14,
            journalNumber: "JO n°2024-26",
            timeline: [
                { step: "Dépôt Sénat", date: "15 mars", icon: "deposit", chamber: "SENATE" },
                { step: "Adopté Sénat", date: "10 avr.", icon: "vote", chamber: "SENATE" },
                { step: "Transmis AN", date: "11 avr.", icon: "transfer", chamber: "JOINT" },
                { step: "Amendé AN", date: "5 mai", icon: "amendment", chamber: "ASSEMBLY" },
                { step: "CMP", date: "15 mai", icon: "cmp", chamber: "JOINT" },
                { step: "Accord CMP", date: "20 mai", icon: "check", chamber: "JOINT" },
                { step: "Promulgué", date: "20 juin", icon: "promulgation", chamber: "JOINT" },
            ],
        },
        {
            id: "3",
            reference: "Loi constitutionnelle n°2023-002",
            title: "Révision constitutionnelle relative à l'autonomie des collectivités territoriales",
            shortTitle: "Révision Art. 47",
            type: "CONSTITUTION",
            domains: ["CONSTITUTION", "DÉCENTRALISATION"],
            adoptedAt: "15 mars 2023",
            promulgatedAt: "20 mars 2023",
            publishedAt: "22 mars 2023",
            originChamber: "JOINT",
            legislature: 14,
            journalNumber: "JO n°2023-12",
            timeline: [
                { step: "Initiative Gouv.", date: "5 janv.", icon: "deposit", chamber: "ASSEMBLY" },
                { step: "Adopté AN", date: "20 fév.", icon: "vote", chamber: "ASSEMBLY" },
                { step: "Adopté Sénat", date: "5 mars", icon: "vote", chamber: "SENATE" },
                { step: "Congrès 3/5", date: "15 mars", icon: "congress", chamber: "JOINT" },
                { step: "Adopté 67%", date: "15 mars", icon: "check", chamber: "JOINT" },
                { step: "Promulgué", date: "20 mars", icon: "promulgation", chamber: "JOINT" },
            ],
        },
    ];

    // Filtrage
    const filteredItems = archiveItems.filter(item => {
        if (searchQuery && !item.title.toLowerCase().includes(searchQuery.toLowerCase())
            && !item.reference.toLowerCase().includes(searchQuery.toLowerCase())) {
            return false;
        }
        if (legislatureFilter !== "all" && item.legislature !== parseInt(legislatureFilter)) {
            return false;
        }
        if (typeFilter !== "all" && item.type !== typeFilter) {
            return false;
        }
        if (domainFilter !== "all" && !item.domains.includes(domainFilter)) {
            return false;
        }
        return true;
    });

    const getTypeLabel = (type: string) => {
        switch (type) {
            case "LAW": return "Loi";
            case "CONSTITUTION": return "Loi constitutionnelle";
            case "DECREE": return "Décret";
            case "RESOLUTION": return "Résolution";
            default: return type;
        }
    };

    const getChamberColor = (chamber: string) => {
        switch (chamber) {
            case "ASSEMBLY": return "bg-primary text-white";
            case "SENATE": return "bg-red-600 text-white";
            case "JOINT": return "bg-blue-800 text-white";
            default: return "bg-slate-500 text-white";
        }
    };

    const getChamberIcon = (chamber: string) => {
        switch (chamber) {
            case "ASSEMBLY": return <Building className="h-3 w-3" />;
            case "SENATE": return <Users className="h-3 w-3" />;
            case "JOINT": return <Scale className="h-3 w-3" />;
            default: return null;
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
            {/* Header */}
            <header className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 text-white border-b border-slate-600 py-8">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-lg bg-white/10 flex items-center justify-center border border-white/20">
                                <BookOpen className="h-8 w-8" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-serif font-bold">Archives Nationales</h1>
                                <p className="text-slate-300">Journal Officiel de la République Gabonaise</p>
                            </div>
                        </div>
                        <Button
                            variant="outline"
                            className="border-white/30 text-white hover:bg-white/10"
                            onClick={() => navigate("/")}
                        >
                            <Landmark className="h-4 w-4 mr-2" />
                            Parlement
                        </Button>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 py-8">
                {/* Barre de Recherche */}
                <Card className="mb-8 shadow-lg">
                    <CardContent className="p-6">
                        <div className="flex flex-col lg:flex-row gap-4">
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                                <Input
                                    placeholder="Rechercher par titre, numéro de loi, thème..."
                                    className="pl-10 h-12 text-lg"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <div className="flex gap-2 flex-wrap">
                                <Select value={legislatureFilter} onValueChange={setLegislatureFilter}>
                                    <SelectTrigger className="w-[150px]">
                                        <SelectValue placeholder="Législature" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Toutes</SelectItem>
                                        <SelectItem value="14">XIVème</SelectItem>
                                        <SelectItem value="13">XIIIème</SelectItem>
                                        <SelectItem value="12">XIIème</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Select value={typeFilter} onValueChange={setTypeFilter}>
                                    <SelectTrigger className="w-[150px]">
                                        <SelectValue placeholder="Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Tous types</SelectItem>
                                        <SelectItem value="LAW">Loi</SelectItem>
                                        <SelectItem value="CONSTITUTION">Constitution</SelectItem>
                                        <SelectItem value="DECREE">Décret</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Select value={domainFilter} onValueChange={setDomainFilter}>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Domaine" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Tous domaines</SelectItem>
                                        <SelectItem value="FINANCES">Finances</SelectItem>
                                        <SelectItem value="DÉCENTRALISATION">Décentralisation</SelectItem>
                                        <SelectItem value="ÉDUCATION">Éducation</SelectItem>
                                        <SelectItem value="ENVIRONNEMENT">Environnement</SelectItem>
                                        <SelectItem value="CONSTITUTION">Constitution</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Résultats */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-foreground">
                            {filteredItems.length} texte{filteredItems.length > 1 ? 's' : ''} trouvé{filteredItems.length > 1 ? 's' : ''}
                        </h2>
                    </div>

                    {filteredItems.map((item) => (
                        <Card key={item.id} className="hover:shadow-xl transition-shadow overflow-hidden">
                            <div className="grid lg:grid-cols-3">
                                {/* Infos principales */}
                                <div className="lg:col-span-2 p-6">
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <div className="flex items-center gap-2 mb-2">
                                                <Badge className={cn(
                                                    item.type === "CONSTITUTION" ? "bg-amber-500" : "bg-blue-600"
                                                )}>
                                                    {getTypeLabel(item.type)}
                                                </Badge>
                                                <Badge variant="outline">{item.reference}</Badge>
                                                <Badge variant="secondary">{item.journalNumber}</Badge>
                                            </div>
                                            <h3 className="text-xl font-bold text-foreground mb-2">{item.title}</h3>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {item.domains.map((domain, i) => (
                                            <Badge key={i} variant="outline" className="text-xs">
                                                {domain}
                                            </Badge>
                                        ))}
                                    </div>

                                    <div className="grid grid-cols-3 gap-4 text-sm">
                                        <div>
                                            <p className="text-muted-foreground">Adopté le</p>
                                            <p className="font-medium">{item.adoptedAt}</p>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground">Promulgué le</p>
                                            <p className="font-medium">{item.promulgatedAt}</p>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground">Législature</p>
                                            <p className="font-medium">{item.legislature}ème</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-2 mt-4">
                                        <Button variant="outline" size="sm">
                                            <FileText className="h-4 w-4 mr-1" />
                                            Lire le texte
                                        </Button>
                                        <Button variant="outline" size="sm">
                                            <Download className="h-4 w-4 mr-1" />
                                            Télécharger PDF
                                        </Button>
                                    </div>
                                </div>

                                {/* Timeline du texte */}
                                <div className="bg-slate-100 dark:bg-slate-800 p-6 border-l">
                                    <h4 className="font-bold text-sm mb-4 flex items-center gap-2">
                                        <Clock className="h-4 w-4" />
                                        Parcours législatif
                                    </h4>
                                    <div className="space-y-3">
                                        {item.timeline.map((step, i) => (
                                            <div key={i} className="flex items-center gap-3">
                                                <div className={cn(
                                                    "w-6 h-6 rounded-full flex items-center justify-center text-[10px]",
                                                    getChamberColor(step.chamber)
                                                )}>
                                                    {getChamberIcon(step.chamber)}
                                                </div>
                                                <div className="flex-1 flex items-center justify-between">
                                                    <span className="text-sm font-medium">{step.step}</span>
                                                    <span className="text-xs text-muted-foreground">{step.date}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-4 pt-4 border-t border-border/50">
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            <span className="flex items-center gap-1">
                                                <span className="w-3 h-3 rounded-full bg-primary" /> AN
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <span className="w-3 h-3 rounded-full bg-red-600" /> Sénat
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <span className="w-3 h-3 rounded-full bg-blue-800" /> Congrès
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>

                {/* Statistiques */}
                <div className="grid md:grid-cols-4 gap-4 mt-12">
                    {[
                        { value: "1,247", label: "Lois au fonds", icon: FileText },
                        { value: "47", label: "Cette législature", icon: BookOpen },
                        { value: "3", label: "Révisions constit.", icon: Scale },
                        { value: "XIV", label: "Législature actuelle", icon: Landmark },
                    ].map((stat, i) => (
                        <Card key={i} className="text-center">
                            <CardContent className="p-6">
                                <stat.icon className="h-8 w-8 mx-auto mb-2 text-primary opacity-70" />
                                <p className="text-3xl font-bold">{stat.value}</p>
                                <p className="text-sm text-muted-foreground">{stat.label}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-slate-800 text-slate-300 py-8 mt-12">
                <div className="container mx-auto px-4 text-center">
                    <div className="flex justify-center items-center gap-3 mb-3">
                        <BookOpen className="h-6 w-6" />
                        <span className="font-serif font-bold text-white">Archives du Parlement Gabonais</span>
                    </div>
                    <p className="text-sm text-slate-400">
                        "L'Union - Le Travail - La Justice"
                    </p>
                    <p className="text-xs text-slate-500 mt-2">
                        Données publiques - République Gabonaise
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default NationalArchives;
