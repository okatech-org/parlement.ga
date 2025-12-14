import React from 'react';
import {
    Landmark, Users, Crown, PlayCircle, Monitor, CheckCircle, LogIn, Sun, Moon, Home, UserCircle, FileText, ArrowLeftRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useNavigate } from 'react-router-dom';
import { useTheme } from 'next-themes';
import { toast } from 'sonner';
import { ProtocolDemoSection } from '@/components/iasted/ProtocolDemoSection';

const PARLIAMENT_DEMO_CARDS = {
    bureau: {
        title: "Bureau du Congrès",
        icon: Crown,
        color: "text-amber-500",
        accounts: [
            {
                label: 'Président du Congrès',
                phone: '09090901',
                path: '/parlement/espace', // Access unified space
                icon: Crown,
                color: 'text-amber-500',
                role: 'Président',
                features: ['Convocations Sessions', 'Supervision CMP', 'Ordre du jour Congrès']
            },
            {
                label: 'Secrétaire de Séance',
                phone: '09090902',
                path: '/parlement/espace',
                icon: FileText,
                color: 'text-blue-500',
                role: 'Secrétariat',
                features: ['Procès-verbaux', 'Vérification Quorum', 'Dépouillement Votes']
            },
        ]
    },
    parlementaires: {
        title: "Membres du Congrès",
        icon: Users,
        color: "text-primary",
        accounts: [
            {
                label: 'Député (Congrès)',
                phone: '09090903',
                path: '/parlement/espace',
                icon: Users,
                color: 'text-green-600',
                role: 'Député',
                features: ['Vote Révision Const.', 'Débats CMP', 'Questions']
            },
            {
                label: 'Sénateur (Congrès)',
                phone: '09090904',
                path: '/parlement/espace',
                icon: Users,
                color: 'text-blue-600',
                role: 'Sénateur',
                features: ['Vote Révision Const.', 'Débats CMP', 'Questions']
            },
        ]
    },
    cmp: {
        title: "Commission Mixte (CMP)",
        icon: ArrowLeftRight,
        color: "text-purple-500",
        accounts: [
            {
                label: 'Membre CMP',
                phone: '09090905',
                path: '/parlement/espace',
                icon: ArrowLeftRight,
                color: 'text-purple-500',
                role: 'Commissaire',
                features: ['Négociation Textes', 'Amendements CMP', 'Vote Compromis']
            }
        ]
    }
};

const ParliamentDemo = () => {
    const navigate = useNavigate();
    const { theme, setTheme } = useTheme();

    const handleDemoLogin = (phone: string | null, redirectPath: string) => {
        if (!phone) {
            navigate(redirectPath);
            return;
        }

        const mockUsers: Record<string, { name: string; roles: string[] }> = {
            '09090901': { name: 'Président du Congrès', roles: ['president_congress', 'citizen'] },
            '09090902': { name: 'Secrétaire Général', roles: ['secretary_congress', 'citizen'] },
            '09090903': { name: 'Député Membre', roles: ['deputy', 'congress_member', 'citizen'] },
            '09090904': { name: 'Sénateur Membre', roles: ['senator', 'congress_member', 'citizen'] },
            '09090905': { name: 'Commissaire CMP', roles: ['cmp_member', 'congress_member', 'citizen'] },
        };

        const userData = mockUsers[phone] || { name: 'Membre du Congrès', roles: ['congress_member', 'citizen'] };
        const user = {
            id: phone,
            name: userData.name,
            phoneNumber: phone,
            roles: userData.roles,
        };

        sessionStorage.setItem('user_data', JSON.stringify(user));
        sessionStorage.setItem('current_role', userData.roles[0]);
        sessionStorage.setItem('is_demo', 'true');

        toast.success('Connexion démo Congrès réussie !');
        navigate(redirectPath);
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
                                <h1 className="text-xl font-serif font-bold text-foreground">Démo Congrès / Parlement</h1>
                                <p className="text-xs text-muted-foreground">Espace de réunion des deux chambres</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Badge variant="outline">Parlement</Badge>
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
                        Espace Congrès & CMP
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
                        Explorez les fonctionnalités liées à la réunion des chambres et aux Commissions Mixtes Paritaires.
                    </p>
                    <Button variant="outline" onClick={() => navigate("/parlement/espace")}>
                        <Monitor className="mr-2 h-4 w-4" />
                        Accès direct au Dashboard
                    </Button>
                </div>
            </section>

            {/* Cartes d'accès */}
            <div className="container mx-auto px-4 py-12">
                <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <LogIn className="w-5 h-5 text-primary" />
                            Accès aux Sessions
                        </CardTitle>
                        <CardDescription>
                            Simulation des profils pour les sessions conjointes et CMP.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-8">
                        {Object.entries(PARLIAMENT_DEMO_CARDS).map(([key, category]) => {
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
                                    <Separator className="mt-6" />
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
                    <h2 className="text-2xl font-bold font-serif mb-2">Protocole iAsted - Congrès</h2>
                    <p className="text-muted-foreground">Simulation du protocole pour les sessions conjointes</p>
                </div>
                <ProtocolDemoSection />
            </section>

            {/* Footer */}
            <footer className="bg-card border-t border-border py-8">
                <div className="container mx-auto px-4 text-center">
                    <div className="flex justify-center items-center gap-2 mb-4">
                        <Landmark className="h-6 w-6 text-primary" />
                        <span className="font-serif font-bold">Parlement du Gabon</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        Sénat + Assemblée Nationale • Libreville
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default ParliamentDemo;
