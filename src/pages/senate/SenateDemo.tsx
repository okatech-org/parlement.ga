import { useState } from "react";
import {
    Landmark, Users, FileText, MapPin, ArrowLeftRight,
    Scale, ChevronRight, Crown, MessageSquare, BarChart3,
    PlayCircle, Eye, Monitor, Building, CheckCircle,
    Clock, Calendar, Send, LogIn, Sun, Moon, Home, Shield,
    Briefcase, UserCircle, UserCheck, AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { useTheme } from "next-themes";
import { toast } from "sonner";

// Comptes démo Sénat organisés par catégorie
const SENATE_DEMO_ACCOUNTS = {
    bureau: [
        { label: 'Président du Sénat', phone: '11111111', path: '/senat/espace/president', icon: Crown, color: 'text-amber-500', description: 'Présidence du Sénat' },
        { label: '1er Vice-Président', phone: '12121212', path: '/senat/espace/president', icon: Crown, color: 'text-amber-400', description: 'Vice-présidence' },
    ],
    questeurs: [
        { label: 'Questeur', phone: '14141414', path: '/senat/espace/questeur', icon: Briefcase, color: 'text-blue-500', description: 'Gestion budgétaire' },
    ],
    senateurs: [
        { label: 'Sénateur Estuaire', phone: '10101010', path: '/senat/espace', icon: Users, color: 'text-primary', description: 'Province de l\'Estuaire' },
        { label: 'Sénateur Woleu-Ntem', phone: '10101011', path: '/senat/espace', icon: Users, color: 'text-emerald-500', description: 'Province du Woleu-Ntem' },
        { label: 'Sénateur Haut-Ogooué', phone: '10101012', path: '/senat/espace', icon: Users, color: 'text-orange-500', description: 'Province du Haut-Ogooué' },
    ],
    fonctionnalites: [
        { label: 'Gestion Doléances', phone: null, path: '/senat/espace/doleances', icon: AlertTriangle, color: 'text-amber-600', description: 'Remontées des collectivités' },
        { label: 'Visites Terrain', phone: null, path: '/senat/espace/visites', icon: MapPin, color: 'text-blue-600', description: 'Rapports de déplacements' },
    ],
    public: [
        { label: 'Portail Sénat', phone: null, path: '/senat', icon: UserCircle, color: 'text-green-400', description: 'Accès public' },
    ]
};

/**
 * Page de démonstration du Sénat
 * Présente les fonctionnalités spécifiques au Sénat
 */
const SenateDemo = () => {
    const navigate = useNavigate();
    const { theme, setTheme } = useTheme();
    const [activeDemo, setActiveDemo] = useState("access");

    const handleDemoLogin = (phone: string | null, redirectPath: string) => {
        if (!phone) {
            navigate(redirectPath);
            return;
        }
        
        const mockUsers: Record<string, { name: string; roles: string[]; province?: string }> = {
            '11111111': { name: 'Paulette Missambo', roles: ['president_senate', 'senator', 'citizen'], province: 'Estuaire' },
            '12121212': { name: 'Pierre Nzeng', roles: ['vp_senate', 'senator', 'citizen'], province: 'Woleu-Ntem' },
            '14141414': { name: 'Jean Koumba', roles: ['questeur_senate', 'senator', 'citizen'], province: 'Moyen-Ogooué' },
            '10101010': { name: 'Marie Ndong', roles: ['senator', 'citizen'], province: 'Estuaire' },
            '10101011': { name: 'François Obiang', roles: ['senator', 'citizen'], province: 'Woleu-Ntem' },
            '10101012': { name: 'Albert Moussavou', roles: ['senator', 'citizen'], province: 'Haut-Ogooué' },
        };
        
        const userData = mockUsers[phone] || { name: 'Sénateur Démo', roles: ['senator', 'citizen'], province: 'Estuaire' };
        const user = {
            id: phone,
            name: userData.name,
            phoneNumber: phone,
            roles: userData.roles,
            province: userData.province,
        };
        
        sessionStorage.setItem('user_data', JSON.stringify(user));
        sessionStorage.setItem('current_role', userData.roles[0]);
        
        toast.success('Connexion démo réussie !');
        navigate(redirectPath);
    };

    // Rôles disponibles dans le Sénat
    const senateRoles = [
        {
            id: "senator",
            title: "Sénateur",
            description: "Représente une province et les collectivités locales",
            icon: Users,
            features: [
                "Accès aux textes en navette",
                "Doléances des collectivités",
                "Rapports de visite terrain",
                "Messagerie élus locaux",
            ],
            demoPath: "/senat/espace",
        },
        {
            id: "president",
            title: "Président du Sénat",
            description: "Chef de l'institution, valide les transmissions",
            icon: Crown,
            features: [
                "Validation de la navette",
                "Gestion de l'ordre du jour",
                "Convocation des CMP",
                "Statistiques de l'institution",
            ],
            demoPath: "/senat/espace/president",
        },
        {
            id: "questeur",
            title: "Questeur",
            description: "Gère les finances et l'administration",
            icon: Building,
            features: [
                "Budget du Sénat",
                "Gestion du matériel",
                "Indemnités des sénateurs",
                "Services administratifs",
            ],
            demoPath: "/senat/espace/questeur",
        },
    ];

    // Fonctionnalités clés
    const keyFeatures = [
        {
            title: "Navette Parlementaire",
            description: "Réception et traitement des textes votés par l'Assemblée Nationale",
            icon: ArrowLeftRight,
            details: [
                "Textes reçus avec délai de 20 jours",
                "Priorité aux textes sur les collectivités",
                "Suivi en temps réel de la navette",
                "Historique complet des transmissions",
            ],
        },
        {
            title: "Lien avec les Territoires",
            description: "Représentation des collectivités locales et remontées du terrain",
            icon: MapPin,
            details: [
                "Doléances des maires et conseillers",
                "Rapports de visites de terrain",
                "Messagerie avec les élus locaux",
                "Carte interactive des 9 provinces",
            ],
        },
        {
            title: "Commission Mixte Paritaire",
            description: "Résolution des désaccords avec l'Assemblée Nationale",
            icon: Scale,
            details: [
                "Composition 7+7 membres",
                "Négociation du texte commun",
                "Procédure de conciliation",
                "Vote final sur le compromis",
            ],
        },
    ];

    // Flux de travail type
    const workflow = [
        {
            step: 1,
            title: "Réception du texte",
            description: "Le Sénat reçoit un texte voté par l'Assemblée Nationale",
            icon: FileText,
            duration: "Jour 1",
        },
        {
            step: 2,
            title: "Examen en Commission",
            description: "La commission permanente étudie le texte et propose des amendements",
            icon: Users,
            duration: "Jours 2-10",
        },
        {
            step: 3,
            title: "Débat en Plénière",
            description: "Discussion générale et vote des amendements en séance",
            icon: MessageSquare,
            duration: "Jours 11-15",
        },
        {
            step: 4,
            title: "Vote solennel",
            description: "Vote final du texte (conforme ou amendé)",
            icon: CheckCircle,
            duration: "Jour 16-20",
        },
        {
            step: 5,
            title: "Transmission",
            description: "Retour à l'AN si amendé, ou envoi pour promulgation si conforme",
            icon: Send,
            duration: "Après vote",
        },
    ];

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
                                <Home className="h-5 w-5" />
                            </Button>
                            <Separator orientation="vertical" className="h-6" />
                            <Landmark className="h-7 w-7 text-primary" />
                            <div>
                                <h1 className="text-xl font-serif font-bold text-foreground">Démo Protocole Sénat</h1>
                                <p className="text-xs text-muted-foreground">Accès aux espaces sénatoriaux</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Badge variant="outline">Sénat Gabonais</Badge>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                            >
                                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Hero */}
            <section className="py-16 bg-gradient-to-br from-primary/5 to-primary/10">
                <div className="container mx-auto px-4 text-center">
                    <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
                        <PlayCircle className="h-3 w-3 mr-1" />
                        Mode Démonstration
                    </Badge>
                    <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">
                        Bienvenue au Sénat
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
                        102 sénateurs représentant les 9 provinces du Gabon.
                        Découvrez les outils numériques de la chambre haute.
                    </p>
                    <div className="flex gap-4 justify-center">
                        <Button size="lg" onClick={() => navigate("/senat/espace")}>
                            <Monitor className="mr-2 h-5 w-5" />
                            Essayer le Dashboard
                        </Button>
                        <Button size="lg" variant="outline" onClick={() => setActiveDemo("roles")}>
                            <Eye className="mr-2 h-5 w-5" />
                            Explorer les rôles
                        </Button>
                    </div>
                </div>
            </section>

            {/* Contenu principal */}
            <div className="container mx-auto px-4 py-12">
                <Tabs value={activeDemo} onValueChange={setActiveDemo}>
                    <TabsList className="mb-8 flex justify-center flex-wrap">
                        <TabsTrigger value="access">Accès Démo</TabsTrigger>
                        <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
                        <TabsTrigger value="roles">Rôles & Espaces</TabsTrigger>
                        <TabsTrigger value="features">Fonctionnalités</TabsTrigger>
                        <TabsTrigger value="workflow">Processus Législatif</TabsTrigger>
                    </TabsList>

                    {/* Accès aux Espaces - Nouveau comme AN */}
                    <TabsContent value="access">
                        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <LogIn className="w-5 h-5 text-primary" />
                                    Accès aux Espaces Sénatoriaux
                                </CardTitle>
                                <CardDescription>
                                    Explorez les fonctionnalités selon votre rôle. Les comptes démo connectent automatiquement.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Bureau du Sénat */}
                                <div className="space-y-3">
                                    <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                                        <Crown className="w-4 h-4 text-amber-500" />
                                        Bureau du Sénat
                                    </h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                        {SENATE_DEMO_ACCOUNTS.bureau.map((account) => {
                                            const Icon = account.icon;
                                            return (
                                                <Button
                                                    key={account.phone}
                                                    variant="outline"
                                                    className="flex flex-col items-start gap-1 h-auto py-3 px-4 hover:bg-primary/10 hover:border-primary/50 transition-all text-left"
                                                    onClick={() => handleDemoLogin(account.phone, account.path)}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <Icon className={`w-5 h-5 ${account.color}`} />
                                                        <span className="font-medium">{account.label}</span>
                                                    </div>
                                                    <span className="text-xs text-muted-foreground">{account.description}</span>
                                                </Button>
                                            );
                                        })}
                                        {SENATE_DEMO_ACCOUNTS.questeurs.map((account) => {
                                            const Icon = account.icon;
                                            return (
                                                <Button
                                                    key={account.phone}
                                                    variant="outline"
                                                    className="flex flex-col items-start gap-1 h-auto py-3 px-4 hover:bg-blue-500/10 hover:border-blue-500/50 transition-all text-left"
                                                    onClick={() => handleDemoLogin(account.phone, account.path)}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <Icon className={`w-5 h-5 ${account.color}`} />
                                                        <span className="font-medium">{account.label}</span>
                                                    </div>
                                                    <span className="text-xs text-muted-foreground">{account.description}</span>
                                                </Button>
                                            );
                                        })}
                                    </div>
                                </div>

                                <Separator />

                                {/* Sénateurs */}
                                <div className="space-y-3">
                                    <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                                        <Users className="w-4 h-4 text-primary" />
                                        Sénateurs par Province
                                    </h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                        {SENATE_DEMO_ACCOUNTS.senateurs.map((account) => {
                                            const Icon = account.icon;
                                            return (
                                                <Button
                                                    key={account.phone}
                                                    variant="outline"
                                                    className="flex flex-col items-start gap-1 h-auto py-3 px-4 hover:bg-primary/10 hover:border-primary/50 transition-all text-left"
                                                    onClick={() => handleDemoLogin(account.phone, account.path)}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <Icon className={`w-5 h-5 ${account.color}`} />
                                                        <span className="font-medium">{account.label}</span>
                                                    </div>
                                                    <span className="text-xs text-muted-foreground">{account.description}</span>
                                                </Button>
                                            );
                                        })}
                                    </div>
                                </div>

                                <Separator />

                                {/* Fonctionnalités spécifiques */}
                                <div className="space-y-3">
                                    <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-blue-500" />
                                        Fonctionnalités Territoriales
                                    </h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {SENATE_DEMO_ACCOUNTS.fonctionnalites.map((account) => {
                                            const Icon = account.icon;
                                            return (
                                                <Button
                                                    key={account.path}
                                                    variant="outline"
                                                    className="flex flex-col items-start gap-1 h-auto py-3 px-4 hover:bg-amber-500/10 hover:border-amber-500/50 transition-all text-left"
                                                    onClick={() => handleDemoLogin(account.phone, account.path)}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <Icon className={`w-5 h-5 ${account.color}`} />
                                                        <span className="font-medium">{account.label}</span>
                                                    </div>
                                                    <span className="text-xs text-muted-foreground">{account.description}</span>
                                                </Button>
                                            );
                                        })}
                                    </div>
                                </div>

                                <Separator />

                                {/* Accès Public */}
                                <div className="space-y-3">
                                    <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                                        <UserCircle className="w-4 h-4 text-green-500" />
                                        Accès Public
                                    </h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {SENATE_DEMO_ACCOUNTS.public.map((account) => {
                                            const Icon = account.icon;
                                            return (
                                                <Button
                                                    key={account.path}
                                                    variant="outline"
                                                    className="flex flex-col items-start gap-1 h-auto py-3 px-4 hover:bg-green-500/10 hover:border-green-500/50 transition-all text-left"
                                                    onClick={() => navigate(account.path)}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <Icon className={`w-5 h-5 ${account.color}`} />
                                                        <span className="font-medium">{account.label}</span>
                                                    </div>
                                                    <span className="text-xs text-muted-foreground">{account.description}</span>
                                                </Button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Vue d'ensemble */}
                    <TabsContent value="overview">
                        <div className="grid md:grid-cols-3 gap-6 mb-12">
                            <Card className="text-center border-t-4 border-t-primary">
                                <CardContent className="p-6">
                                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                                        <Users className="h-8 w-8 text-primary" />
                                    </div>
                                    <h3 className="font-bold text-2xl mb-2">102</h3>
                                    <p className="text-muted-foreground">Sénateurs</p>
                                </CardContent>
                            </Card>
                            <Card className="text-center border-t-4 border-t-primary">
                                <CardContent className="p-6">
                                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                                        <MapPin className="h-8 w-8 text-primary" />
                                    </div>
                                    <h3 className="font-bold text-2xl mb-2">9</h3>
                                    <p className="text-muted-foreground">Provinces représentées</p>
                                </CardContent>
                            </Card>
                            <Card className="text-center border-t-4 border-t-primary">
                                <CardContent className="p-6">
                                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                                        <Clock className="h-8 w-8 text-primary" />
                                    </div>
                                    <h3 className="font-bold text-2xl mb-2">20</h3>
                                    <p className="text-muted-foreground">Jours pour examiner un texte</p>
                                </CardContent>
                            </Card>
                        </div>

                        <Card className="bg-muted/30">
                            <CardContent className="p-8 text-center">
                                <Crown className="h-12 w-12 mx-auto mb-4 text-primary" />
                                <h3 className="text-2xl font-bold mb-4">La voix des territoires</h3>
                                <p className="text-muted-foreground max-w-2xl mx-auto">
                                    Le Sénat gabonais est la chambre de représentation des collectivités locales.
                                    Élu au suffrage indirect par les grands électeurs (maires, conseillers départementaux),
                                    le Sénat apporte sagesse et réflexion au processus législatif.
                                </p>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Rôles */}
                    <TabsContent value="roles">
                        <div className="grid md:grid-cols-3 gap-6">
                            {senateRoles.map((role) => {
                                const Icon = role.icon;
                                return (
                                    <Card key={role.id} className="hover:shadow-lg transition-shadow">
                                        <CardHeader>
                                            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                                                <Icon className="h-6 w-6 text-primary" />
                                            </div>
                                            <CardTitle>{role.title}</CardTitle>
                                            <CardDescription>{role.description}</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <ul className="space-y-2 mb-4">
                                                {role.features.map((feature, index) => (
                                                    <li key={index} className="flex items-center gap-2 text-sm">
                                                        <CheckCircle className="h-4 w-4 text-green-500" />
                                                        {feature}
                                                    </li>
                                                ))}
                                            </ul>
                                            <Button className="w-full" onClick={() => navigate(role.demoPath)}>
                                                Essayer
                                                <ChevronRight className="ml-2 h-4 w-4" />
                                            </Button>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    </TabsContent>

                    {/* Fonctionnalités */}
                    <TabsContent value="features">
                        <div className="space-y-6">
                            {keyFeatures.map((feature, index) => {
                                const Icon = feature.icon;
                                return (
                                    <Card key={index} className="overflow-hidden">
                                        <div className="grid md:grid-cols-3">
                                            <div className="p-6 bg-primary/5 flex flex-col justify-center">
                                                <Icon className="h-12 w-12 text-primary mb-4" />
                                                <h3 className="text-xl font-bold">{feature.title}</h3>
                                                <p className="text-muted-foreground text-sm mt-2">
                                                    {feature.description}
                                                </p>
                                            </div>
                                            <div className="p-6 md:col-span-2">
                                                <div className="grid grid-cols-2 gap-4">
                                                    {feature.details.map((detail, i) => (
                                                        <div key={i} className="flex items-center gap-2">
                                                            <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                                                            <span className="text-sm">{detail}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                );
                            })}
                        </div>
                    </TabsContent>

                    {/* Workflow */}
                    <TabsContent value="workflow">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <ArrowLeftRight className="h-5 w-5 text-primary" />
                                    Processus d'examen d'un texte au Sénat
                                </CardTitle>
                                <CardDescription>
                                    De la réception à la transmission (délai constitutionnel de 20 jours)
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="relative">
                                    {workflow.map((step, index) => {
                                        const Icon = step.icon;
                                        const isLast = index === workflow.length - 1;
                                        return (
                                            <div key={step.step} className="flex gap-4 pb-8 last:pb-0">
                                                <div className="flex flex-col items-center">
                                                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                                                        {step.step}
                                                    </div>
                                                    {!isLast && (
                                                        <div className="w-0.5 h-full bg-primary/20 mt-2" />
                                                    )}
                                                </div>
                                                <div className="flex-1 pb-4">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <div className="flex items-center gap-2">
                                                            <Icon className="h-5 w-5 text-muted-foreground" />
                                                            <h4 className="font-semibold">{step.title}</h4>
                                                        </div>
                                                        <Badge variant="outline">{step.duration}</Badge>
                                                    </div>
                                                    <p className="text-sm text-muted-foreground">
                                                        {step.description}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>

            {/* Footer */}
            <footer className="bg-card border-t border-border py-8">
                <div className="container mx-auto px-4 text-center">
                    <div className="flex justify-center items-center gap-2 mb-4">
                        <Landmark className="h-6 w-6 text-primary" />
                        <span className="font-serif font-bold">Sénat du Gabon</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        Palais Omar Bongo Ondimba - Libreville
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default SenateDemo;
