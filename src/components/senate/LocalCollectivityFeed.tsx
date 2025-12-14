import { useState, useEffect } from "react";
import {
    MapPin, MessageSquare, ChevronRight, Filter,
    AlertTriangle, Clock, CheckCircle, User, Building,
    Loader2
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
import GabonMap from "@/components/map/GabonMap";
import { senateService, LocalGrievance } from "@/services/senateService";

// Provinces du Gabon (Liste synchronisée avec le service)
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

interface LocalCollectivityFeedProps {
    senatorProvince?: string;
}

/**
 * Composant de flux des doléances locales avec Carte Interactive
 */
const LocalCollectivityFeed = ({ senatorProvince = "Woleu-Ntem" }: LocalCollectivityFeedProps) => {
    const [selectedProvince, setSelectedProvince] = useState<string | undefined>(senatorProvince);
    const [categoryFilter, setCategoryFilter] = useState<string>("all");
    const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // État local pour les doléances (normalement via React Query)
    const [grievances, setGrievances] = useState<LocalGrievance[]>([
        {
            id: "1",
            source_type: "MAYOR",
            source_name: "Marie Ndong, Maire de Bitam",
            province: "Woleu-Ntem",
            department: "Ntem",
            commune: "Bitam",
            title: "Réfection urgente de la route Bitam-Minvoul",
            description: "La route reliant Bitam à Minvoul est impraticable depuis la saison des pluies. Les populations rurales sont enclavées.",
            category: "INFRASTRUCTURE",
            priority: 2,
            status: "PENDING",
            created_at: "2024-12-10",
        },
        {
            id: "2",
            source_type: "COUNCIL_PRESIDENT",
            source_name: "Paul Essono, Président du Conseil Départemental",
            province: "Woleu-Ntem",
            department: "Woleu",
            title: "Construction d'un centre de santé à Mitzic",
            description: "La population de Mitzic doit parcourir 80km pour accéder aux soins. Un centre de santé local est indispensable.",
            category: "HEALTH",
            priority: 1,
            status: "IN_REVIEW",
            created_at: "2024-12-08",
        },
        {
            id: "3",
            source_type: "PREFECT",
            source_name: "M. le Préfet de Oyem",
            province: "Woleu-Ntem",
            department: "Woleu",
            title: "Électrification rurale du canton d'Essong",
            description: "12 villages du canton d'Essong n'ont toujours pas accès à l'électricité. Demande d'extension du réseau SEEG.",
            category: "INFRASTRUCTURE",
            priority: 1,
            status: "PENDING",
            created_at: "2024-12-05",
        },
        {
            id: "4",
            source_type: "CITIZEN",
            source_name: "Assoc. Parents d'élèves Medouneu",
            province: "Woleu-Ntem",
            commune: "Medouneu",
            title: "Réhabilitation du Lycée de Medouneu",
            description: "Les bâtiments du lycée sont vétustes. Les toitures fuient et les salles de classe sont insuffisantes.",
            category: "EDUCATION",
            priority: 0,
            status: "ADDRESSED",
            created_at: "2024-11-28",
        },
        // Ajout de données fictives pour d'autres provinces pour tester la carte
        {
            id: "5",
            source_type: "MAYOR",
            source_name: "Jean Koumba, Maire de Libreville",
            province: "Estuaire",
            commune: "Libreville",
            title: "Assainissement pluvial Nzeng-Ayong",
            description: "Inondations récurrentes. Besoin urgent de curage des canaux.",
            category: "INFRASTRUCTURE",
            priority: 2,
            status: "PENDING",
            created_at: "2024-12-12",
        },
        {
            id: "6",
            source_type: "COUNCIL_PRESIDENT",
            source_name: "Albert Mouloungui",
            province: "Ogooué-Maritime",
            commune: "Port-Gentil",
            title: "Soutien à la pêche artisanale",
            description: "Demande financement pour les coopératives de pêcheurs.",
            category: "OTHER",
            priority: 1,
            status: "IN_REVIEW",
            created_at: "2024-12-09",
        }
    ]);

    // Filtrage des données
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

    // Gestion du clic sur la carte
    const handleMapClick = (provinceName: string) => {
        setSelectedProvince(provinceName === selectedProvince ? undefined : provinceName);
    };

    return (
        <div className="grid lg:grid-cols-3 gap-6">
            {/* Colonne de gauche: Carte et Filtres */}
            <div className="lg:col-span-1 space-y-6">
                <Card className="overflow-hidden border-2 border-primary/10">
                    <CardHeader className="bg-muted/30 pb-4">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <MapPin className="h-5 w-5 text-primary" />
                            Carte du Territoire
                        </CardTitle>
                        <CardDescription>
                            Sélectionnez une province pour filtrer
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        <GabonMap
                            className="rounded-none border-0 aspect-square"
                            selectedProvince={selectedProvince}
                            onProvinceClick={handleMapClick}
                        />
                    </CardContent>
                </Card>

                {/* Statistiques rapides de la province sélectionnée */}
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            {selectedProvince || "National"} - Synthèse
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-sm">Doléances actives</span>
                            <Badge variant="secondary">{filteredGrievances.length}</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm">Priorité Haute</span>
                            <Badge className="bg-red-100 text-red-600">
                                {filteredGrievances.filter(g => g.priority === 2).length}
                            </Badge>
                        </div>

                        <div className="pt-4 border-t">
                            <Dialog open={isReportDialogOpen} onOpenChange={setIsReportDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button className="w-full">
                                        <MapPin className="h-4 w-4 mr-2" />
                                        Rapport Visite {selectedProvince ? `à ${selectedProvince}` : "Terrain"}
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Nouveau rapport de visite</DialogTitle>
                                        <DialogDescription>Province cible : {selectedProvince || "À définir"}</DialogDescription>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                        <div className="space-y-2">
                                            <Label>Lieu visité</Label>
                                            <Input placeholder="Mairie, École, Dispensaire..." />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Constats</Label>
                                            <Textarea placeholder="Décrivez la situation..." />
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button onClick={() => setIsReportDialogOpen(false)}>Enregistrer</Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Colonne de droite: Liste des doléances */}
            <div className="lg:col-span-2 space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <h2 className="text-2xl font-bold font-serif">
                        Fil d'actualité {selectedProvince ? `- ${selectedProvince}` : ""}
                    </h2>

                    <div className="flex gap-2 w-full sm:w-auto">
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
                </div>

                <div className="space-y-4">
                    {filteredGrievances.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground bg-muted/20 rounded-lg border border-dashed">
                            <MessageSquare className="h-10 w-10 mx-auto mb-3 opacity-20" />
                            <p>Aucune doléance trouvée pour cette sélection.</p>
                        </div>
                    ) : (
                        filteredGrievances.map((grievance) => (
                            <Card
                                key={grievance.id}
                                className={`border-l-4 hover:shadow-md transition-shadow cursor-pointer ${grievance.priority === 2 ? "border-l-red-500" :
                                        grievance.priority === 1 ? "border-l-amber-500" :
                                            "border-l-green-500"
                                    }`}
                            >
                                <CardContent className="p-4">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center gap-2 flex-wrap">
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
                                            {!selectedProvince && (
                                                <Badge variant="secondary" className="bg-slate-100">
                                                    {grievance.province}
                                                </Badge>
                                            )}
                                        </div>
                                        <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                                            {grievance.created_at}
                                        </span>
                                    </div>

                                    <h4 className="font-semibold text-foreground mb-2 text-lg">{grievance.title}</h4>
                                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2 leading-relaxed">
                                        {grievance.description}
                                    </p>

                                    <div className="flex items-center justify-between pt-2 border-t border-border/50">
                                        <div className="flex items-center gap-2 text-sm font-medium text-foreground/80">
                                            {getSourceIcon(grievance.source_type)}
                                            <span>{grievance.source_name}</span>
                                        </div>
                                        <Button variant="ghost" size="sm" className="hover:text-primary">
                                            Voir détails <ChevronRight className="ml-1 h-3 w-3" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default LocalCollectivityFeed;
