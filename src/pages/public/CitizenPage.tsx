import { useState } from "react";
import {
    FileText, Send, Search, Clock, CheckCircle,
    AlertTriangle, User, MessageSquare, Eye, Filter,
    Home, ChevronRight, Calendar, MapPin, FileQuestion
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
    SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import CommonFooter from "@/components/layout/CommonFooter";
import BreadcrumbNav from "@/components/layout/BreadcrumbNav";
import { AnimatedCard } from "@/components/animations/PageTransition";
import { toast } from "sonner";

/**
 * Page Citoyen - Soumettre des doléances et suivre les travaux parlementaires
 */
const CitizenPage = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    const [newGrievanceOpen, setNewGrievanceOpen] = useState(false);

    // Formulaire de doléance
    const [grievanceForm, setGrievanceForm] = useState({
        subject: "",
        category: "",
        province: "",
        description: "",
        contact: "",
    });

    // Doléances du citoyen (simulées)
    const myGrievances = [
        {
            id: "DOL-2024-001",
            subject: "Route dégradée secteur Akébé",
            category: "Infrastructure",
            status: "in_progress",
            date: "10 Déc 2024",
            responses: 2,
        },
        {
            id: "DOL-2024-002",
            subject: "Manque d'eau courante quartier Nzeng-Ayong",
            category: "Services publics",
            status: "received",
            date: "5 Déc 2024",
            responses: 0,
        },
    ];

    // Travaux parlementaires récents
    const recentWorks = [
        {
            id: 1,
            type: "Projet de loi",
            title: "Loi de Finances 2025",
            status: "En commission",
            chamber: "AN",
            date: "12 Déc 2024",
        },
        {
            id: 2,
            type: "Proposition de loi",
            title: "Protection de l'environnement marin",
            status: "Adopté AN",
            chamber: "Sénat",
            date: "8 Déc 2024",
        },
        {
            id: 3,
            type: "Question au Gouvernement",
            title: "Politique de santé rurale",
            status: "Répondu",
            chamber: "AN",
            date: "5 Déc 2024",
        },
    ];

    const handleSubmitGrievance = () => {
        if (!grievanceForm.subject || !grievanceForm.category || !grievanceForm.description) {
            toast.error("Veuillez remplir tous les champs obligatoires");
            return;
        }

        toast.success("Votre doléance a été enregistrée", {
            description: "Vous recevrez un numéro de suivi par email/SMS",
        });
        setNewGrievanceOpen(false);
        setGrievanceForm({ subject: "", category: "", province: "", description: "", contact: "" });
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "received":
                return <Badge variant="secondary">Reçue</Badge>;
            case "in_progress":
                return <Badge className="bg-amber-500">En traitement</Badge>;
            case "resolved":
                return <Badge className="bg-green-500">Résolue</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="bg-gradient-to-r from-green-700 to-green-600 text-white py-8">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between mb-4">
                        <Button
                            variant="ghost"
                            className="text-white hover:bg-white/10"
                            onClick={() => navigate("/")}
                        >
                            <Home className="h-4 w-4 mr-2" />
                            Accueil
                        </Button>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                            <User className="h-8 w-8" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-serif font-bold">Espace Citoyen</h1>
                            <p className="text-green-100">
                                Participez à la vie démocratique de votre pays
                            </p>
                        </div>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 py-6">
                <BreadcrumbNav />

                <Tabs defaultValue="grievances" className="mt-6">
                    <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
                        <TabsTrigger value="grievances">Mes Doléances</TabsTrigger>
                        <TabsTrigger value="works">Travaux</TabsTrigger>
                        <TabsTrigger value="deputies">Mes Élus</TabsTrigger>
                    </TabsList>

                    {/* Onglet Doléances */}
                    <TabsContent value="grievances" className="space-y-6 mt-6">
                        <div className="flex flex-col md:flex-row gap-4 justify-between">
                            <div className="relative flex-1 max-w-md">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Rechercher une doléance..."
                                    className="pl-10"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>

                            <Dialog open={newGrievanceOpen} onOpenChange={setNewGrievanceOpen}>
                                <DialogTrigger asChild>
                                    <Button className="bg-green-600 hover:bg-green-700">
                                        <Send className="h-4 w-4 mr-2" />
                                        Nouvelle Doléance
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-lg">
                                    <DialogHeader>
                                        <DialogTitle className="flex items-center gap-2">
                                            <FileQuestion className="h-5 w-5 text-green-600" />
                                            Soumettre une Doléance
                                        </DialogTitle>
                                        <DialogDescription>
                                            Votre message sera transmis à vos représentants élus
                                        </DialogDescription>
                                    </DialogHeader>

                                    <div className="space-y-4 py-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="subject">Objet *</Label>
                                            <Input
                                                id="subject"
                                                placeholder="Résumez votre demande..."
                                                value={grievanceForm.subject}
                                                onChange={(e) => setGrievanceForm({ ...grievanceForm, subject: e.target.value })}
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label>Catégorie *</Label>
                                                <Select
                                                    value={grievanceForm.category}
                                                    onValueChange={(v) => setGrievanceForm({ ...grievanceForm, category: v })}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Choisir..." />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="infrastructure">Infrastructure</SelectItem>
                                                        <SelectItem value="services">Services publics</SelectItem>
                                                        <SelectItem value="education">Éducation</SelectItem>
                                                        <SelectItem value="sante">Santé</SelectItem>
                                                        <SelectItem value="emploi">Emploi</SelectItem>
                                                        <SelectItem value="autre">Autre</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Province</Label>
                                                <Select
                                                    value={grievanceForm.province}
                                                    onValueChange={(v) => setGrievanceForm({ ...grievanceForm, province: v })}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Votre province..." />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="estuaire">Estuaire</SelectItem>
                                                        <SelectItem value="haut-ogooue">Haut-Ogooué</SelectItem>
                                                        <SelectItem value="moyen-ogooue">Moyen-Ogooué</SelectItem>
                                                        <SelectItem value="ngounie">Ngounié</SelectItem>
                                                        <SelectItem value="nyanga">Nyanga</SelectItem>
                                                        <SelectItem value="ogooue-ivindo">Ogooué-Ivindo</SelectItem>
                                                        <SelectItem value="ogooue-lolo">Ogooué-Lolo</SelectItem>
                                                        <SelectItem value="ogooue-maritime">Ogooué-Maritime</SelectItem>
                                                        <SelectItem value="woleu-ntem">Woleu-Ntem</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="description">Description détaillée *</Label>
                                            <Textarea
                                                id="description"
                                                placeholder="Décrivez votre situation en détail..."
                                                rows={4}
                                                value={grievanceForm.description}
                                                onChange={(e) => setGrievanceForm({ ...grievanceForm, description: e.target.value })}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="contact">Email ou Téléphone (pour le suivi)</Label>
                                            <Input
                                                id="contact"
                                                placeholder="+241 XX XX XX XX"
                                                value={grievanceForm.contact}
                                                onChange={(e) => setGrievanceForm({ ...grievanceForm, contact: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <DialogFooter>
                                        <Button variant="outline" onClick={() => setNewGrievanceOpen(false)}>
                                            Annuler
                                        </Button>
                                        <Button
                                            className="bg-green-600 hover:bg-green-700"
                                            onClick={handleSubmitGrievance}
                                        >
                                            <Send className="h-4 w-4 mr-2" />
                                            Envoyer
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>

                        {/* Liste des doléances */}
                        <div className="space-y-4">
                            {myGrievances.map((grievance, index) => (
                                <AnimatedCard key={grievance.id} delay={index * 0.1}>
                                    <Card className="hover:shadow-lg transition-shadow">
                                        <CardContent className="p-4">
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <Badge variant="outline">{grievance.id}</Badge>
                                                        <Badge variant="secondary">{grievance.category}</Badge>
                                                        {getStatusBadge(grievance.status)}
                                                    </div>
                                                    <h3 className="font-bold text-lg">{grievance.subject}</h3>
                                                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                                                        <span className="flex items-center gap-1">
                                                            <Calendar className="h-4 w-4" />
                                                            {grievance.date}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <MessageSquare className="h-4 w-4" />
                                                            {grievance.responses} réponse(s)
                                                        </span>
                                                    </div>
                                                </div>
                                                <Button variant="outline" size="sm">
                                                    <Eye className="h-4 w-4 mr-1" />
                                                    Suivre
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </AnimatedCard>
                            ))}
                        </div>
                    </TabsContent>

                    {/* Onglet Travaux Parlementaires */}
                    <TabsContent value="works" className="space-y-6 mt-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Travaux Parlementaires Récents</CardTitle>
                                <CardDescription>
                                    Suivez les lois et débats qui concernent votre quotidien
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {recentWorks.map((work, index) => (
                                        <AnimatedCard key={work.id} delay={index * 0.1}>
                                            <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${work.chamber === "AN" ? "bg-primary/10 text-primary" : "bg-red-100 text-red-600"
                                                        }`}>
                                                        <FileText className="h-5 w-5" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium">{work.title}</p>
                                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                            <span>{work.type}</span>
                                                            <span>•</span>
                                                            <span>{work.date}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Badge variant={work.status.includes("Adopté") ? "default" : "secondary"}>
                                                        {work.status}
                                                    </Badge>
                                                    <Button variant="ghost" size="sm">
                                                        <ChevronRight className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </AnimatedCard>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Onglet Mes Élus */}
                    <TabsContent value="deputies" className="space-y-6 mt-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Vos Représentants Élus</CardTitle>
                                <CardDescription>
                                    Les députés et sénateurs de votre circonscription
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="text-center py-8 text-muted-foreground">
                                    <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                    <p>Renseignez votre localisation pour voir vos élus</p>
                                    <Button className="mt-4" variant="outline">
                                        <MapPin className="h-4 w-4 mr-2" />
                                        Définir ma localisation
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>

            <CommonFooter />
        </div>
    );
};

export default CitizenPage;
