import {
    Landmark, Users, MapPin, Crown, PlayCircle, Monitor, Home, 
    Briefcase, UserCircle, AlertTriangle, ChevronRight, Sun, Moon, BookOpen
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";
import { useTheme } from "next-themes";
import { toast } from "sonner";

// Comptes démo Sénat avec rôles intégrés
const SENATE_DEMO_ACCOUNTS = {
    bureau: [
        { 
            label: 'Président du Sénat', 
            phone: '11111111', 
            path: '/senat/espace/president', 
            icon: Crown, 
            color: 'text-amber-500',
            bgHover: 'hover:bg-amber-500/10 hover:border-amber-500/50',
            role: 'Présidence',
            features: ['Validation navette', 'Ordre du jour', 'Convocation CMP']
        },
        { 
            label: '1er Vice-Président', 
            phone: '12121212', 
            path: '/senat/espace/president', 
            icon: Crown, 
            color: 'text-amber-400',
            bgHover: 'hover:bg-amber-500/10 hover:border-amber-500/50',
            role: 'Vice-présidence',
            features: ['Suppléance', 'Présidence de séance']
        },
        { 
            label: 'Questeur', 
            phone: '14141414', 
            path: '/senat/espace/questeur', 
            icon: Briefcase, 
            color: 'text-blue-500',
            bgHover: 'hover:bg-blue-500/10 hover:border-blue-500/50',
            role: 'Gestion',
            features: ['Budget', 'Ressources', 'Services']
        },
    ],
    senateurs: [
        { 
            label: 'Sénateur Estuaire', 
            phone: '10101010', 
            path: '/senat/espace', 
            icon: Users, 
            color: 'text-primary',
            bgHover: 'hover:bg-primary/10 hover:border-primary/50',
            role: 'Province Estuaire',
            features: ['Textes législatifs', 'Doléances', 'Visites terrain']
        },
        { 
            label: 'Sénateur Woleu-Ntem', 
            phone: '10101011', 
            path: '/senat/espace', 
            icon: Users, 
            color: 'text-emerald-500',
            bgHover: 'hover:bg-emerald-500/10 hover:border-emerald-500/50',
            role: 'Province Woleu-Ntem',
            features: ['Textes législatifs', 'Doléances', 'Visites terrain']
        },
        { 
            label: 'Sénateur Haut-Ogooué', 
            phone: '10101012', 
            path: '/senat/espace', 
            icon: Users, 
            color: 'text-orange-500',
            bgHover: 'hover:bg-orange-500/10 hover:border-orange-500/50',
            role: 'Province Haut-Ogooué',
            features: ['Textes législatifs', 'Doléances', 'Visites terrain']
        },
    ],
    fonctionnalites: [
        { 
            label: 'Gestion Doléances', 
            phone: null, 
            path: '/senat/espace/doleances', 
            icon: AlertTriangle, 
            color: 'text-amber-600',
            bgHover: 'hover:bg-amber-500/10 hover:border-amber-500/50',
            role: 'Module territorial',
            features: ['Remontées citoyennes', 'Suivi des demandes', 'Statistiques']
        },
        { 
            label: 'Visites Terrain', 
            phone: null, 
            path: '/senat/espace/visites', 
            icon: MapPin, 
            color: 'text-blue-600',
            bgHover: 'hover:bg-blue-500/10 hover:border-blue-500/50',
            role: 'Module territorial',
            features: ['Rapports de visite', 'Photos', 'Recommandations']
        },
    ],
    public: [
        { 
            label: 'Portail Sénat', 
            phone: null, 
            path: '/senat', 
            icon: UserCircle, 
            color: 'text-green-500',
            bgHover: 'hover:bg-green-500/10 hover:border-green-500/50',
            role: 'Accès public',
            features: ['Actualités', 'Travaux', 'Sénateurs']
        },
    ]
};

/**
 * Page de démonstration du Sénat
 * Accès simplifié aux espaces avec rôles intégrés sur chaque carte
 */
const SenateDemo = () => {
    const navigate = useNavigate();
    const { theme, setTheme } = useTheme();

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

    const renderDemoCard = (account: typeof SENATE_DEMO_ACCOUNTS.bureau[0]) => {
        const Icon = account.icon;
        return (
            <Card 
                key={account.label}
                className={`cursor-pointer transition-all border-2 ${account.bgHover}`}
                onClick={() => handleDemoLogin(account.phone, account.path)}
            >
                <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg bg-muted`}>
                            <Icon className={`w-6 h-6 ${account.color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                                <h3 className="font-semibold text-sm truncate">{account.label}</h3>
                                <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                            </div>
                            <Badge variant="secondary" className="mt-1 text-xs">
                                {account.role}
                            </Badge>
                            <div className="mt-2 flex flex-wrap gap-1">
                                {account.features.map((feature, i) => (
                                    <span key={i} className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                                        {feature}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    };

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
                                <h1 className="text-xl font-serif font-bold text-foreground">Démo Sénat</h1>
                                <p className="text-xs text-muted-foreground">Accès aux espaces sénatoriaux</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" onClick={() => navigate("/senat/protocole")}>
                                <BookOpen className="h-4 w-4 mr-2" />
                                Protocole Sénat
                            </Button>
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

            {/* Hero compact */}
            <section className="py-10 bg-gradient-to-br from-primary/5 to-primary/10">
                <div className="container mx-auto px-4 text-center">
                    <Badge className="mb-3 bg-primary/10 text-primary border-primary/20">
                        <PlayCircle className="h-3 w-3 mr-1" />
                        Mode Démonstration
                    </Badge>
                    <h1 className="text-3xl md:text-4xl font-serif font-bold mb-3">
                        Accès aux Espaces du Sénat
                    </h1>
                    <p className="text-muted-foreground max-w-xl mx-auto">
                        Sélectionnez un rôle pour explorer les fonctionnalités. 
                        Chaque carte indique le rôle et les fonctionnalités disponibles.
                    </p>
                </div>
            </section>

            {/* Contenu principal */}
            <div className="container mx-auto px-4 py-8">
                {/* Bureau du Sénat */}
                <section className="mb-8">
                    <div className="flex items-center gap-2 mb-4">
                        <Crown className="w-5 h-5 text-amber-500" />
                        <h2 className="text-lg font-semibold">Bureau du Sénat</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {SENATE_DEMO_ACCOUNTS.bureau.map(renderDemoCard)}
                    </div>
                </section>

                <Separator className="my-8" />

                {/* Sénateurs */}
                <section className="mb-8">
                    <div className="flex items-center gap-2 mb-4">
                        <Users className="w-5 h-5 text-primary" />
                        <h2 className="text-lg font-semibold">Sénateurs par Province</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {SENATE_DEMO_ACCOUNTS.senateurs.map(renderDemoCard)}
                    </div>
                </section>

                <Separator className="my-8" />

                {/* Fonctionnalités Territoriales */}
                <section className="mb-8">
                    <div className="flex items-center gap-2 mb-4">
                        <MapPin className="w-5 h-5 text-blue-500" />
                        <h2 className="text-lg font-semibold">Fonctionnalités Territoriales</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {SENATE_DEMO_ACCOUNTS.fonctionnalites.map(renderDemoCard)}
                    </div>
                </section>

                <Separator className="my-8" />

                {/* Accès Public */}
                <section>
                    <div className="flex items-center gap-2 mb-4">
                        <UserCircle className="w-5 h-5 text-green-500" />
                        <h2 className="text-lg font-semibold">Accès Public</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {SENATE_DEMO_ACCOUNTS.public.map(renderDemoCard)}
                    </div>
                </section>
            </div>

            {/* Footer */}
            <footer className="bg-card border-t border-border py-6 mt-8">
                <div className="container mx-auto px-4 text-center">
                    <div className="flex justify-center items-center gap-2 mb-2">
                        <Landmark className="h-5 w-5 text-primary" />
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
