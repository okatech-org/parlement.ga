import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    Landmark, Users, FileText, Calendar, Video,
    ArrowRight, Newspaper, GraduationCap, PlayCircle,
    MapPin, ExternalLink, Building, Crown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import UnifiedNavbar from '@/components/navigation/UnifiedNavbar';

/**
 * Page d'accueil publique du Sénat
 * Thème : ROUGE BORDEAUX / OR
 */
const HomeSenate: React.FC = () => {
    const navigate = useNavigate();

    const navLinks = [
        { label: 'Actualités', href: '/senat/actualites', icon: Newspaper },
        { label: 'Sensibilisation', href: '/senat/sensibilisation', icon: GraduationCap },
        { label: 'Tutoriels', href: '/senat/tutoriels', icon: PlayCircle },
        { label: 'Démo Protocole', href: '/senat/demo', icon: Landmark },
    ];

    const quickStats = [
        { label: 'Sénateurs', value: 102, icon: Users },
        { label: 'Textes en navette', value: 8, icon: FileText },
        { label: 'Sessions cette année', value: 35, icon: Calendar },
    ];

    const latestNews = [
        {
            id: 1,
            title: 'Le Sénat examine le projet de loi sur la décentralisation',
            date: '13 Déc 2024',
            category: 'Législation',
        },
        {
            id: 2,
            title: 'Rencontre avec les élus locaux des provinces',
            date: '12 Déc 2024',
            category: 'Collectivités',
        },
        {
            id: 3,
            title: 'Séance solennelle d\'ouverture de session',
            date: '10 Déc 2024',
            category: 'Plénière',
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-amber-950">
            {/* Navigation */}
            <UnifiedNavbar
                links={navLinks}
                showLogin
                loginPath="/senat/login"
            />

            {/* Hero Section */}
            <section className="relative pt-24 pb-16 overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute inset-0 bg-[url('/images/senate-pattern.svg')] bg-repeat" />
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-20 right-0 w-96 h-96 bg-gradient-to-br from-amber-200/30 to-yellow-200/30 rounded-full blur-3xl" />

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Text Content */}
                        <div>
                            <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 mb-6">
                                <Crown className="h-3 w-3 mr-1" />
                                Chambre haute du Parlement
                            </Badge>

                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                                <span className="text-amber-600">Sénat</span>{' '}
                                du Gabon
                            </h1>

                            <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
                                La voix des territoires
                            </p>

                            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-lg">
                                Le Sénat représente les collectivités territoriales de la République.
                                Nos 102 sénateurs œuvrent pour l'équilibre institutionnel et la
                                représentation de toutes les provinces gabonaises.
                            </p>

                            <div className="flex flex-wrap gap-4">
                                <Button
                                    size="lg"
                                    className="bg-amber-600 hover:bg-amber-700 text-white"
                                    onClick={() => navigate('/senat/travaux')}
                                >
                                    Travaux en cours
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="border-amber-600 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950"
                                    onClick={() => navigate('/senat/senateurs')}
                                >
                                    <Users className="mr-2 h-4 w-4" />
                                    Nos Sénateurs
                                </Button>
                            </div>

                            {/* Location */}
                            <div className="flex items-center gap-2 mt-8 text-sm text-gray-500 dark:text-gray-400">
                                <MapPin className="h-4 w-4" />
                                <span>Palais Omar Bongo Ondimba, Libreville</span>
                            </div>
                        </div>

                        {/* Hero Image */}
                        <div className="relative">
                            <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl shadow-amber-500/20">
                                <div className="absolute inset-0 bg-gradient-to-br from-amber-600/90 to-yellow-700/90 flex items-center justify-center">
                                    <Landmark className="h-32 w-32 text-white/30" />
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/60">
                                    <p className="text-white font-semibold">Palais Omar Bongo Ondimba</p>
                                    <p className="text-white/80 text-sm">Siège du Sénat</p>
                                </div>
                            </div>

                            {/* Floating Badge */}
                            <div className="absolute -bottom-4 -left-4 bg-white dark:bg-gray-800 rounded-xl shadow-xl p-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-yellow-500 flex items-center justify-center">
                                        <Landmark className="h-6 w-6 text-white" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900 dark:text-white">9 Provinces</p>
                                        <p className="text-sm text-gray-500">Représentées</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Quick Stats */}
            <section className="py-12 bg-gradient-to-r from-amber-600 to-yellow-600 dark:from-amber-800 dark:to-yellow-800">
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

            {/* Mission Section */}
            <section className="py-16 bg-amber-50/50 dark:bg-amber-950/20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                            Mission du Sénat
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                            Gardien de l'équilibre institutionnel et voix des collectivités
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <Card className="text-center border-t-4 border-t-amber-500">
                            <CardContent className="p-6">
                                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                                    <Building className="h-8 w-8 text-amber-600" />
                                </div>
                                <h3 className="font-bold text-lg mb-2">Représentation Territoriale</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Défendre les intérêts des collectivités locales et des provinces
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="text-center border-t-4 border-t-amber-500">
                            <CardContent className="p-6">
                                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                                    <FileText className="h-8 w-8 text-amber-600" />
                                </div>
                                <h3 className="font-bold text-lg mb-2">Contrôle Législatif</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Examiner et améliorer les textes votés par l'Assemblée
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="text-center border-t-4 border-t-amber-500">
                            <CardContent className="p-6">
                                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                                    <Crown className="h-8 w-8 text-amber-600" />
                                </div>
                                <h3 className="font-bold text-lg mb-2">Sagesse et Réflexion</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Apporter recul et expertise dans le processus législatif
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Latest News */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                        <Newspaper className="h-6 w-6 text-amber-600" />
                        Dernières Actualités
                    </h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        {latestNews.map((news) => (
                            <Card key={news.id} className="hover:shadow-lg transition-shadow border-l-4 border-l-amber-500 cursor-pointer">
                                <CardContent className="p-4">
                                    <Badge variant="outline" className="mb-2 text-xs text-amber-600 border-amber-300">
                                        {news.category}
                                    </Badge>
                                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                                        {news.title}
                                    </h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {news.date}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-8 bg-gradient-to-r from-amber-800 to-yellow-800 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <Landmark className="h-8 w-8 mx-auto mb-4 opacity-50" />
                    <p className="text-sm opacity-80">
                        © {new Date().getFullYear()} Sénat de la République Gabonaise. Tous droits réservés.
                    </p>
                    <p className="text-xs opacity-60 mt-2">
                        Palais Omar Bongo Ondimba - Libreville, Gabon
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default HomeSenate;
