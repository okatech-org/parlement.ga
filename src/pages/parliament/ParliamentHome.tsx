import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Users,
    FileText,
    Scale,
    Archive,
    Handshake,
    ArrowRight,
    GitBranch,
    Clock,
    AlertTriangle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';

/**
 * Page d'accueil du Congrès (Parlement réuni)
 * Route: /congres
 */
const ParliamentHome: React.FC = () => {
    const navigate = useNavigate();
    const { t } = useLanguage();

    // Données simulées pour la démo
    const stats = {
        totalMembers: 247, // 145 députés + 102 sénateurs
        cmpActive: 2,
        jointSessions: 5,
        archivedLaws: 1250,
    };

    const activeCMPs = [
        {
            id: '1',
            reference: 'CMP-2024-003',
            title: 'Commission Mixte sur la réforme constitutionnelle',
            status: 'En cours',
            members: { an: 7, sn: 7 },
            startDate: '10 Déc 2024',
        },
        {
            id: '2',
            reference: 'CMP-2024-004',
            title: 'Commission Mixte sur le code électoral',
            status: 'En négociation',
            members: { an: 7, sn: 7 },
            startDate: '12 Déc 2024',
        },
    ];

    const recentJointDecisions = [
        {
            id: '1',
            type: 'Loi constitutionnelle',
            title: 'Révision de l\'article 47 de la Constitution',
            date: '5 Déc 2024',
            result: 'Adoptée',
        },
        {
            id: '2',
            type: 'Résolution',
            title: 'Déclaration conjointe sur le climat',
            date: '28 Nov 2024',
            result: 'Adoptée',
        },
    ];

    return (
        <div className="space-y-8">
            {/* Hero Banner */}
            <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-slate-700 via-gray-700 to-zinc-800 p-8 md:p-12 text-white">
                <div className="absolute inset-0 bg-[url('/images/parliament-pattern.svg')] opacity-10"></div>
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                        <Badge className="bg-emerald-500/80 text-white border-emerald-400">
                            {t('congress.home.hero.badgeAN')}
                        </Badge>
                        <span className="text-2xl">+</span>
                        <Badge className="bg-amber-500/80 text-white border-amber-400">
                            {t('congress.home.hero.badgeSenate')}
                        </Badge>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">
                        {t('congress.home.hero.title')}
                    </h1>
                    <p className="text-xl text-white/90 max-w-2xl mb-6">
                        {t('congress.home.hero.desc')}
                    </p>
                    <div className="flex flex-wrap gap-4">
                        <Button
                            size="lg"
                            className="bg-white text-slate-700 hover:bg-white/90"
                            onClick={() => navigate('/congres/cmp')}
                        >
                            <Handshake className="mr-2 h-5 w-5" />
                            {t('congress.home.hero.btnCMP')}
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            className="border-white/50 text-white hover:bg-white/10"
                            onClick={() => navigate('/congres/archives')}
                        >
                            <Archive className="mr-2 h-5 w-5" />
                            {t('congress.home.hero.btnArchives')}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="border-slate-200 dark:border-slate-700">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">{t('congress.home.stats.members')}</p>
                                <p className="text-3xl font-bold text-slate-700 dark:text-slate-300">{stats.totalMembers}</p>
                                <p className="text-xs text-muted-foreground">145 + 102</p>
                            </div>
                            <Users className="h-10 w-10 text-slate-500/30" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-slate-200 dark:border-slate-700">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">{t('congress.home.stats.cmpActive')}</p>
                                <p className="text-3xl font-bold text-slate-700 dark:text-slate-300">{stats.cmpActive}</p>
                            </div>
                            <Handshake className="h-10 w-10 text-slate-500/30" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-slate-200 dark:border-slate-700">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">{t('congress.home.stats.jointSessions')}</p>
                                <p className="text-3xl font-bold text-slate-700 dark:text-slate-300">{stats.jointSessions}</p>
                            </div>
                            <Scale className="h-10 w-10 text-slate-500/30" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-slate-200 dark:border-slate-700">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">{t('congress.home.stats.archivedLaws')}</p>
                                <p className="text-3xl font-bold text-slate-700 dark:text-slate-300">{stats.archivedLaws}</p>
                            </div>
                            <Archive className="h-10 w-10 text-slate-500/30" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Active CMPs Section */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <Handshake className="h-5 w-5 text-slate-600" />
                                {t('congress.home.cmp.title')}
                            </CardTitle>
                            <CardDescription>
                                {t('congress.home.cmp.subtitle')}
                            </CardDescription>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => navigate('/congres/cmp')}>
                            {t('congress.home.cmp.all')} <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    {activeCMPs.map((cmp) => (
                        <div
                            key={cmp.id}
                            className="p-4 rounded-lg border border-border hover:border-slate-400 hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-all cursor-pointer"
                            onClick={() => navigate(`/congres/cmp/${cmp.id}`)}
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div>
                                    <Badge variant="outline" className="text-slate-600 border-slate-400 mb-2">
                                        {cmp.reference}
                                    </Badge>
                                    <h4 className="font-medium">{cmp.title}</h4>
                                </div>
                                <Badge className={cmp.status === 'En cours' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'}>
                                    {cmp.status}
                                </Badge>
                            </div>

                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                                        <span className="text-muted-foreground">{cmp.members.an} {t('congress.common.deputies')}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                                        <span className="text-muted-foreground">{cmp.members.sn} {t('congress.common.senators')}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 text-muted-foreground">
                                    <Clock className="h-4 w-4" />
                                    <span>{t('congress.home.cmp.since')} {cmp.startDate}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>

            {/* Two Column Layout */}
            <div className="grid lg:grid-cols-2 gap-6">
                {/* Legislative Flow Diagram */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <GitBranch className="h-5 w-5 text-slate-600" />
                            {t('congress.home.navette.title')}
                        </CardTitle>
                        <CardDescription>
                            {t('congress.home.navette.desc')}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="relative">
                            {/* Visual Flow */}
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex flex-col items-center">
                                    <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center mb-2">
                                        <span className="text-xl font-bold text-emerald-600">AN</span>
                                    </div>
                                    <span className="text-xs text-muted-foreground">{t('congress.home.navette.an')}</span>
                                </div>

                                <div className="flex-1 mx-4 relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="h-1 w-full bg-gradient-to-r from-emerald-500 via-slate-400 to-amber-500 rounded"></div>
                                    </div>
                                    <div className="relative flex justify-center">
                                        <div className="bg-slate-200 dark:bg-slate-700 px-3 py-1 rounded-full text-xs font-medium">
                                            {t('congress.home.navette.label')}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col items-center">
                                    <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center mb-2">
                                        <span className="text-xl font-bold text-amber-600">SN</span>
                                    </div>
                                    <span className="text-xs text-muted-foreground">{t('congress.home.navette.senate')}</span>
                                </div>
                            </div>

                            <div className="text-center mt-4">
                                <div className="inline-flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-full">
                                    <AlertTriangle className="h-4 w-4 text-orange-500" />
                                    <span className="text-sm">{t('congress.home.navette.alert')}</span>
                                </div>
                            </div>
                        </div>

                        <Button variant="outline" className="w-full mt-6" onClick={() => navigate('/congres/navette')}>
                            {t('congress.home.navette.btn')}
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </CardContent>
                </Card>

                {/* Recent Joint Decisions */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Scale className="h-5 w-5 text-slate-600" />
                            {t('congress.home.decisions.title')}
                        </CardTitle>
                        <CardDescription>{t('congress.home.decisions.desc')}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {recentJointDecisions.map((decision) => (
                            <div
                                key={decision.id}
                                className="p-4 rounded-lg bg-slate-50 dark:bg-slate-900/30 border border-slate-200 dark:border-slate-700"
                            >
                                <div className="flex items-start justify-between mb-2">
                                    <Badge className="bg-slate-600">{decision.type}</Badge>
                                    <Badge className="bg-green-100 text-green-700">{decision.result}</Badge>
                                </div>
                                <h4 className="font-medium mb-2">{decision.title}</h4>
                                <p className="text-sm text-muted-foreground">{decision.date}</p>
                            </div>
                        ))}

                        <Button variant="outline" className="w-full" onClick={() => navigate('/congres/decisions')}>
                            {t('congress.home.decisions.btn')}
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Access Cards */}
            <div className="grid md:grid-cols-3 gap-4">
                <Card
                    className="cursor-pointer hover:shadow-lg transition-all border-l-4 border-l-slate-500"
                    onClick={() => navigate('/congres/archives')}
                >
                    <CardContent className="pt-6">
                        <Archive className="h-8 w-8 text-slate-600 mb-3" />
                        <h3 className="font-semibold mb-1">{t('congress.home.quick.archives.title')}</h3>
                        <p className="text-sm text-muted-foreground">
                            {t('congress.home.quick.archives.desc')}
                        </p>
                    </CardContent>
                </Card>

                <Card
                    className="cursor-pointer hover:shadow-lg transition-all border-l-4 border-l-slate-500"
                    onClick={() => navigate('/congres/services')}
                >
                    <CardContent className="pt-6">
                        <Users className="h-8 w-8 text-slate-600 mb-3" />
                        <h3 className="font-semibold mb-1">{t('congress.home.quick.services.title')}</h3>
                        <p className="text-sm text-muted-foreground">
                            {t('congress.home.quick.services.desc')}
                        </p>
                    </CardContent>
                </Card>

                <Card
                    className="cursor-pointer hover:shadow-lg transition-all border-l-4 border-l-slate-500"
                    onClick={() => navigate('/congres/constitution')}
                >
                    <CardContent className="pt-6">
                        <FileText className="h-8 w-8 text-slate-600 mb-3" />
                        <h3 className="font-semibold mb-1">{t('congress.home.quick.constitution.title')}</h3>
                        <p className="text-sm text-muted-foreground">
                            {t('congress.home.quick.constitution.desc')}
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default ParliamentHome;
