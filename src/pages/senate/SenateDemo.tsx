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
import InstitutionSubHeader from "@/components/layout/InstitutionSubHeader";
import { useLanguage } from "@/contexts/LanguageContext";

/**
 * Page de démonstration du Sénat
 * Accès aux différents espaces selon les rôles
 */
const SenateDemo = () => {
    const navigate = useNavigate();
    const { theme, setTheme } = useTheme();
    const { t } = useLanguage();

    // Structure des comptes démo avec rôles et fonctionnalités intégrées
    const SENATE_DEMO_CARDS = {
        bureau: {
            title: t('senate.demo.categories.bureau'),
            icon: Crown,
            color: "text-amber-500",
            accounts: [
                {
                    label: t('senate.demo.roles.presidentSenate'),
                    phone: '11111111',
                    path: '/senat/espace/president',
                    icon: Crown,
                    color: 'text-amber-500',
                    role: t('congress.demo.protocol.roles.president'),
                    features: [t('senate.demo.features.shuttleValidation'), t('senate.demo.features.cmpConvocation'), t('senate.demo.features.agenda'), t('senate.demo.features.statistics')]
                },
                {
                    label: t('senate.demo.roles.vpSenate'),
                    phone: '12121212',
                    path: '/senat/espace/vp',
                    icon: Crown,
                    color: 'text-amber-400',
                    role: t('congress.demo.protocol.roles.vicePresident'),
                    features: [t('senate.demo.features.presidencyDeputy'), t('senate.demo.features.commissionsMgmt'), t('senate.demo.features.delegations')]
                },
                {
                    label: t('senate.demo.roles.questeurSenate'),
                    phone: '14141414',
                    path: '/senat/espace/questeur',
                    icon: Briefcase,
                    color: 'text-blue-500',
                    role: t('congress.demo.protocol.roles.questeur'),
                    features: [t('senate.demo.features.senateBudget'), t('senate.demo.features.materialMgmt'), t('senate.demo.features.allowances'), t('senate.demo.features.adminServices')]
                },
            ]
        },
        senateurs: {
            title: t('senate.demo.categories.senators'),
            icon: Users,
            color: "text-primary",
            accounts: [
                {
                    label: t('senate.demo.roles.senatorEstuaire'),
                    phone: '10101010',
                    path: '/senat/espace',
                    icon: Users,
                    color: 'text-primary',
                    role: 'Estuaire',
                    features: [t('senate.demo.features.shuttleTexts'), t('senate.demo.features.localGrievances'), t('senate.demo.features.fieldVisits'), t('senate.demo.features.electedMessaging')]
                },
                {
                    label: t('senate.demo.roles.senatorWoleu'),
                    phone: '10101011',
                    path: '/senat/espace',
                    icon: Users,
                    color: 'text-emerald-500',
                    role: 'Woleu-Ntem',
                    features: [t('senate.demo.features.shuttleTexts'), t('senate.demo.features.localGrievances'), t('senate.demo.features.fieldVisits'), t('senate.demo.features.electedMessaging')]
                },
                {
                    label: t('senate.demo.roles.senatorHautOgooue'),
                    phone: '10101012',
                    path: '/senat/espace',
                    icon: Users,
                    color: 'text-orange-500',
                    role: 'Haut-Ogooué',
                    features: [t('senate.demo.features.shuttleTexts'), t('senate.demo.features.localGrievances'), t('senate.demo.features.fieldVisits'), t('senate.demo.features.electedMessaging')]
                },
            ]
        },
        fonctionnalites: {
            title: t('senate.demo.categories.features'),
            icon: MapPin,
            color: "text-blue-600",
            accounts: [
                {
                    label: t('senate.demo.roles.grievancesModule'),
                    phone: null,
                    path: '/senat/espace/doleances',
                    icon: AlertTriangle,
                    color: 'text-amber-600',
                    role: 'Module',
                    features: [t('senate.demo.features.collectivityReports'), t('senate.demo.features.provinceTracking'), t('senate.demo.features.priorities'), t('senate.demo.features.statistics')]
                },
                {
                    label: t('senate.demo.roles.fieldVisits'),
                    phone: null,
                    path: '/senat/espace/visites',
                    icon: MapPin,
                    color: 'text-blue-600',
                    role: 'Module',
                    features: [t('senate.demo.features.tripReports'), t('senate.demo.features.fieldPhotos'), t('senate.demo.features.recommendations'), t('senate.demo.features.tracking')]
                },
            ]
        },
        public: {
            title: t('senate.demo.categories.public'),
            icon: UserCircle,
            color: "text-green-500",
            accounts: [
                {
                    label: t('senate.demo.roles.publicPortal'),
                    phone: null,
                    path: '/senat',
                    icon: UserCircle,
                    color: 'text-green-500',
                    role: 'Public',
                    features: [t('senate.demo.features.news'), t('senate.demo.features.legislativeWork'), t('senate.home.cards.senatorsTitle'), t('senate.demo.features.contact')]
                },
            ]
        }
    };

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
        sessionStorage.setItem('is_demo', 'true');

        toast.success(t('senate.demo.loginSuccess'));
        navigate(redirectPath);
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Unified Header */}
            <InstitutionSubHeader
                institution="SENATE"
                pageTitle={t('senate.demo.headerTitle')}
                pageSubtitle={t('senate.demo.headerDesc')}
                pageIcon={PlayCircle}
            />

            {/* Hero compact */}
            <section className="py-12 bg-gradient-to-br from-primary/5 to-primary/10">
                <div className="container mx-auto px-4 text-center">
                    <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
                        <PlayCircle className="h-3 w-3 mr-1" />
                        {t('senate.demo.badge')}
                    </Badge>
                    <h1 className="text-3xl md:text-4xl font-serif font-bold mb-3">
                        {t('senate.demo.heroTitle')}
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
                        {t('senate.demo.heroDesc')}
                    </p>
                    <Button variant="outline" onClick={() => navigate("/senat/espace")}>
                        <Monitor className="mr-2 h-4 w-4" />
                        {t('senate.demo.directAccess')}
                    </Button>
                </div>
            </section>

            {/* Cartes d'accès avec rôles intégrés */}
            <div className="container mx-auto px-4 py-12">
                <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <LogIn className="w-5 h-5 text-primary" />
                            {t('senate.demo.cardsTitle')}
                        </CardTitle>
                        <CardDescription>
                            {t('senate.demo.cardsDesc')}
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
                    <Badge variant="outline" className="mb-2">{t('congress.demo.protocol.badge')}</Badge>
                    <h2 className="text-2xl font-bold font-serif mb-2">{t('senate.demo.protocolTitle')}</h2>
                    <p className="text-muted-foreground">{t('senate.demo.protocolDesc')}</p>
                </div>
                <ProtocolDemoSection />
            </section>

            {/* Footer */}
            <footer className="bg-card border-t border-border py-8">
                <div className="container mx-auto px-4 text-center">
                    <div className="flex justify-center items-center gap-2 mb-4">
                        <Landmark className="h-6 w-6 text-primary" />
                        <span className="font-serif font-bold">{t('senate.process.footer.title')}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        {t('senate.process.footer.address')}
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default SenateDemo;

