import { useState, useEffect } from "react";
import {
    MapPin, MessageSquare, Filter, Search, Plus,
    AlertTriangle, Clock, CheckCircle, User, Building,
    ChevronRight, FileText, Send, Eye, Loader2, RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import GabonMap from "@/components/map/GabonMap";
import { senateService, LocalGrievance, Province } from "@/services/senateService";

const CATEGORIES = [
    { value: "INFRASTRUCTURE", label: "Infrastructure", color: "bg-blue-100 text-blue-700" },
    { value: "EDUCATION", label: "Éducation", color: "bg-purple-100 text-purple-700" },
    { value: "HEALTH", label: "Santé", color: "bg-green-100 text-green-700" },
    { value: "SECURITY", label: "Sécurité", color: "bg-red-100 text-red-700" },
    { value: "OTHER", label: "Autre", color: "bg-gray-100 text-gray-700" },
];

const SOURCE_TYPES = [
    { value: "MAYOR", label: "Maire" },
    { value: "COUNCIL_PRESIDENT", label: "Président Conseil Départemental" },
    { value: "PREFECT", label: "Préfet" },
    { value: "CITIZEN", label: "Citoyen / Association" },
];

const GrievanceManagement = () => {
    const [selectedProvince, setSelectedProvince] = useState<string | undefined>();
    const [categoryFilter, setCategoryFilter] = useState<string>("all");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [grievances, setGrievances] = useState<LocalGrievance[]>([]);
    const [provinces, setProvinces] = useState<Province[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedGrievance, setSelectedGrievance] = useState<LocalGrievance | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [isNewDialogOpen, setIsNewDialogOpen] = useState(false);
    const [responseText, setResponseText] = useState("");

    // Formulaire nouvelle doléance
    const [newGrievance, setNewGrievance] = useState({
        title: "",
        description: "",
        province: "",
        department: "",
        commune: "",
        category: "INFRASTRUCTURE",
        source_type: "CITIZEN",
        source_name: "",
        source_contact: "",
        priority: 0
    });

    // Chargement initial
    useEffect(() => {
        loadData();
    }, [selectedProvince, categoryFilter, statusFilter]);

    const loadData = async () => {
        setIsLoading(true);
        try {
            const [grievancesData, provincesData] = await Promise.all([
                senateService.getLocalGrievances({
                    province: selectedProvince,
                    category: categoryFilter !== "all" ? categoryFilter : undefined,
                    status: statusFilter !== "all" ? statusFilter : undefined
                }),
                senateService.getProvinces()
            ]);
            setGrievances(grievancesData);
            setProvinces(provincesData);
        } catch (error) {
            console.error("Erreur chargement:", error);
            toast.error("Erreur lors du chargement des données");
        } finally {
            setIsLoading(false);
        }
    };

    // Filtrage par recherche
    const filteredGrievances = grievances.filter(g => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return (
            g.title.toLowerCase().includes(query) ||
            g.description.toLowerCase().includes(query) ||
            (g.source_name?.toLowerCase().includes(query) || false)
        );
    });

    // Statistiques
    const stats = {
        total: grievances.length,
        pending: grievances.filter(g => g.status === "PENDING").length,
        inReview: grievances.filter(g => g.status === "IN_REVIEW").length,
        addressed: grievances.filter(g => g.status === "ADDRESSED").length,
        highPriority: grievances.filter(g => g.priority === 2).length
    };

    const getCategoryInfo = (category: string | null) => {
        return CATEGORIES.find(c => c.value === category) || CATEGORIES[4];
    };

    const getStatusConfig = (status: string) => {
        switch (status) {
            case "PENDING": return { icon: Clock, color: "text-amber-500", label: "En attente", bg: "bg-amber-50" };
            case "IN_REVIEW": return { icon: Eye, color: "text-blue-500", label: "En examen", bg: "bg-blue-50" };
            case "ADDRESSED": return { icon: CheckCircle, color: "text-green-500", label: "Traitée", bg: "bg-green-50" };
            case "CLOSED": return { icon: CheckCircle, color: "text-gray-500", label: "Clôturée", bg: "bg-gray-50" };
            default: return { icon: Clock, color: "text-gray-500", label: status, bg: "bg-gray-50" };
        }
    };

    const handleMapClick = (provinceName: string) => {
        setSelectedProvince(provinceName === selectedProvince ? undefined : provinceName);
    };

    const handleOpenDetail = (grievance: LocalGrievance) => {
        setSelectedGrievance(grievance);
        setResponseText(grievance.response || "");
        setIsDetailOpen(true);
    };

    const handleUpdateStatus = async (newStatus: string) => {
        if (!selectedGrievance) return;
        try {
            await senateService.updateGrievance(selectedGrievance.id, { 
                status: newStatus as LocalGrievance['status'],
                response: responseText || undefined,
                addressed_at: newStatus === "ADDRESSED" ? new Date().toISOString() : undefined
            });
            toast.success("Statut mis à jour");
            loadData();
            setIsDetailOpen(false);
        } catch (error) {
            toast.error("Erreur lors de la mise à jour");
        }
    };

    const handleCreateGrievance = async () => {
        if (!newGrievance.title || !newGrievance.description || !newGrievance.province) {
            toast.error("Veuillez remplir tous les champs obligatoires");
            return;
        }
        try {
            await senateService.createGrievance({
                ...newGrievance,
                category: newGrievance.category as LocalGrievance['category'],
                source_type: newGrievance.source_type as LocalGrievance['source_type']
            });
            toast.success("Doléance créée avec succès");
            setIsNewDialogOpen(false);
            setNewGrievance({
                title: "",
                description: "",
                province: "",
                department: "",
                commune: "",
                category: "INFRASTRUCTURE",
                source_type: "CITIZEN",
                source_name: "",
                source_contact: "",
                priority: 0
            });
            loadData();
        } catch (error) {
            toast.error("Erreur lors de la création");
        }
    };

    return (
        <div className="min-h-screen bg-background p-4 md:p-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold font-serif text-foreground">
                        Gestion des Doléances Locales
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Suivi des remontées des collectivités territoriales
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={loadData} disabled={isLoading}>
                        <RefreshCw className={`h-4 w-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
                        Actualiser
                    </Button>
                    <Button onClick={() => setIsNewDialogOpen(true)}>
                        <Plus className="h-4 w-4 mr-1" />
                        Nouvelle doléance
                    </Button>
                </div>
            </div>

            <div className="grid lg:grid-cols-4 gap-6">
                {/* Colonne gauche: Carte et stats */}
                <div className="lg:col-span-1 space-y-4">
                    {/* Carte */}
                    <Card className="overflow-hidden">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-primary" />
                                Carte des Provinces
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <GabonMap
                                className="rounded-none border-0"
                                selectedProvince={selectedProvince}
                                onProvinceClick={handleMapClick}
                            />
                        </CardContent>
                    </Card>

                    {/* Stats */}
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm">
                                Statistiques {selectedProvince ? `- ${selectedProvince}` : "Nationales"}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Total</span>
                                <Badge variant="secondary">{stats.total}</Badge>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-amber-600">En attente</span>
                                <Badge className="bg-amber-100 text-amber-700">{stats.pending}</Badge>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-blue-600">En examen</span>
                                <Badge className="bg-blue-100 text-blue-700">{stats.inReview}</Badge>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-green-600">Traitées</span>
                                <Badge className="bg-green-100 text-green-700">{stats.addressed}</Badge>
                            </div>
                            <div className="border-t pt-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium text-red-600">Priorité haute</span>
                                    <Badge variant="destructive">{stats.highPriority}</Badge>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Colonne droite: Liste */}
                <div className="lg:col-span-3 space-y-4">
                    {/* Filtres */}
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex flex-col md:flex-row gap-3">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Rechercher..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-9"
                                    />
                                </div>
                                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                                    <SelectTrigger className="w-full md:w-[160px]">
                                        <SelectValue placeholder="Catégorie" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Toutes catégories</SelectItem>
                                        {CATEGORIES.map(cat => (
                                            <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Select value={statusFilter} onValueChange={setStatusFilter}>
                                    <SelectTrigger className="w-full md:w-[140px]">
                                        <SelectValue placeholder="Statut" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Tous statuts</SelectItem>
                                        <SelectItem value="PENDING">En attente</SelectItem>
                                        <SelectItem value="IN_REVIEW">En examen</SelectItem>
                                        <SelectItem value="ADDRESSED">Traitées</SelectItem>
                                        <SelectItem value="CLOSED">Clôturées</SelectItem>
                                    </SelectContent>
                                </Select>
                                {selectedProvince && (
                                    <Button variant="ghost" size="sm" onClick={() => setSelectedProvince(undefined)}>
                                        ✕ {selectedProvince}
                                    </Button>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Liste des doléances */}
                    {isLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : filteredGrievances.length === 0 ? (
                        <Card>
                            <CardContent className="py-12 text-center">
                                <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
                                <p className="text-muted-foreground">Aucune doléance trouvée</p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="space-y-3">
                            {filteredGrievances.map((grievance) => {
                                const statusConfig = getStatusConfig(grievance.status);
                                const categoryInfo = getCategoryInfo(grievance.category);
                                const StatusIcon = statusConfig.icon;

                                return (
                                    <Card
                                        key={grievance.id}
                                        className={`cursor-pointer hover:shadow-md transition-all border-l-4 ${
                                            grievance.priority === 2 ? "border-l-red-500" :
                                            grievance.priority === 1 ? "border-l-amber-500" :
                                            "border-l-primary/30"
                                        }`}
                                        onClick={() => handleOpenDetail(grievance)}
                                    >
                                        <CardContent className="p-4">
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                                                        <Badge className={`${statusConfig.bg} ${statusConfig.color} border-0`}>
                                                            <StatusIcon className="h-3 w-3 mr-1" />
                                                            {statusConfig.label}
                                                        </Badge>
                                                        <Badge className={categoryInfo.color}>
                                                            {categoryInfo.label}
                                                        </Badge>
                                                        {grievance.priority === 2 && (
                                                            <Badge variant="destructive">Très urgent</Badge>
                                                        )}
                                                        {grievance.priority === 1 && (
                                                            <Badge className="bg-amber-500">Urgent</Badge>
                                                        )}
                                                    </div>
                                                    <h3 className="font-semibold text-foreground line-clamp-1">
                                                        {grievance.title}
                                                    </h3>
                                                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                                                        {grievance.description}
                                                    </p>
                                                    <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                                                        <span className="flex items-center gap-1">
                                                            <MapPin className="h-3 w-3" />
                                                            {grievance.province}
                                                        </span>
                                                        {grievance.source_name && (
                                                            <span className="flex items-center gap-1">
                                                                <User className="h-3 w-3" />
                                                                {grievance.source_name}
                                                            </span>
                                                        )}
                                                        <span>{new Date(grievance.created_at).toLocaleDateString('fr-FR')}</span>
                                                    </div>
                                                </div>
                                                <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* Sheet Détail */}
            <Sheet open={isDetailOpen} onOpenChange={setIsDetailOpen}>
                <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
                    {selectedGrievance && (
                        <>
                            <SheetHeader>
                                <SheetTitle>{selectedGrievance.title}</SheetTitle>
                                <SheetDescription>
                                    {selectedGrievance.province} • Créée le {new Date(selectedGrievance.created_at).toLocaleDateString('fr-FR')}
                                </SheetDescription>
                            </SheetHeader>
                            <div className="space-y-6 mt-6">
                                {/* Infos */}
                                <div className="flex flex-wrap gap-2">
                                    <Badge className={getStatusConfig(selectedGrievance.status).bg + " " + getStatusConfig(selectedGrievance.status).color}>
                                        {getStatusConfig(selectedGrievance.status).label}
                                    </Badge>
                                    <Badge className={getCategoryInfo(selectedGrievance.category).color}>
                                        {getCategoryInfo(selectedGrievance.category).label}
                                    </Badge>
                                    {selectedGrievance.priority === 2 && <Badge variant="destructive">Très urgent</Badge>}
                                    {selectedGrievance.priority === 1 && <Badge className="bg-amber-500">Urgent</Badge>}
                                </div>

                                {/* Description */}
                                <div>
                                    <Label className="text-xs text-muted-foreground">Description</Label>
                                    <p className="mt-1 text-sm leading-relaxed">{selectedGrievance.description}</p>
                                </div>

                                {/* Source */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label className="text-xs text-muted-foreground">Source</Label>
                                        <p className="mt-1 text-sm font-medium">{selectedGrievance.source_name || "Non renseigné"}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {SOURCE_TYPES.find(s => s.value === selectedGrievance.source_type)?.label}
                                        </p>
                                    </div>
                                    <div>
                                        <Label className="text-xs text-muted-foreground">Localisation</Label>
                                        <p className="mt-1 text-sm font-medium">{selectedGrievance.province}</p>
                                        {selectedGrievance.commune && (
                                            <p className="text-xs text-muted-foreground">{selectedGrievance.commune}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Réponse */}
                                <div>
                                    <Label>Réponse / Suivi</Label>
                                    <Textarea
                                        value={responseText}
                                        onChange={(e) => setResponseText(e.target.value)}
                                        placeholder="Entrez votre réponse ou note de suivi..."
                                        className="mt-2"
                                        rows={4}
                                    />
                                </div>

                                {/* Actions */}
                                <div className="flex flex-col gap-2">
                                    <Label className="text-xs text-muted-foreground">Changer le statut</Label>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedGrievance.status !== "IN_REVIEW" && (
                                            <Button variant="outline" size="sm" onClick={() => handleUpdateStatus("IN_REVIEW")}>
                                                <Eye className="h-4 w-4 mr-1" />
                                                Prendre en charge
                                            </Button>
                                        )}
                                        {selectedGrievance.status !== "ADDRESSED" && (
                                            <Button variant="default" size="sm" onClick={() => handleUpdateStatus("ADDRESSED")}>
                                                <CheckCircle className="h-4 w-4 mr-1" />
                                                Marquer traitée
                                            </Button>
                                        )}
                                        {selectedGrievance.status !== "CLOSED" && (
                                            <Button variant="secondary" size="sm" onClick={() => handleUpdateStatus("CLOSED")}>
                                                Clôturer
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </SheetContent>
            </Sheet>

            {/* Dialog Nouvelle doléance */}
            <Dialog open={isNewDialogOpen} onOpenChange={setIsNewDialogOpen}>
                <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Nouvelle doléance</DialogTitle>
                        <DialogDescription>
                            Enregistrer une remontée des collectivités locales
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label>Titre *</Label>
                            <Input
                                value={newGrievance.title}
                                onChange={(e) => setNewGrievance({ ...newGrievance, title: e.target.value })}
                                placeholder="Objet de la doléance"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Description *</Label>
                            <Textarea
                                value={newGrievance.description}
                                onChange={(e) => setNewGrievance({ ...newGrievance, description: e.target.value })}
                                placeholder="Décrivez la situation en détail..."
                                rows={4}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Province *</Label>
                                <Select
                                    value={newGrievance.province}
                                    onValueChange={(v) => setNewGrievance({ ...newGrievance, province: v })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Sélectionner" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {provinces.map(p => (
                                            <SelectItem key={p.code} value={p.name}>{p.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Catégorie</Label>
                                <Select
                                    value={newGrievance.category}
                                    onValueChange={(v) => setNewGrievance({ ...newGrievance, category: v })}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {CATEGORIES.map(cat => (
                                            <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Type de source</Label>
                                <Select
                                    value={newGrievance.source_type}
                                    onValueChange={(v) => setNewGrievance({ ...newGrievance, source_type: v })}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {SOURCE_TYPES.map(st => (
                                            <SelectItem key={st.value} value={st.value}>{st.label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Priorité</Label>
                                <Select
                                    value={String(newGrievance.priority)}
                                    onValueChange={(v) => setNewGrievance({ ...newGrievance, priority: Number(v) })}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="0">Normal</SelectItem>
                                        <SelectItem value="1">Urgent</SelectItem>
                                        <SelectItem value="2">Très urgent</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Nom du demandeur</Label>
                            <Input
                                value={newGrievance.source_name}
                                onChange={(e) => setNewGrievance({ ...newGrievance, source_name: e.target.value })}
                                placeholder="Nom et fonction"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsNewDialogOpen(false)}>Annuler</Button>
                        <Button onClick={handleCreateGrievance}>
                            <Send className="h-4 w-4 mr-1" />
                            Enregistrer
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default GrievanceManagement;
