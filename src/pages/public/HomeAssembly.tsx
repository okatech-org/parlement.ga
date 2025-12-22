import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Building2, Users, FileText, Calendar, Video,
    ArrowRight, Newspaper, GraduationCap, PlayCircle,
    MapPin, ExternalLink, CheckCircle, Send, MessageSquare,
    Gavel, Clock, ArrowLeftRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import UnifiedNavbar from '@/components/navigation/UnifiedNavbar';
import { useLanguage } from '@/contexts/LanguageContext';
import heroAssembly from '@/assets/hero-assembly.jpg';

/**
 * Page d'accueil publique de l'Assemblée Nationale
 * Thème : VERT FORÊT
 */
const HomeAssembly: React.FC = () => {
    const navigate = useNavigate();
    const { t } = useLanguage();

    const navLinks = [
        { label: t('assembly.nav.news'), href: '/an/actualites', icon: Newspaper },
        { label: t('assembly.nav.sensibilisation'), href: '/an/sensibilisation', icon: GraduationCap },
        { label: t('assembly.nav.tutorials'), href: '/an/tutoriels', icon: PlayCircle },
        { label: t('assembly.nav.demo'), href: '/an/demo', icon: Building2 },
    ];

    const quickStats = [
        { label: t('assembly.home.stats.deputies'), value: 143, icon: Users },
        { label: t('assembly.home.stats.texts'), value: 23, icon: FileText },
        { label: t('assembly.home.stats.sessions'), value: 47, icon: Calendar },
    ];

    const latestNews = [
        {
            id: 1,
            title: 'Adoption du projet de loi de finances 2025',
            date: '13 Déc 2024',
            category: t('news.categories.legislation'),
        },
        {
            id: 2,
            title: 'Session plénière sur la réforme de l\'éducation',
            date: '12 Déc 2024',
            category: t('news.categories.publicSession'),
        },
        {
            id: 3,
            title: 'Installation de la nouvelle commission des lois',
            date: '10 Déc 2024',
            category: t('assembly.sections.quickAccess.commissions'),
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-emerald-950">
            {/* Navigation */}
            <UnifiedNavbar
                links={navLinks}
                showLogin
                loginPath="/an/login"
            />

            {/* Hero Section */}
            <section className="relative pt-20 sm:pt-24 pb-12 sm:pb-16 overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute inset-0 bg-[url('/images/assembly-pattern.svg')] bg-repeat" />
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                        {/* Text Content */}
                        <div className="text-center lg:text-left">
                            <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 mb-4 sm:mb-6">
                                <Building2 className="h-3 w-3 mr-1" />
                                {t('assembly.home.badge')}
                            </Badge>

                            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
                                <span className="text-emerald-600">{t('assembly.home.title').split(' ')[0]}</span>{' '}
                                {t('assembly.home.title').split(' ')[1]}
                            </h1>

                            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 mb-3 sm:mb-4">
                                {t('assembly.home.subtitle')}
                            </p>

                            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-6 sm:mb-8 max-w-lg mx-auto lg:mx-0">
                                {t('assembly.home.description')}
                            </p>

                            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
                                <Button
                                    size="lg"
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white w-full sm:w-auto"
                                    onClick={() => navigate('/an/travaux')}
                                >
                                    {t('assembly.home.buttons.works')}
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="border-emerald-600 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950 w-full sm:w-auto"
                                    onClick={() => navigate('/an/deputes')}
                                >
                                    <Users className="mr-2 h-4 w-4" />
                                    {t('assembly.home.buttons.deputies')}
                                </Button>
                            </div>

                            {/* Location */}
                            <div className="flex items-center justify-center lg:justify-start gap-2 mt-6 sm:mt-8 text-sm text-gray-500 dark:text-gray-400">
                                <MapPin className="h-4 w-4" />
                                <span>{t('assembly.home.location')}</span>
                            </div>
                        </div>

                        {/* Hero Image */}
                        <div className="relative hidden lg:block">
                            <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl shadow-emerald-500/20">
                                <img 
                                    src={heroAssembly} 
                                    alt="Palais Léon Mba - Assemblée Nationale du Gabon" 
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                                    <p className="text-white font-semibold">Palais Léon Mba</p>
                                    <p className="text-white/80 text-sm">{t('assembly.home.badge')}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Quick Stats */}
            <section className="py-8 sm:py-12 bg-emerald-600 dark:bg-emerald-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-3 gap-4 sm:gap-8">
                        {quickStats.map((stat, index) => {
                            const Icon = stat.icon;
                            return (
                                <div key={index} className="text-center text-white">
                                    <Icon className="h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-1 sm:mb-2 opacity-80" />
                                    <p className="text-xl sm:text-3xl font-bold">{stat.value}</p>
                                    <p className="text-xs sm:text-sm opacity-80">{stat.label}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Latest News & Quick Access */}
            <section className="py-12 sm:py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">

                        {/* Latest News */}
                        <div>
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 flex items-center gap-2">
                                <Newspaper className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-600" />
                                {t('assembly.sections.news.title')}
                            </h2>
                            <div className="space-y-3 sm:space-y-4">
                                {latestNews.map((news) => (
                                    <Card key={news.id} className="hover:shadow-lg transition-shadow border-l-4 border-l-emerald-500">
                                        <CardContent className="p-3 sm:p-4">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1 min-w-0">
                                                    <Badge variant="outline" className="mb-2 text-xs">
                                                        {news.category}
                                                    </Badge>
                                                    <h3 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white line-clamp-2">
                                                        {news.title}
                                                    </h3>
                                                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
                                                        {news.date}
                                                    </p>
                                                </div>
                                                <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 flex-shrink-0 ml-2" />
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                            <Button variant="link" className="text-emerald-600 mt-4 p-0">
                                {t('assembly.sections.news.viewAll')}
                                <ExternalLink className="ml-1 h-4 w-4" />
                            </Button>
                        </div>

                        {/* Quick Access */}
                        <div>
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 flex items-center gap-2">
                                <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-600" />
                                {t('assembly.sections.quickAccess.title')}
                            </h2>
                            <div className="grid grid-cols-2 gap-3 sm:gap-4">
                                <Card className="cursor-pointer hover:shadow-lg hover:border-emerald-300 transition-all">
                                    <CardContent className="p-4 sm:p-6 text-center">
                                        <Video className="h-8 w-8 sm:h-10 sm:w-10 mx-auto mb-2 sm:mb-3 text-emerald-600" />
                                        <h3 className="font-semibold text-sm sm:text-base">{t('assembly.sections.quickAccess.direct')}</h3>
                                        <p className="text-xs sm:text-sm text-gray-500 mt-1 hidden sm:block">{t('assembly.sections.quickAccess.directDesc')}</p>
                                    </CardContent>
                                </Card>

                                <Card className="cursor-pointer hover:shadow-lg hover:border-emerald-300 transition-all">
                                    <CardContent className="p-4 sm:p-6 text-center">
                                        <Calendar className="h-8 w-8 sm:h-10 sm:w-10 mx-auto mb-2 sm:mb-3 text-emerald-600" />
                                        <h3 className="font-semibold text-sm sm:text-base">{t('assembly.sections.quickAccess.agenda')}</h3>
                                        <p className="text-xs sm:text-sm text-gray-500 mt-1 hidden sm:block">{t('assembly.sections.quickAccess.agendaDesc')}</p>
                                    </CardContent>
                                </Card>

                                <Card className="cursor-pointer hover:shadow-lg hover:border-emerald-300 transition-all">
                                    <CardContent className="p-4 sm:p-6 text-center">
                                        <FileText className="h-8 w-8 sm:h-10 sm:w-10 mx-auto mb-2 sm:mb-3 text-emerald-600" />
                                        <h3 className="font-semibold text-sm sm:text-base">{t('assembly.sections.quickAccess.bills')}</h3>
                                        <p className="text-xs sm:text-sm text-gray-500 mt-1 hidden sm:block">{t('assembly.sections.quickAccess.billsDesc')}</p>
                                    </CardContent>
                                </Card>

                                <Card className="cursor-pointer hover:shadow-lg hover:border-emerald-300 transition-all">
                                    <CardContent className="p-4 sm:p-6 text-center">
                                        <Users className="h-8 w-8 sm:h-10 sm:w-10 mx-auto mb-2 sm:mb-3 text-emerald-600" />
                                        <h3 className="font-semibold text-sm sm:text-base">{t('assembly.sections.quickAccess.commissions')}</h3>
                                        <p className="text-xs sm:text-sm text-gray-500 mt-1 hidden sm:block">{t('assembly.sections.quickAccess.commissionsDesc')}</p>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Protocole Législatif */}
            <section className="py-12 sm:py-20 bg-gradient-to-br from-emerald-50 to-green-100 dark:from-emerald-950/50 dark:to-gray-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-8 sm:mb-12">
                        <Badge className="mb-3 sm:mb-4 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                            <Gavel className="h-3 w-3 mr-1" />
                            {t('assembly.sections.protocol.badge')}
                        </Badge>
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
                            {t('assembly.sections.protocol.title')}
                        </h2>
                        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                            {t('assembly.sections.protocol.description')}
                        </p>
                    </div>

                    {/* Fonctionnalités clés */}
                    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
                        <Card className="border-t-4 border-t-emerald-500">
                            <CardHeader className="pb-2 sm:pb-4">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-2">
                                    <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-600" />
                                </div>
                                <CardTitle className="text-base sm:text-lg">{t('assembly.sections.protocol.steps.deposit')}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                                <div className="flex items-center gap-2"><CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-emerald-500 flex-shrink-0" /><span className="line-clamp-1">{t('assembly.sections.protocol.steps.depositDesc0')}</span></div>
                                <div className="flex items-center gap-2"><CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-emerald-500 flex-shrink-0" /><span className="line-clamp-1">{t('assembly.sections.protocol.steps.depositDesc1')}</span></div>
                                <div className="flex items-center gap-2"><CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-emerald-500 flex-shrink-0" /><span className="line-clamp-1">{t('assembly.sections.protocol.steps.depositDesc2')}</span></div>
                            </CardContent>
                        </Card>

                        <Card className="border-t-4 border-t-amber-500">
                            <CardHeader className="pb-2 sm:pb-4">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mb-2">
                                    <Users className="h-5 w-5 sm:h-6 sm:w-6 text-amber-600" />
                                </div>
                                <CardTitle className="text-base sm:text-lg">{t('assembly.sections.protocol.steps.commission')}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                                <div className="flex items-center gap-2"><CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-emerald-500 flex-shrink-0" /><span className="line-clamp-1">{t('assembly.sections.protocol.steps.commissionDesc0')}</span></div>
                                <div className="flex items-center gap-2"><CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-emerald-500 flex-shrink-0" /><span className="line-clamp-1">{t('assembly.sections.protocol.steps.commissionDesc1')}</span></div>
                                <div className="flex items-center gap-2"><CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-emerald-500 flex-shrink-0" /><span className="line-clamp-1">{t('assembly.sections.protocol.steps.commissionDesc2')}</span></div>
                            </CardContent>
                        </Card>

                        <Card className="border-t-4 border-t-blue-500 sm:col-span-2 md:col-span-1">
                            <CardHeader className="pb-2 sm:pb-4">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-2">
                                    <ArrowLeftRight className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                                </div>
                                <CardTitle className="text-base sm:text-lg">{t('assembly.sections.protocol.steps.shuttle')}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                                <div className="flex items-center gap-2"><CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-emerald-500 flex-shrink-0" /><span className="line-clamp-1">{t('assembly.sections.protocol.steps.shuttleDesc0')}</span></div>
                                <div className="flex items-center gap-2"><CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-emerald-500 flex-shrink-0" /><span className="line-clamp-1">{t('assembly.sections.protocol.steps.shuttleDesc1')}</span></div>
                                <div className="flex items-center gap-2"><CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-emerald-500 flex-shrink-0" /><span className="line-clamp-1">{t('assembly.sections.protocol.steps.shuttleDesc2')}</span></div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Processus */}
                    <Card className="max-w-4xl mx-auto bg-white dark:bg-gray-800">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                                <Clock className="h-5 w-5" />
                                {t('assembly.sections.protocol.timeline.title')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                                {[
                                    { step: 1, title: t('assembly.sections.protocol.timeline.step1'), icon: FileText },
                                    { step: 2, title: t('assembly.sections.protocol.timeline.step2'), icon: Users },
                                    { step: 3, title: t('assembly.sections.protocol.timeline.step3'), icon: MessageSquare },
                                    { step: 4, title: t('assembly.sections.protocol.timeline.step4'), icon: CheckCircle },
                                    { step: 5, title: t('assembly.sections.protocol.timeline.step5'), icon: Send },
                                ].map((item, index) => {
                                    const Icon = item.icon;
                                    return (
                                        <div key={item.step} className="relative text-center">
                                            <div className="w-12 h-12 mx-auto rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold mb-2">
                                                {item.step}
                                            </div>
                                            <Icon className="h-5 w-5 mx-auto text-gray-500 dark:text-gray-400 mb-1" />
                                            <h4 className="font-medium text-sm text-gray-900 dark:text-white">{item.title}</h4>
                                            {index < 4 && (
                                                <div className="hidden md:block absolute top-6 left-[60%] w-[80%] h-0.5 bg-emerald-200 dark:bg-emerald-800" />
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>

                    {/* CTA */}
                    <div className="text-center mt-10">
                        <Button
                            size="lg"
                            className="bg-emerald-600 hover:bg-emerald-700 text-white"
                            onClick={() => navigate('/an/demo')}
                        >
                            <PlayCircle className="mr-2 h-5 w-5" />
                            {t('assembly.home.buttons.demo')}
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-8 bg-emerald-900 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <Building2 className="h-8 w-8 mx-auto mb-4 opacity-50" />
                    <p className="text-sm opacity-80">
                        {t('assembly.footer.copyright')}
                    </p>
                    <p className="text-xs opacity-60 mt-2">
                        {t('assembly.footer.address')}
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default HomeAssembly;
