import { useState } from "react";
import {
    Landmark, Users, MapPin, Crown, PlayCircle, Monitor, Building,
    CheckCircle, LogIn, Sun, Moon, Home, Briefcase, UserCircle, AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { ProtocolDemoSection } from "@/components/iasted/ProtocolDemoSection";

// Structure des comptes démo avec rôles et fonctionnalités intégrées
const SENATE_DEMO_CARDS = {
    bureau: {
        title: "Bureau du Sénat",
        icon: Crown,
        color: "text-amber-500",
        accounts: [
            {
                label: 'Président du Sénat',
                phone: '11111111',
                path: '/senat/espace/president',
                icon: Crown,
                color: 'text-amber-500',
                role: 'Présidence',
                features: ['Validation navette', 'Convocation CMP', 'Ordre du jour', 'Statistiques']
            },
            {
                label: '1er Vice-Président',
                phone: '12121212',
                path: '/senat/espace/vp',
                icon: Crown,
                color: 'text-amber-400',
                role: 'Vice-présidence',
                features: ['Suppléance présidence', 'Gestion commissions', 'Délégations']
            },
            {
                label: 'Questeur',
                phone: '14141414',
                path: '/senat/espace/questeur',
                icon: Briefcase,
                color: 'text-blue-500',
                role: 'Questure',
                features: ['Budget du Sénat', 'Gestion matériel', 'Indemnités', 'Services admin']
            },
        ]
    },
    senateurs: {
        title: "Sénateurs par Province",
        icon: Users,
        color: "text-primary",
        accounts: [
            {
                label: 'Sénateur Estuaire',
                phone: '10101010',
                path: '/senat/espace',
                icon: Users,
                color: 'text-primary',
                role: 'Estuaire',
                features: ['Textes en navette', 'Doléances locales', 'Visites terrain', 'Messagerie élus']
            },
            {
                label: 'Sénateur Woleu-Ntem',
                phone: '10101011',
                path: '/senat/espace',
                icon: Users,
                color: 'text-emerald-500',
                role: 'Woleu-Ntem',
                features: ['Textes en navette', 'Doléances locales', 'Visites terrain', 'Messagerie élus']
            },
            {
                label: 'Sénateur Haut-Ogooué',
                phone: '10101012',
                path: '/senat/espace',
                icon: Users,
                color: 'text-orange-500',
                role: 'Haut-Ogooué',
                features: ['Textes en navette', 'Doléances locales', 'Visites terrain', 'Messagerie élus']
            },
        ]
    },
    fonctionnalites: {
        title: "Fonctionnalités Territoriales",
        icon: MapPin,
        color: "text-blue-600",
        accounts: [
            {
                label: 'Gestion Doléances',
                phone: null,
                path: '/senat/espace/doleances',
                icon: AlertTriangle,
                color: 'text-amber-600',
                role: 'Module',
                features: ['Remontées collectivités', 'Suivi par province', 'Priorités', 'Statistiques']
            },
            {
                label: 'Visites Terrain',
                phone: null,
                path: '/senat/espace/visites',
                icon: MapPin,
                color: 'text-blue-600',
                role: 'Module',
                features: ['Rapports déplacements', 'Photos terrain', 'Recommandations', 'Suivi']
            },
        ]
    },
    public: {
        title: "Accès Public",
        icon: UserCircle,
        color: "text-green-500",
        accounts: [
            {
                label: 'Portail Sénat',
                phone: null,
                path: '/senat',
                icon: UserCircle,
                color: 'text-green-500',
                role: 'Public',
                features: ['Actualités', 'Travaux législatifs', 'Sénateurs', 'Contact']
            },
        ]
    }
};

/**
 * Page de démonstration du Sénat
 * Accès aux différents espaces selon les rôles
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

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Button variant="ghost" size="icon" onClick={() => navigate("/senat")}>
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

            {/* Hero compact */}
            <section className="py-12 bg-gradient-to-br from-primary/5 to-primary/10">
                <div className="container mx-auto px-4 text-center">
                    <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
                        <PlayCircle className="h-3 w-3 mr-1" />
                        Mode Démonstration
                    </Badge>
                    <h1 className="text-3xl md:text-4xl font-serif font-bold mb-3">
                        Espaces Sénatoriaux
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
                        Explorez les fonctionnalités selon votre rôle. Cliquez sur une carte pour accéder à l'espace.
                    </p>
                    <Button variant="outline" onClick={() => navigate("/senat/espace")}>
                        <Monitor className="mr-2 h-4 w-4" />
                        Accès direct au Dashboard
                    </Button>
                </div>
            </section>

            {/* Cartes d'accès avec rôles intégrés */}
            <div className="container mx-auto px-4 py-12">
                <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <LogIn className="w-5 h-5 text-primary" />
                            Accès aux Espaces
                        </CardTitle>
                        <CardDescription>
                            Chaque carte affiche le rôle et ses fonctionnalités. Les comptes démo connectent automatiquement.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-8">
                        {Object.entries(SENATE_DEMO_CARDS).map(([key, category]) => {
                            const CategoryIcon = category.icon;
                            return (
                                <div key={key} className="space-y-4">
                                    <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                                        <CategoryIcon className={`w-4 h-4 ${category.color}`} />
                                        {category.title}
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {category.accounts.map((account) => {
                                            const Icon = account.icon;
                                            return (
                                                <Card
                                                    key={account.label}
                                                    className="cursor-pointer hover:shadow-lg hover:border-primary/50 transition-all duration-200"
                                                    onClick={() => handleDemoLogin(account.phone, account.path)}
                                                >
                                                    <CardContent className="p-4 space-y-3">
                                                        {/* En-tête avec icône et label */}
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-3">
                                                                <div className={`w-10 h-10 rounded-lg bg-muted flex items-center justify-center`}>
                                                                    <Icon className={`w-5 h-5 ${account.color}`} />
                                                                </div>
                                                                <div>
                                                                    <h5 className="font-medium text-sm">{account.label}</h5>
                                                                    <Badge variant="secondary" className="text-xs mt-0.5">
                                                                        {account.role}
                                                                    </Badge>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Fonctionnalités */}
                                                        <div className="grid grid-cols-2 gap-1.5">
                                                            {account.features.map((feature, idx) => (
                                                                <div key={idx} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                                                    <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
                                                                    <span className="truncate">{feature}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            );
                                        })}
                                    </div>
                                    {key !== 'public' && <Separator className="mt-6" />}
                                </div>
                            );
                        })}
                    </CardContent>
                </Card>
            </div>

            {/* Protocol Demo Section */}
            <section className="container mx-auto px-4 pb-12">
                <div className="mb-8 text-center">
                    <Badge variant="outline" className="mb-2">Intelligence Artificielle</Badge>
                    <h2 className="text-2xl font-bold font-serif mb-2">Protocole iAsted</h2>
                    <p className="text-muted-foreground">Configuration et test du protocole de communication parlementaire</p>
                </div>
                <ProtocolDemoSection />
            </section>

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
