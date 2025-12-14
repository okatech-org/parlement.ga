import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    Building2, Users, FileText, Calendar, Video,
    ArrowRight, Newspaper, GraduationCap, PlayCircle,
    MapPin, ExternalLink, CheckCircle, Send, MessageSquare,
    Gavel, Clock, ArrowLeftRight, Scale
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import UnifiedNavbar from '@/components/navigation/UnifiedNavbar';

/**
 * Page d'accueil publique de l'Assemblée Nationale
 * Thème : VERT FORÊT
 */
const HomeAssembly: React.FC = () => {
    const navigate = useNavigate();

    const navLinks = [
        { label: 'Actualités', href: '/an/actualites', icon: Newspaper },
        { label: 'Sensibilisation', href: '/an/sensibilisation', icon: GraduationCap },
        { label: 'Tutoriels', href: '/an/tutoriels', icon: PlayCircle },
        { label: 'Démo Protocole', href: '/an/demo', icon: Building2 },
    ];

    const quickStats = [
        { label: 'Députés', value: 143, icon: Users },
        { label: 'Textes en cours', value: 23, icon: FileText },
        { label: 'Sessions cette année', value: 47, icon: Calendar },
    ];

    const latestNews = [
        {
            id: 1,
            title: 'Adoption du projet de loi de finances 2025',
            date: '13 Déc 2024',
            category: 'Législation',
        },
        {
            id: 2,
            title: 'Session plénière sur la réforme de l\'éducation',
            date: '12 Déc 2024',
            category: 'Plénière',
        },
        {
            id: 3,
            title: 'Installation de la nouvelle commission des lois',
            date: '10 Déc 2024',
            category: 'Commission',
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
            <section className="relative pt-24 pb-16 overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute inset-0 bg-[url('/images/assembly-pattern.svg')] bg-repeat" />
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Text Content */}
                        <div>
                            <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 mb-6">
                                <Building2 className="h-3 w-3 mr-1" />
                                Chambre basse du Parlement
                            </Badge>

                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                                <span className="text-emerald-600">Assemblée</span>{' '}
                                Nationale
                            </h1>

                            <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
                                du Gabon
                            </p>

                            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-lg">
                                Bienvenue sur le portail officiel de l'Assemblée Nationale.
                                Suivez les travaux législatifs, les débats en plénière et l'activité
                                de vos 143 députés.
                            </p>

                            <div className="flex flex-wrap gap-4">
                                <Button
                                    size="lg"
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                                    onClick={() => navigate('/an/travaux')}
                                >
                                    Travaux en cours
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="border-emerald-600 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950"
                                    onClick={() => navigate('/an/deputes')}
                                >
                                    <Users className="mr-2 h-4 w-4" />
                                    Nos Députés
                                </Button>
                            </div>

                            {/* Location */}
                            <div className="flex items-center gap-2 mt-8 text-sm text-gray-500 dark:text-gray-400">
                                <MapPin className="h-4 w-4" />
                                <span>Palais Léon Mba, Boulevard Triomphal, Libreville</span>
                            </div>
                        </div>

                        {/* Hero Image */}
                        <div className="relative">
                            <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl shadow-emerald-500/20">
                                <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/90 to-green-700/90 flex items-center justify-center">
                                    <Building2 className="h-32 w-32 text-white/30" />
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/60">
                                    <p className="text-white font-semibold">Palais Léon Mba</p>
                                    <p className="text-white/80 text-sm">Siège de l'Assemblée Nationale</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Quick Stats */}
            <section className="py-12 bg-emerald-600 dark:bg-emerald-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-3 gap-8">
                        {quickStats.map((stat, index) => {
                            const Icon = stat.icon;
                            return (
                                <div key={index} className="text-center text-white">
                                    <Icon className="h-8 w-8 mx-auto mb-2 opacity-80" />
                                    <p className="text-3xl font-bold">{stat.value}</p>
                                    <p className="text-sm opacity-80">{stat.label}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Latest News & Quick Access */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12">

                        {/* Latest News */}
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                                <Newspaper className="h-6 w-6 text-emerald-600" />
                                Actualités
                            </h2>
                            <div className="space-y-4">
                                {latestNews.map((news) => (
                                    <Card key={news.id} className="hover:shadow-lg transition-shadow border-l-4 border-l-emerald-500">
                                        <CardContent className="p-4">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <Badge variant="outline" className="mb-2 text-xs">
                                                        {news.category}
                                                    </Badge>
                                                    <h3 className="font-semibold text-gray-900 dark:text-white">
                                                        {news.title}
                                                    </h3>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                                        {news.date}
                                                    </p>
                                                </div>
                                                <ArrowRight className="h-5 w-5 text-gray-400" />
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                            <Button variant="link" className="text-emerald-600 mt-4 p-0">
                                Voir toutes les actualités
                                <ExternalLink className="ml-1 h-4 w-4" />
                            </Button>
                        </div>

                        {/* Quick Access */}
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                                <FileText className="h-6 w-6 text-emerald-600" />
                                Accès Rapide
                            </h2>
                            <div className="grid grid-cols-2 gap-4">
                                <Card className="cursor-pointer hover:shadow-lg hover:border-emerald-300 transition-all">
                                    <CardContent className="p-6 text-center">
                                        <Video className="h-10 w-10 mx-auto mb-3 text-emerald-600" />
                                        <h3 className="font-semibold">Direct Plénière</h3>
                                        <p className="text-sm text-gray-500 mt-1">Suivez les débats en direct</p>
                                    </CardContent>
                                </Card>

                                <Card className="cursor-pointer hover:shadow-lg hover:border-emerald-300 transition-all">
                                    <CardContent className="p-6 text-center">
                                        <Calendar className="h-10 w-10 mx-auto mb-3 text-emerald-600" />
                                        <h3 className="font-semibold">Agenda</h3>
                                        <p className="text-sm text-gray-500 mt-1">Prochaines séances</p>
                                    </CardContent>
                                </Card>

                                <Card className="cursor-pointer hover:shadow-lg hover:border-emerald-300 transition-all">
                                    <CardContent className="p-6 text-center">
                                        <FileText className="h-10 w-10 mx-auto mb-3 text-emerald-600" />
                                        <h3 className="font-semibold">Projets de loi</h3>
                                        <p className="text-sm text-gray-500 mt-1">Textes en discussion</p>
                                    </CardContent>
                                </Card>

                                <Card className="cursor-pointer hover:shadow-lg hover:border-emerald-300 transition-all">
                                    <CardContent className="p-6 text-center">
                                        <Users className="h-10 w-10 mx-auto mb-3 text-emerald-600" />
                                        <h3 className="font-semibold">Commissions</h3>
                                        <p className="text-sm text-gray-500 mt-1">6 commissions permanentes</p>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Protocole Législatif */}
            <section className="py-20 bg-gradient-to-br from-emerald-50 to-green-100 dark:from-emerald-950/50 dark:to-gray-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <Badge className="mb-4 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                            <Gavel className="h-3 w-3 mr-1" />
                            Processus Législatif
                        </Badge>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                            Protocole Législatif de l'Assemblée
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                            Du dépôt d'un projet de loi à son adoption en séance plénière
                        </p>
                    </div>

                    {/* Fonctionnalités clés */}
                    <div className="grid md:grid-cols-3 gap-6 mb-12">
                        <Card className="border-t-4 border-t-emerald-500">
                            <CardHeader>
                                <div className="w-12 h-12 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-2">
                                    <FileText className="h-6 w-6 text-emerald-600" />
                                </div>
                                <CardTitle className="text-lg">Dépôt des Textes</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                                <div className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-500" />Projets de loi du Gouvernement</div>
                                <div className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-500" />Propositions de loi des députés</div>
                                <div className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-500" />Amendements en commission</div>
                            </CardContent>
                        </Card>

                        <Card className="border-t-4 border-t-amber-500">
                            <CardHeader>
                                <div className="w-12 h-12 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mb-2">
                                    <Users className="h-6 w-6 text-amber-600" />
                                </div>
                                <CardTitle className="text-lg">Travail en Commission</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                                <div className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-500" />6 commissions permanentes</div>
                                <div className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-500" />Auditions des ministres</div>
                                <div className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-500" />Rapport du rapporteur</div>
                            </CardContent>
                        </Card>

                        <Card className="border-t-4 border-t-blue-500">
                            <CardHeader>
                                <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-2">
                                    <ArrowLeftRight className="h-6 w-6 text-blue-600" />
                                </div>
                                <CardTitle className="text-lg">Navette Parlementaire</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                                <div className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-500" />Transmission au Sénat</div>
                                <div className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-500" />Commission Mixte Paritaire</div>
                                <div className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-500" />Lecture définitive</div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Processus */}
                    <Card className="max-w-4xl mx-auto bg-white dark:bg-gray-800">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                                <Clock className="h-5 w-5" />
                                Étapes d'examen d'un texte
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                                {[
                                    { step: 1, title: "Dépôt", icon: FileText },
                                    { step: 2, title: "Commission", icon: Users },
                                    { step: 3, title: "Discussion", icon: MessageSquare },
                                    { step: 4, title: "Vote", icon: CheckCircle },
                                    { step: 5, title: "Transmission", icon: Send },
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
                            Essayer la démo
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
                        © {new Date().getFullYear()} Assemblée Nationale du Gabon. Tous droits réservés.
                    </p>
                    <p className="text-xs opacity-60 mt-2">
                        Palais Léon Mba - Libreville, Gabon
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default HomeAssembly;
