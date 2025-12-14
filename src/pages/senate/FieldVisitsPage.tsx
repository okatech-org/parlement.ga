import { useState, useEffect } from "react";
import {
    MapPin, Calendar, Clock, Users, FileText, Plus,
    Camera, ChevronRight, CheckCircle, AlertCircle,
    Loader2, RefreshCw, Eye
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
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
import { toast } from "sonner";
import GabonMap from "@/components/map/GabonMap";
import { senateService, FieldVisit, Province } from "@/services/senateService";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const FieldVisitsPage = () => {
    const [selectedProvince, setSelectedProvince] = useState<string | undefined>();
    const [visits, setVisits] = useState<FieldVisit[]>([]);
    const [provinces, setProvinces] = useState<Province[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedVisit, setSelectedVisit] = useState<FieldVisit | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [isNewDialogOpen, setIsNewDialogOpen] = useState(false);

    // Formulaire nouvelle visite
    const [newVisit, setNewVisit] = useState({
        province: "",
        department: "",
        commune: "",
        specific_location: "",
        visit_date: format(new Date(), 'yyyy-MM-dd'),
        duration_hours: 2,
        purpose: "",
        observations: "",
        recommendations: "",
        suggestions: "",
        participants: "",
        follow_up_required: false,
        follow_up_notes: ""
    });

    useEffect(() => {
        loadData();
    }, [selectedProvince]);

    const loadData = async () => {
        setIsLoading(true);
        try {
            const [visitsData, provincesData] = await Promise.all([
                senateService.getFieldVisits({ province: selectedProvince }),
                senateService.getProvinces()
            ]);
            setVisits(visitsData);
            setProvinces(provincesData);
        } catch (error) {
            console.error("Erreur chargement:", error);
            toast.error("Erreur lors du chargement");
        } finally {
            setIsLoading(false);
        }
    };

    const handleMapClick = (provinceName: string) => {
        setSelectedProvince(provinceName === selectedProvince ? undefined : provinceName);
    };

    const handleOpenDetail = (visit: FieldVisit) => {
        setSelectedVisit(visit);
        setIsDetailOpen(true);
    };

    const handleCreateVisit = async () => {
        if (!newVisit.province || !newVisit.purpose || !newVisit.visit_date) {
            toast.error("Veuillez remplir les champs obligatoires");
            return;
        }
        try {
            await senateService.createFieldVisit({
                ...newVisit,
                senator_id: "", // Sera défini par le service
                participants: newVisit.participants ? newVisit.participants.split(',').map(p => p.trim()) : [],
                duration_hours: Number(newVisit.duration_hours) || null,
                follow_up_required: newVisit.follow_up_required
            });
            toast.success("Visite enregistrée avec succès");
            setIsNewDialogOpen(false);
            setNewVisit({
                province: "",
                department: "",
                commune: "",
                specific_location: "",
                visit_date: format(new Date(), 'yyyy-MM-dd'),
                duration_hours: 2,
                purpose: "",
                observations: "",
                recommendations: "",
                suggestions: "",
                participants: "",
                follow_up_required: false,
                follow_up_notes: ""
            });
            loadData();
        } catch (error) {
            toast.error("Erreur lors de l'enregistrement");
        }
    };

    // Stats
    const stats = {
        total: visits.length,
        thisMonth: visits.filter(v => {
            const visitDate = new Date(v.visit_date);
            const now = new Date();
            return visitDate.getMonth() === now.getMonth() && visitDate.getFullYear() === now.getFullYear();
        }).length,
        followUpRequired: visits.filter(v => v.follow_up_required).length,
        byProvince: visits.reduce((acc, v) => {
            acc[v.province] = (acc[v.province] || 0) + 1;
            return acc;
        }, {} as Record<string, number>)
    };

    return (
        <div className="min-h-screen bg-background p-4 md:p-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold font-serif text-foreground">
                        Visites de Terrain
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Suivi des déplacements dans les collectivités locales
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={loadData} disabled={isLoading}>
                        <RefreshCw className={`h-4 w-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
                        Actualiser
                    </Button>
                    <Button onClick={() => setIsNewDialogOpen(true)}>
                        <Plus className="h-4 w-4 mr-1" />
                        Nouvelle visite
                    </Button>
                </div>
            </div>

            <div className="grid lg:grid-cols-4 gap-6">
                {/* Colonne gauche */}
                <div className="lg:col-span-1 space-y-4">
                    {/* Carte */}
                    <Card className="overflow-hidden">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-primary" />
                                Carte des Visites
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
                            <CardTitle className="text-sm">Statistiques</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Total visites</span>
                                <Badge variant="secondary">{stats.total}</Badge>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Ce mois</span>
                                <Badge className="bg-primary/10 text-primary">{stats.thisMonth}</Badge>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-amber-600">Suivi requis</span>
                                <Badge className="bg-amber-100 text-amber-700">{stats.followUpRequired}</Badge>
                            </div>
                            {selectedProvince && (
                                <div className="border-t pt-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-medium">{selectedProvince}</span>
                                        <Badge>{stats.byProvince[selectedProvince] || 0} visites</Badge>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Colonne droite: Liste */}
                <div className="lg:col-span-3 space-y-4">
                    {/* Filtre province actif */}
                    {selectedProvince && (
                        <div className="flex items-center gap-2">
                            <Badge variant="outline" className="py-1">
                                <MapPin className="h-3 w-3 mr-1" />
                                {selectedProvince}
                            </Badge>
                            <Button variant="ghost" size="sm" onClick={() => setSelectedProvince(undefined)}>
                                ✕ Effacer le filtre
                            </Button>
                        </div>
                    )}

                    {/* Liste */}
                    {isLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : visits.length === 0 ? (
                        <Card>
                            <CardContent className="py-12 text-center">
                                <MapPin className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
                                <p className="text-muted-foreground">Aucune visite enregistrée</p>
                                <Button className="mt-4" onClick={() => setIsNewDialogOpen(true)}>
                                    <Plus className="h-4 w-4 mr-1" />
                                    Planifier une visite
                                </Button>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid md:grid-cols-2 gap-4">
                            {visits.map((visit) => (
                                <Card
                                    key={visit.id}
                                    className="cursor-pointer hover:shadow-md transition-all"
                                    onClick={() => handleOpenDetail(visit)}
                                >
                                    <CardContent className="p-4">
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex items-center gap-2">
                                                <Badge variant="outline">
                                                    <Calendar className="h-3 w-3 mr-1" />
                                                    {format(new Date(visit.visit_date), 'd MMM yyyy', { locale: fr })}
                                                </Badge>
                                                {visit.follow_up_required && (
                                                    <Badge className="bg-amber-100 text-amber-700">
                                                        <AlertCircle className="h-3 w-3 mr-1" />
                                                        Suivi
                                                    </Badge>
                                                )}
                                            </div>
                                            {visit.duration_hours && (
                                                <span className="text-xs text-muted-foreground flex items-center">
                                                    <Clock className="h-3 w-3 mr-1" />
                                                    {visit.duration_hours}h
                                                </span>
                                            )}
                                        </div>

                                        <h3 className="font-semibold text-foreground line-clamp-2 mb-2">
                                            {visit.purpose}
                                        </h3>

                                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                                            <MapPin className="h-4 w-4" />
                                            <span>{visit.province}</span>
                                            {visit.commune && <span>• {visit.commune}</span>}
                                        </div>

                                        {visit.observations && (
                                            <p className="text-sm text-muted-foreground line-clamp-2">
                                                {visit.observations}
                                            </p>
                                        )}

                                        {visit.participants && visit.participants.length > 0 && (
                                            <div className="flex items-center gap-1 mt-3 text-xs text-muted-foreground">
                                                <Users className="h-3 w-3" />
                                                <span>{visit.participants.length} participant(s)</span>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Sheet Détail */}
            <Sheet open={isDetailOpen} onOpenChange={setIsDetailOpen}>
                <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
                    {selectedVisit && (
                        <>
                            <SheetHeader>
                                <SheetTitle>Rapport de Visite</SheetTitle>
                                <SheetDescription>
                                    {format(new Date(selectedVisit.visit_date), 'd MMMM yyyy', { locale: fr })}
                                </SheetDescription>
                            </SheetHeader>
                            <div className="space-y-6 mt-6">
                                {/* Lieu */}
                                <div className="flex items-start gap-3">
                                    <MapPin className="h-5 w-5 text-primary mt-0.5" />
                                    <div>
                                        <p className="font-medium">{selectedVisit.province}</p>
                                        {selectedVisit.commune && (
                                            <p className="text-sm text-muted-foreground">{selectedVisit.commune}</p>
                                        )}
                                        {selectedVisit.specific_location && (
                                            <p className="text-sm text-muted-foreground">{selectedVisit.specific_location}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Objet */}
                                <div>
                                    <Label className="text-xs text-muted-foreground">Objet de la visite</Label>
                                    <p className="mt-1 font-medium">{selectedVisit.purpose}</p>
                                </div>

                                {/* Observations */}
                                {selectedVisit.observations && (
                                    <div>
                                        <Label className="text-xs text-muted-foreground">Observations</Label>
                                        <p className="mt-1 text-sm leading-relaxed">{selectedVisit.observations}</p>
                                    </div>
                                )}

                                {/* Recommandations */}
                                {selectedVisit.recommendations && (
                                    <div>
                                        <Label className="text-xs text-muted-foreground">Recommandations</Label>
                                        <p className="mt-1 text-sm leading-relaxed">{selectedVisit.recommendations}</p>
                                    </div>
                                )}

                                {/* Participants */}
                                {selectedVisit.participants && selectedVisit.participants.length > 0 && (
                                    <div>
                                        <Label className="text-xs text-muted-foreground">Participants rencontrés</Label>
                                        <ul className="mt-1 text-sm space-y-1">
                                            {selectedVisit.participants.map((p, i) => (
                                                <li key={i} className="flex items-center gap-2">
                                                    <Users className="h-3 w-3 text-muted-foreground" />
                                                    {p}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Suivi */}
                                {selectedVisit.follow_up_required && (
                                    <Card className="bg-amber-50 border-amber-200">
                                        <CardContent className="p-4">
                                            <div className="flex items-center gap-2 mb-2">
                                                <AlertCircle className="h-4 w-4 text-amber-600" />
                                                <span className="font-medium text-amber-800">Suivi requis</span>
                                            </div>
                                            {selectedVisit.follow_up_notes && (
                                                <p className="text-sm text-amber-700">{selectedVisit.follow_up_notes}</p>
                                            )}
                                        </CardContent>
                                    </Card>
                                )}
                            </div>
                        </>
                    )}
                </SheetContent>
            </Sheet>

            {/* Dialog Nouvelle visite */}
            <Dialog open={isNewDialogOpen} onOpenChange={setIsNewDialogOpen}>
                <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Nouvelle visite de terrain</DialogTitle>
                        <DialogDescription>
                            Enregistrer un rapport de déplacement dans les collectivités
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Date *</Label>
                                <Input
                                    type="date"
                                    value={newVisit.visit_date}
                                    onChange={(e) => setNewVisit({ ...newVisit, visit_date: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Durée (heures)</Label>
                                <Input
                                    type="number"
                                    value={newVisit.duration_hours}
                                    onChange={(e) => setNewVisit({ ...newVisit, duration_hours: Number(e.target.value) })}
                                    min={1}
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Province *</Label>
                                <Select
                                    value={newVisit.province}
                                    onValueChange={(v) => setNewVisit({ ...newVisit, province: v })}
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
                                <Label>Commune</Label>
                                <Input
                                    value={newVisit.commune}
                                    onChange={(e) => setNewVisit({ ...newVisit, commune: e.target.value })}
                                    placeholder="Nom de la commune"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Lieu précis</Label>
                            <Input
                                value={newVisit.specific_location}
                                onChange={(e) => setNewVisit({ ...newVisit, specific_location: e.target.value })}
                                placeholder="École, Mairie, Dispensaire..."
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Objet de la visite *</Label>
                            <Textarea
                                value={newVisit.purpose}
                                onChange={(e) => setNewVisit({ ...newVisit, purpose: e.target.value })}
                                placeholder="Décrivez l'objectif de cette visite..."
                                rows={2}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Observations</Label>
                            <Textarea
                                value={newVisit.observations}
                                onChange={(e) => setNewVisit({ ...newVisit, observations: e.target.value })}
                                placeholder="Vos constats sur le terrain..."
                                rows={3}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Recommandations</Label>
                            <Textarea
                                value={newVisit.recommendations}
                                onChange={(e) => setNewVisit({ ...newVisit, recommendations: e.target.value })}
                                placeholder="Actions suggérées..."
                                rows={2}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Participants rencontrés</Label>
                            <Input
                                value={newVisit.participants}
                                onChange={(e) => setNewVisit({ ...newVisit, participants: e.target.value })}
                                placeholder="Noms séparés par des virgules"
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <Label>Suivi requis ?</Label>
                            <Switch
                                checked={newVisit.follow_up_required}
                                onCheckedChange={(v) => setNewVisit({ ...newVisit, follow_up_required: v })}
                            />
                        </div>
                        {newVisit.follow_up_required && (
                            <div className="space-y-2">
                                <Label>Notes de suivi</Label>
                                <Textarea
                                    value={newVisit.follow_up_notes}
                                    onChange={(e) => setNewVisit({ ...newVisit, follow_up_notes: e.target.value })}
                                    placeholder="Précisez le suivi nécessaire..."
                                    rows={2}
                                />
                            </div>
                        )}
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsNewDialogOpen(false)}>Annuler</Button>
                        <Button onClick={handleCreateVisit}>
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Enregistrer
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default FieldVisitsPage;
