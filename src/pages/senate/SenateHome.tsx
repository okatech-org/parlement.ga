import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Users,
    FileText,
    Calendar,
    Vote,
    Landmark,
    Building,
    ArrowRight,
    Clock,
    MapPin
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useLanguage } from '@/contexts/LanguageContext';

/**
 * Page d'accueil du Sénat
 * Route: /senat
 */
const SenateHome: React.FC = () => {
    const navigate = useNavigate();
    const { t } = useLanguage();

    // Données simulées pour la démo
    const stats = {
        senators: 102,
        activeSessions: 2,
        pendingLaws: 8,
        collectivities: 50,
    };

    const recentTexts = [
        {
            id: '1',
            reference: 'PL-2024-040',
            title: 'Projet de loi relatif aux collectivités territoriales',
            status: t('senate.home.statuses.inExam'),
            progress: 60,
            origin: 'AN', // Transmis par l'AN
        },
        {
            id: '2',
            reference: 'PPL-SN-2024-005',
            title: 'Proposition de loi sur le développement rural',
            status: t('senate.home.statuses.commission'),
            progress: 35,
            origin: 'SN',
        },
    ];

    const upcomingSessions = [
        {
            id: '1',
            title: 'Examen du budget des collectivités',
            date: '18 Déc 2024',
            time: '10:00',
            type: t('senate.home.statuses.commission'),
        },
        {
            id: '2',
            title: 'Séance plénière - Vote projet de loi',
            date: '20 Déc 2024',
            time: '15:00',
            type: 'Plénière', // Missing key, using string or could add key
        },
    ];

    return (
        <div className="space-y-8">
            {/* Hero Banner */}
            <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-amber-600 via-yellow-600 to-orange-600 p-8 md:p-12 text-white">
                <div className="absolute inset-0 bg-[url('/images/senate-pattern.svg')] opacity-10"></div>
                <div className="relative z-10">
                    <Badge className="bg-white/20 text-white border-white/30 mb-4">
                        {t('senate.home.badge')}
                    </Badge>
                    <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">
                        {t('senate.home.title')}
                    </h1>
                    <p className="text-xl text-white/90 max-w-2xl mb-6">
                        {t('senate.home.description')}
                    </p>
                    <div className="flex flex-wrap gap-4">
                        <Button
                            size="lg"
                            className="bg-white text-amber-700 hover:bg-white/90"
                            onClick={() => navigate('/senat/palais')}
                        >
                            <Landmark className="mr-2 h-5 w-5" />
                            {t('senate.home.buttons.discoverPalace')}
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            className="border-white/50 text-white hover:bg-white/10"
                            onClick={() => navigate('/senat/travaux')}
                        >
                            <FileText className="mr-2 h-5 w-5" />
                            {t('senate.home.buttons.senatorialWork')}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="border-amber-200 dark:border-amber-800">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">{t('senate.home.stats.senators')}</p>
                                <p className="text-3xl font-bold text-amber-600">{stats.senators}</p>
                            </div>
                            <Users className="h-10 w-10 text-amber-500/30" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-amber-200 dark:border-amber-800">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">{t('senate.home.stats.activeSessions')}</p>
                                <p className="text-3xl font-bold text-amber-600">{stats.activeSessions}</p>
                            </div>
                            <Calendar className="h-10 w-10 text-amber-500/30" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-amber-200 dark:border-amber-800">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">{t('senate.home.stats.textsInShuttle')}</p>
                                <p className="text-3xl font-bold text-amber-600">{stats.pendingLaws}</p>
                            </div>
                            <FileText className="h-10 w-10 text-amber-500/30" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-amber-200 dark:border-amber-800">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">{t('senate.home.stats.collectivities')}</p>
                                <p className="text-3xl font-bold text-amber-600">{stats.collectivities}</p>
                            </div>
                            <MapPin className="h-10 w-10 text-amber-500/30" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-3 gap-6">
                {/* Legislative Texts from Assembly */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <FileText className="h-5 w-5 text-amber-600" />
                                    {t('senate.home.cards.textsTitle')}
                                </CardTitle>
                                <CardDescription>
                                    {t('senate.home.cards.textsDesc')}
                                </CardDescription>
                            </div>
                            <Button variant="ghost" size="sm" onClick={() => navigate('/senat/travaux')}>
                                {t('senate.home.cards.viewAll')} <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {recentTexts.map((text) => (
                            <div
                                key={text.id}
                                className="p-4 rounded-lg border border-border hover:border-amber-300 hover:bg-amber-50/50 dark:hover:bg-amber-950/20 transition-all cursor-pointer"
                                onClick={() => navigate(`/senat/textes/${text.id}`)}
                            >
                                <div className="flex items-start justify-between mb-2">
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <Badge variant="outline" className="text-amber-600 border-amber-300">
                                                {text.reference}
                                            </Badge>
                                            {text.origin === 'AN' && (
                                                <Badge className="bg-emerald-100 text-emerald-700 text-xs">
                                                    {t('senate.home.cards.transmittedByAN')}
                                                </Badge>
                                            )}
                                        </div>
                                        <h4 className="font-medium">{text.title}</h4>
                                    </div>
                                    <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300">
                                        {text.status}
                                    </Badge>
                                </div>
                                <div className="flex items-center gap-2 mt-3">
                                    <Progress value={text.progress} className="flex-1 h-2" />
                                    <span className="text-sm text-muted-foreground">{text.progress}%</span>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Upcoming Sessions */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Clock className="h-5 w-5 text-amber-600" />
                            {t('senate.home.cards.nextSessions')}
                        </CardTitle>
                        <CardDescription>{t('senate.home.cards.senateAgenda')}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {upcomingSessions.map((session) => (
                            <div
                                key={session.id}
                                className="p-4 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800"
                            >
                                <Badge className="mb-2 bg-amber-600">{session.type}</Badge>
                                <h4 className="font-medium mb-2">{session.title}</h4>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Calendar className="h-4 w-4" />
                                    <span>{session.date}</span>
                                    <span>•</span>
                                    <Clock className="h-4 w-4" />
                                    <span>{session.time}</span>
                                </div>
                            </div>
                        ))}

                        <Button variant="outline" className="w-full border-amber-300 text-amber-600" onClick={() => navigate('/senat/agenda')}>
                            {t('senate.home.cards.viewFullAgenda')}
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Access Cards */}
            <div className="grid md:grid-cols-3 gap-4">
                <Card
                    className="cursor-pointer hover:shadow-lg transition-all border-l-4 border-l-amber-500"
                    onClick={() => navigate('/senat/senateurs')}
                >
                    <CardContent className="pt-6">
                        <Users className="h-8 w-8 text-amber-600 mb-3" />
                        <h3 className="font-semibold mb-1">{t('senate.home.cards.senatorsTitle')}</h3>
                        <p className="text-sm text-muted-foreground">
                            {t('senate.home.cards.senatorsDesc')}
                        </p>
                    </CardContent>
                </Card>

                <Card
                    className="cursor-pointer hover:shadow-lg transition-all border-l-4 border-l-amber-500"
                    onClick={() => navigate('/senat/commissions')}
                >
                    <CardContent className="pt-6">
                        <Building className="h-8 w-8 text-amber-600 mb-3" />
                        <h3 className="font-semibold mb-1">{t('senate.home.cards.commissionsTitle')}</h3>
                        <p className="text-sm text-muted-foreground">
                            {t('senate.home.cards.commissionsDesc')}
                        </p>
                    </CardContent>
                </Card>

                <Card
                    className="cursor-pointer hover:shadow-lg transition-all border-l-4 border-l-amber-500"
                    onClick={() => navigate('/senat/collectivites')}
                >
                    <CardContent className="pt-6">
                        <MapPin className="h-8 w-8 text-amber-600 mb-3" />
                        <h3 className="font-semibold mb-1">{t('senate.home.cards.collectivitiesTitle')}</h3>
                        <p className="text-sm text-muted-foreground">
                            {t('senate.home.cards.collectivitiesDesc')}
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default SenateHome;
