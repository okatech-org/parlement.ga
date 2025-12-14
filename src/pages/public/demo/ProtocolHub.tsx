import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Users, Shield, Wallet, FileText, Scale, Landmark,
    Building2, Play, ChevronRight, UserCheck, AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useInstitution, InstitutionType, INSTITUTIONS } from '@/contexts/InstitutionContext';
import UnifiedNavbar from '@/components/navigation/UnifiedNavbar';
import { cn } from '@/lib/utils';

// Définition des rôles de démonstration par institution
const DEMO_ROLES = {
    ASSEMBLY: [
        {
            id: 'deputy',
            title: 'Député',
            description: 'Élu de l\'Assemblée Nationale, vote les lois et contrôle le gouvernement',
            icon: Users,
            loginAs: 'depute@demo.parlement.ga',
            color: 'emerald',
        },
        {
            id: 'president_an',
            title: 'Président de l\'Assemblée',
            description: 'Dirige les travaux parlementaires et représente l\'institution',
            icon: Shield,
            loginAs: 'president.an@demo.parlement.ga',
            color: 'emerald',
        },
        {
            id: 'questeur',
            title: 'Questeur',
            description: 'Gère le budget et les ressources matérielles de l\'Assemblée',
            icon: Wallet,
            loginAs: 'questeur@demo.parlement.ga',
            color: 'emerald',
        },
    ],
    SENATE: [
        {
            id: 'senator',
            title: 'Sénateur',
            description: 'Représente les collectivités territoriales, examine les textes de l\'AN',
            icon: Users,
            loginAs: 'senateur@demo.parlement.ga',
            color: 'amber',
        },
        {
            id: 'president_sn',
            title: 'Président du Sénat',
            description: 'Dirige les travaux du Sénat et assure l\'intérim présidentiel',
            icon: Shield,
            loginAs: 'president.sn@demo.parlement.ga',
            color: 'amber',
        },
    ],
    PARLIAMENT: [
        {
            id: 'congress',
            title: 'Simulation de Congrès',
            description: 'Réunion des deux chambres pour révision constitutionnelle',
            icon: Scale,
            loginAs: null, // Pas de connexion directe
            color: 'slate',
            special: true,
        },
        {
            id: 'cmp',
            title: 'Simulation de CMP',
            description: 'Commission Mixte Paritaire : 7 députés + 7 sénateurs',
            icon: FileText,
            loginAs: null, // Pas de connexion directe
            color: 'slate',
            special: true,
        },
    ],
};

/**
 * Hub de Démonstration des Protocoles
 * S'adapte selon l'institution courante
 */
const ProtocolHub: React.FC = () => {
    const navigate = useNavigate();
    const { currentInstitution, institutionConfig } = useInstitution();

    const roles = DEMO_ROLES[currentInstitution];
    const { theme } = institutionConfig;

    // Couleurs par institution
    const colorClasses = {
        emerald: {
            bg: 'bg-emerald-500',
            bgLight: 'bg-emerald-50 dark:bg-emerald-950/30',
            text: 'text-emerald-600',
            border: 'border-emerald-200 dark:border-emerald-800',
        },
        amber: {
            bg: 'bg-amber-500',
            bgLight: 'bg-amber-50 dark:bg-amber-950/30',
            text: 'text-amber-600',
            border: 'border-amber-200 dark:border-amber-800',
        },
        slate: {
            bg: 'bg-slate-600',
            bgLight: 'bg-slate-50 dark:bg-slate-950/30',
            text: 'text-slate-600',
            border: 'border-slate-200 dark:border-slate-800',
        },
    };

    const handleDemoLogin = (loginAs: string | null, roleId: string) => {
        if (loginAs) {
            // Stocker le rôle de démo et rediriger vers le login
            sessionStorage.setItem('demo_role', roleId);
            sessionStorage.setItem('demo_email', loginAs);
            navigate(`${institutionConfig.basePath}/login?demo=true`);
        } else {
            // Pour les simulations spéciales du Parlement
            navigate(`${institutionConfig.basePath}/${roleId}`);
        }
    };

    const getInstitutionIcon = () => {
        switch (currentInstitution) {
            case 'ASSEMBLY': return Building2;
            case 'SENATE': return Landmark;
            case 'PARLIAMENT': return Scale;
        }
    };

    const InstitutionIcon = getInstitutionIcon();

    return (
        <div className={cn(
            "min-h-screen transition-colors",
            currentInstitution === 'ASSEMBLY' && "bg-gradient-to-br from-emerald-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-emerald-950",
            currentInstitution === 'SENATE' && "bg-gradient-to-br from-amber-50 via-white to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-amber-950",
            currentInstitution === 'PARLIAMENT' && "bg-gradient-to-br from-slate-50 via-white to-gray-100 dark:from-gray-900 dark:via-slate-900 dark:to-gray-900",
        )}>
            {/* Navigation */}
            <UnifiedNavbar showLogin={false} />

            {/* Header */}
            <section className="pt-24 pb-12 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <div className={cn(
                        "inline-flex items-center justify-center w-20 h-20 rounded-full mb-6",
                        theme.bgClass
                    )}>
                        <InstitutionIcon className="h-10 w-10 text-white" />
                    </div>

                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        Démonstration des Protocoles
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400">
                        Découvrez les fonctionnalités de la plateforme {institutionConfig.name}
                    </p>

                    <Badge className={cn("mt-4", theme.bgClass, "text-white")}>
                        {institutionConfig.name}
                    </Badge>
                </div>
            </section>

            {/* Parliament Notice */}
            {currentInstitution === 'PARLIAMENT' && (
                <div className="max-w-4xl mx-auto px-4 mb-8">
                    <Alert className="bg-blue-50 dark:bg-blue-950/30 border-blue-200">
                        <AlertCircle className="h-4 w-4 text-blue-600" />
                        <AlertDescription className="text-blue-700 dark:text-blue-300">
                            <strong>Note :</strong> Le Parlement n'a pas de comptes propres.
                            Pour accéder à cet espace, utilisez un <strong>compte Député ou Sénateur existant</strong>.
                            Le système détectera automatiquement vos droits de siège en Congrès ou CMP.
                        </AlertDescription>
                    </Alert>
                </div>
            )}

            {/* Demo Roles */}
            <section className="pb-16 px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-6">
                        {roles.map((role) => {
                            const Icon = role.icon;
                            const colors = colorClasses[role.color as keyof typeof colorClasses];

                            return (
                                <Card
                                    key={role.id}
                                    className={cn(
                                        "overflow-hidden transition-all hover:shadow-xl cursor-pointer group",
                                        colors.border
                                    )}
                                    onClick={() => handleDemoLogin(role.loginAs, role.id)}
                                >
                                    <CardHeader className={cn("pb-3", colors.bgLight)}>
                                        <div className="flex items-center gap-3">
                                            <div className={cn(
                                                "w-12 h-12 rounded-full flex items-center justify-center",
                                                colors.bg,
                                                "text-white"
                                            )}>
                                                <Icon className="h-6 w-6" />
                                            </div>
                                            <div>
                                                <CardTitle className="text-lg">{role.title}</CardTitle>
                                                {role.special && (
                                                    <Badge variant="outline" className="text-xs mt-1">
                                                        Simulation
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="pt-4">
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                            {role.description}
                                        </p>

                                        <div className="flex items-center justify-between">
                                            {role.loginAs ? (
                                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                                    <UserCheck className="h-4 w-4" />
                                                    <span className="font-mono text-xs">{role.loginAs}</span>
                                                </div>
                                            ) : (
                                                <span className="text-sm text-gray-500 italic">
                                                    Accès via compte existant
                                                </span>
                                            )}

                                            <Button
                                                size="sm"
                                                className={cn(colors.bg, "text-white group-hover:opacity-90")}
                                            >
                                                <Play className="h-4 w-4 mr-1" />
                                                {role.loginAs ? 'Tester' : 'Explorer'}
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-12 bg-white/50 dark:bg-gray-800/50">
                <div className="max-w-4xl mx-auto px-4">
                    <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-8">
                        Comment ça marche ?
                    </h2>

                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="text-center p-6">
                            <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mx-auto mb-4">
                                <span className="text-xl font-bold text-gray-600 dark:text-gray-300">1</span>
                            </div>
                            <h3 className="font-semibold mb-2">Choisissez un rôle</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Sélectionnez le profil que vous souhaitez tester
                            </p>
                        </div>

                        <div className="text-center p-6">
                            <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mx-auto mb-4">
                                <span className="text-xl font-bold text-gray-600 dark:text-gray-300">2</span>
                            </div>
                            <h3 className="font-semibold mb-2">Connexion automatique</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Les identifiants de démo sont pré-remplis
                            </p>
                        </div>

                        <div className="text-center p-6">
                            <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mx-auto mb-4">
                                <span className="text-xl font-bold text-gray-600 dark:text-gray-300">3</span>
                            </div>
                            <h3 className="font-semibold mb-2">Explorez librement</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Naviguez dans toutes les fonctionnalités du rôle
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Back Button */}
            <section className="py-8 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <Button
                        variant="outline"
                        onClick={() => navigate(institutionConfig.basePath)}
                    >
                        ← Retour à l'accueil
                    </Button>
                </div>
            </section>
        </div>
    );
};

export default ProtocolHub;
