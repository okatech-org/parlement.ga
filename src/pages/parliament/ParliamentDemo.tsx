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
import { useLanguage } from '@/contexts/LanguageContext';
import InstitutionSubHeader from '@/components/layout/InstitutionSubHeader';

const ParliamentDemo = () => {
    const navigate = useNavigate();
    const { theme, setTheme } = useTheme();
    const { t } = useLanguage();

    const PARLIAMENT_DEMO_CARDS = {
        bureau: {
            title: t('congress.demo.cards.bureau'),
            icon: Crown,
            color: "text-[#D19C00]",
            accounts: [
                {
                    label: t('congress.demo.cards.accounts.presidentCongress'),
                    phone: '20202001',
                    path: '/parlement/espace/president',
                    icon: Crown,
                    color: 'text-[#D19C00]',
                    role: t('congress.demo.cards.roles.president'),
                    features: [
                        t('congress.demo.cards.featuresList.sessionConvocations'),
                        t('congress.demo.cards.featuresList.cmpSupervision'),
                        t('congress.demo.cards.featuresList.congressAgenda')
                    ]
                },
                {
                    label: t('congress.demo.cards.accounts.sessionSecretary'),
                    phone: '20202002',
                    path: '/parlement/congres',
                    icon: FileText,
                    color: 'text-[#3A87FD]',
                    role: t('congress.demo.cards.roles.secretary'),
                    features: [
                        t('congress.demo.cards.featuresList.minutes'),
                        t('congress.demo.cards.featuresList.quorumCheck'),
                        t('congress.demo.cards.featuresList.votesCounting')
                    ]
                },
            ]
        },
        parlementaires: {
            title: t('congress.demo.cards.members'),
            icon: Users,
            color: "text-[#77BA41]",
            accounts: [
                {
                    label: t('congress.demo.cards.accounts.deputyCongress'),
                    phone: '20202003',
                    path: '/parlement/congres',
                    icon: Users,
                    color: 'text-[#3A87FD]',
                    role: t('congress.demo.cards.roles.deputy'),
                    features: [
                        t('congress.demo.cards.featuresList.constRevisionVote'),
                        t('congress.demo.cards.featuresList.cmpDebates'),
                        t('congress.demo.cards.featuresList.questions')
                    ]
                },
                {
                    label: t('congress.demo.cards.accounts.senatorCongress'),
                    phone: '20202004',
                    path: '/parlement/congres',
                    icon: Users,
                    color: 'text-[#D19C00]',
                    role: t('congress.demo.cards.roles.senator'),
                    features: [
                        t('congress.demo.cards.featuresList.constRevisionVote'),
                        t('congress.demo.cards.featuresList.cmpDebates'),
                        t('congress.demo.cards.featuresList.questions')
                    ]
                },
            ]
        },
        cmp: {
            title: t('congress.demo.cards.cmp'),
            icon: ArrowLeftRight,
            color: "text-purple-500",
            accounts: [
                {
                    label: "Commissaire CMP (AN)",
                    phone: '20202005',
                    path: '/parlement/cmp',
                    icon: ArrowLeftRight,
                    color: 'text-[#3A87FD]',
                    role: t('congress.demo.cards.roles.commissioner'),
                    features: [
                        t('congress.demo.cards.featuresList.textsNegotiation'),
                        t('congress.demo.cards.featuresList.cmpAmendments'),
                        t('congress.demo.cards.featuresList.compromiseVote')
                    ]
                },
                {
                    label: "Commissaire CMP (Sénat)",
                    phone: '20202006',
                    path: '/parlement/cmp',
                    icon: ArrowLeftRight,
                    color: 'text-[#D19C00]',
                    role: t('congress.demo.cards.roles.commissioner'),
                    features: [
                        t('congress.demo.cards.featuresList.textsNegotiation'),
                        t('congress.demo.cards.featuresList.cmpAmendments'),
                        t('congress.demo.cards.featuresList.compromiseVote')
                    ]
                },
                {
                    label: "Coprésident CMP (AN)",
                    phone: '20202007',
                    path: '/parlement/cmp',
                    icon: Crown,
                    color: 'text-purple-600',
                    role: "Coprésident",
                    features: [
                        "Présidence alternée CMP",
                        t('congress.demo.cards.featuresList.textsNegotiation'),
                        t('congress.demo.cards.featuresList.compromiseVote')
                    ]
                },
                {
                    label: "Coprésident CMP (Sénat)",
                    phone: '20202008',
                    path: '/parlement/cmp',
                    icon: Crown,
                    color: 'text-purple-600',
                    role: "Coprésident",
                    features: [
                        "Présidence alternée CMP",
                        t('congress.demo.cards.featuresList.textsNegotiation'),
                        t('congress.demo.cards.featuresList.compromiseVote')
                    ]
                }
            ]
        }
    };

    const handleDemoLogin = (phone: string | null, redirectPath: string) => {
        if (!phone) {
            navigate(redirectPath);
            return;
        }

        const mockUsers: Record<string, { name: string; roles: string[] }> = {
            '20202001': { name: 'Michel Régis Onanga Ndiaye', roles: ['president_congress', 'president', 'deputy', 'citizen'] },
            '20202002': { name: 'MOUNDOUNGA Bernadette', roles: ['secretary_session', 'secretary', 'deputy', 'citizen'] },
            '20202003': { name: 'NDONG ESSONO Pierre', roles: ['deputy_congress', 'deputy', 'citizen'] },
            '20202004': { name: 'ONDO MOUCHITA Laurent', roles: ['senator_congress', 'senator', 'citizen'] },
            '20202005': { name: 'BIYOGHE MEBA Joséphine', roles: ['cmp_member', 'deputy', 'citizen'] },
            '20202006': { name: 'NZAMBA NZAMBA Robert', roles: ['cmp_member', 'senator', 'citizen'] },
            '20202007': { name: 'MEBIAME François', roles: ['cmp_member', 'deputy', 'citizen'] },
            '20202008': { name: 'KOMBILA MOUSSAVOU Alain', roles: ['cmp_member', 'senator', 'citizen'] },
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

        toast.success(t('congress.demo.loginSuccess'));
        // Use window.location.href to force full page reload so UserContext reads sessionStorage
        window.location.href = redirectPath;
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Unified Header */}
            <InstitutionSubHeader
                institution="PARLIAMENT"
                pageTitle={t('congress.demo.header.title')}
                pageSubtitle={t('congress.demo.header.subtitle')}
                pageIcon={PlayCircle}
            />

            {/* Hero compact */}
            <section className="py-12 bg-gradient-to-br from-[#77BA41]/5 to-[#77BA41]/10">
                <div className="container mx-auto px-4 text-center">
                    <Badge className="mb-4 bg-[#77BA41]/10 text-[#77BA41] border-[#77BA41]/20">
                        <PlayCircle className="h-3 w-3 mr-1" />
                        {t('congress.demo.hero.mode')}
                    </Badge>
                    <h1 className="text-3xl md:text-4xl font-serif font-bold mb-3">
                        {t('congress.demo.hero.title')}
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
                        {t('congress.demo.hero.desc')}
                    </p>
                    <Button variant="outline" onClick={() => navigate("/parlement/espace")}>
                        <Monitor className="mr-2 h-4 w-4" />
                        {t('congress.demo.hero.accessBtn')}
                    </Button>
                </div>
            </section>

            {/* Cartes d'accès */}
            <div className="container mx-auto px-4 py-12">
                <Card className="border-[#77BA41]/20 bg-gradient-to-br from-[#77BA41]/5 to-transparent">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <LogIn className="w-5 h-5 text-[#77BA41]" />
                            {t('congress.demo.cards.access')}
                        </CardTitle>
                        <CardDescription>
                            {t('congress.demo.cards.accessDesc')}
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
                                                    className="cursor-pointer hover:shadow-lg hover:border-[#77BA41]/50 transition-all duration-200"
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



            {/* Footer */}
            <footer className="bg-card border-t border-border py-8">
                <div className="container mx-auto px-4 text-center">
                    <div className="flex justify-center items-center gap-2 mb-4">
                        <Landmark className="h-6 w-6 text-[#77BA41]" />
                        <span className="font-serif font-bold">{t('common.parliamentOfGabon')}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        {t('congress.common.senate')} + {t('congress.common.an')} • Libreville
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default ParliamentDemo;
