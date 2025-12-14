import { useState } from "react";
import {
    MapPin, MessageSquare, ChevronRight, Filter,
    AlertTriangle, Clock, CheckCircle, User, Building
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

// Provinces du Gabon
const PROVINCES = [
    { code: "EST", name: "Estuaire", capital: "Libreville" },
    { code: "HOG", name: "Haut-Ogooué", capital: "Franceville" },
    { code: "MOG", name: "Moyen-Ogooué", capital: "Lambaréné" },
    { code: "NGO", name: "Ngounié", capital: "Mouila" },
    { code: "NYA", name: "Nyanga", capital: "Tchibanga" },
    { code: "OGI", name: "Ogooué-Ivindo", capital: "Makokou" },
    { code: "OGL", name: "Ogooué-Lolo", capital: "Koulamoutou" },
    { code: "OGM", name: "Ogooué-Maritime", capital: "Port-Gentil" },
    { code: "WNT", name: "Woleu-Ntem", capital: "Oyem" },
];

interface Grievance {
    id: string;
    sourceType: "MAYOR" | "COUNCIL_PRESIDENT" | "CITIZEN" | "PREFECT";
    sourceName: string;
    province: string;
    department?: string;
    commune?: string;
    title: string;
    description: string;
    category: "INFRASTRUCTURE" | "EDUCATION" | "HEALTH" | "SECURITY" | "OTHER";
    priority: number;
    status: "PENDING" | "IN_REVIEW" | "ADDRESSED" | "CLOSED";
    createdAt: string;
}

interface LocalCollectivityFeedProps {
    senatorProvince?: string;
}

/**
 * Composant de flux des doléances locales
 * Permet aux sénateurs de recevoir et traiter les remontées des collectivités
 */
const LocalCollectivityFeed = ({ senatorProvince = "Woleu-Ntem" }: LocalCollectivityFeedProps) => {
    const [selectedProvince, setSelectedProvince] = useState(senatorProvince);
    const [categoryFilter, setCategoryFilter] = useState<string>("all");
    const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);

    // Données simulées
    const grievances: Grievance[] = [
        {
            id: "1",
            sourceType: "MAYOR",
            sourceName: "Marie Ndong, Maire de Bitam",
            province: "Woleu-Ntem",
            department: "Ntem",
            commune: "Bitam",
            title: "Réfection urgente de la route Bitam-Minvoul",
            description: "La route reliant Bitam à Minvoul est impraticable depuis la saison des pluies. Les populations rurales sont enclavées.",
            category: "INFRASTRUCTURE",
            priority: 2,
            status: "PENDING",
            createdAt: "2024-12-10",
        },
        {
            id: "2",
            sourceType: "COUNCIL_PRESIDENT",
            sourceName: "Paul Essono, Président du Conseil Départemental",
            province: "Woleu-Ntem",
            department: "Woleu",
            title: "Construction d'un centre de santé à Mitzic",
            description: "La population de Mitzic doit parcourir 80km pour accéder aux soins. Un centre de santé local est indispensable.",
            category: "HEALTH",
            priority: 1,
            status: "IN_REVIEW",
            createdAt: "2024-12-08",
        },
        {
            id: "3",
            sourceType: "PREFECT",
            sourceName: "M. le Préfet de Oyem",
            province: "Woleu-Ntem",
            department: "Woleu",
            title: "Électrification rurale du canton d'Essong",
            description: "12 villages du canton d'Essong n'ont toujours pas accès à l'électricité. Demande d'extension du réseau SEEG.",
            category: "INFRASTRUCTURE",
            priority: 1,
            status: "PENDING",
            createdAt: "2024-12-05",
        },
        {
            id: "4",
            sourceType: "CITIZEN",
            sourceName: "Association des parents d'élèves de Medouneu",
            province: "Woleu-Ntem",
            commune: "Medouneu",
            title: "Réhabilitation du Lycée de Medouneu",
            description: "Les bâtiments du lycée sont vétustes. Les toitures fuient et les salles de classe sont insuffisantes.",
            category: "EDUCATION",
            priority: 0,
            status: "ADDRESSED",
            createdAt: "2024-11-28",
        },
    ];

    const filteredGrievances = grievances.filter(g => {
        if (categoryFilter !== "all" && g.category !== categoryFilter) return false;
        if (selectedProvince && g.province !== selectedProvince) return false;
        return true;
    });

    const getCategoryColor = (category: string) => {
        switch (category) {
            case "INFRASTRUCTURE": return "bg-blue-100 text-blue-700";
            case "EDUCATION": return "bg-purple-100 text-purple-700";
            case "HEALTH": return "bg-green-100 text-green-700";
            case "SECURITY": return "bg-red-100 text-red-700";
            default: return "bg-gray-100 text-gray-700";
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "PENDING": return <Clock className="h-4 w-4 text-amber-500" />;
            case "IN_REVIEW": return <AlertTriangle className="h-4 w-4 text-blue-500" />;
            case "ADDRESSED": return <CheckCircle className="h-4 w-4 text-green-500" />;
            default: return null;
        }
    };

    const getSourceIcon = (type: string) => {
        switch (type) {
            case "MAYOR": return <Building className="h-4 w-4" />;
            case "COUNCIL_PRESIDENT": return <Building className="h-4 w-4" />;
            case "PREFECT": return <Building className="h-4 w-4" />;
            default: return <User className="h-4 w-4" />;
        }
    };

    return (
        <div className="space-y-6">
            {/* Header avec filtres */}
            <Card>
                <CardHeader className="pb-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <MessageSquare className="h-5 w-5 text-primary" />
                                Remontées des Collectivités
                            </CardTitle>
                            <CardDescription>
                                Doléances et notes des élus locaux de votre circonscription
                            </CardDescription>
                        </div>
                        <Dialog open={isReportDialogOpen} onOpenChange={setIsReportDialogOpen}>
                            <DialogTrigger asChild>
                                <Button>
                                    <MapPin className="h-4 w-4 mr-2" />
                                    Rapport de visite terrain
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                    <DialogTitle>Nouveau rapport de visite terrain</DialogTitle>
                                    <DialogDescription>
                                        Digitalisez vos observations lors de vos tournées parlementaires
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Province</Label>
                                            <Select defaultValue={senatorProvince}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Sélectionner" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {PROVINCES.map(p => (
                                                        <SelectItem key={p.code} value={p.name}>{p.name}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Date de visite</Label>
                                            <Input type="date" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Lieu spécifique</Label>
                                        <Input placeholder="Ex: Mairie de Bitam, Centre de santé de Mitzic..." />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Objet de la visite</Label>
                                        <Input placeholder="Ex: Inspection des travaux routiers..." />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Observations</Label>
                                        <Textarea
                                            placeholder="Décrivez vos observations sur le terrain..."
                                            rows={4}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Recommandations</Label>
                                        <Textarea
                                            placeholder="Vos recommandations suite à cette visite..."
                                            rows={3}
                                        />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button variant="outline" onClick={() => setIsReportDialogOpen(false)}>
                                        Annuler
                                    </Button>
                                    <Button onClick={() => setIsReportDialogOpen(false)}>
                                        Enregistrer le rapport
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-4">
                        <div className="flex items-center gap-2">
                            <Filter className="h-4 w-4 text-muted-foreground" />
                            <Select value={selectedProvince} onValueChange={setSelectedProvince}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Province" />
                                </SelectTrigger>
                                <SelectContent>
                                    {PROVINCES.map(p => (
                                        <SelectItem key={p.code} value={p.name}>{p.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Catégorie" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Toutes catégories</SelectItem>
                                <SelectItem value="INFRASTRUCTURE">Infrastructure</SelectItem>
                                <SelectItem value="EDUCATION">Éducation</SelectItem>
                                <SelectItem value="HEALTH">Santé</SelectItem>
                                <SelectItem value="SECURITY">Sécurité</SelectItem>
                                <SelectItem value="OTHER">Autre</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Liste des doléances */}
            <div className="space-y-4">
                {filteredGrievances.map((grievance) => (
                    <Card
                        key={grievance.id}
                        className={`border-l-4 hover:shadow-md transition-shadow cursor-pointer ${grievance.priority === 2 ? "border-l-red-500" :
                                grievance.priority === 1 ? "border-l-amber-500" :
                                    "border-l-green-500"
                            }`}
                    >
                        <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    {getStatusIcon(grievance.status)}
                                    <Badge
                                        variant="outline"
                                        className={
                                            grievance.priority === 2 ? "border-red-500 text-red-600" :
                                                grievance.priority === 1 ? "border-amber-500 text-amber-600" :
                                                    "border-green-500 text-green-600"
                                        }
                                    >
                                        {grievance.priority === 2 ? "Très urgent" :
                                            grievance.priority === 1 ? "Urgent" : "Normal"}
                                    </Badge>
                                    <Badge className={getCategoryColor(grievance.category)}>
                                        {grievance.category}
                                    </Badge>
                                </div>
                                <span className="text-xs text-muted-foreground">
                                    {grievance.createdAt}
                                </span>
                            </div>

                            <h4 className="font-semibold text-foreground mb-2">{grievance.title}</h4>
                            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                                {grievance.description}
                            </p>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    {getSourceIcon(grievance.sourceType)}
                                    <span>{grievance.sourceName}</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <MapPin className="h-3 w-3" />
                                    <span>{grievance.commune || grievance.department || grievance.province}</span>
                                </div>
                            </div>

                            <div className="flex gap-2 mt-4">
                                <Button size="sm" variant="outline" className="flex-1">
                                    Voir détails
                                </Button>
                                {grievance.status === "PENDING" && (
                                    <Button size="sm" className="flex-1">
                                        Prendre en charge
                                    </Button>
                                )}
                                {grievance.status === "IN_REVIEW" && (
                                    <Button size="sm" variant="secondary" className="flex-1">
                                        Marquer comme traité
                                    </Button>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Statistiques rapides */}
            <Card className="bg-muted/30">
                <CardContent className="p-4">
                    <div className="grid grid-cols-4 gap-4 text-center">
                        <div>
                            <p className="text-2xl font-bold text-foreground">{grievances.length}</p>
                            <p className="text-xs text-muted-foreground">Total</p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-amber-600">
                                {grievances.filter(g => g.status === "PENDING").length}
                            </p>
                            <p className="text-xs text-muted-foreground">En attente</p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-blue-600">
                                {grievances.filter(g => g.status === "IN_REVIEW").length}
                            </p>
                            <p className="text-xs text-muted-foreground">En cours</p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-green-600">
                                {grievances.filter(g => g.status === "ADDRESSED").length}
                            </p>
                            <p className="text-xs text-muted-foreground">Traités</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default LocalCollectivityFeed;
