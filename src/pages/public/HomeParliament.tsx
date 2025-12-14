import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Scale, Users, FileText, Calendar, BookOpen,
    ArrowRight, ArrowLeftRight, Building2, Landmark,
    Shield, ChevronRight, PlayCircle, Sun, Moon,
    Globe, MapPin
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useTheme } from 'next-themes';

/**
 * Page d'accueil centrale du Parlement (Hub de Navigation)
 * Rôle : Point d'entrée principal vers AN et Sénat
 * Thème : BLEU ROI / Solennel
 */
const HomeParliament: React.FC = () => {
    const navigate = useNavigate();
    const { theme, setTheme } = useTheme();

    // Institutions (Chambres du Parlement)
    const institutions = [
        {
            id: 'assembly',
            name: 'Assemblée Nationale',
            subtitle: 'Chambre basse - Représentation du peuple',
            description: '143 députés élus au suffrage universel direct, votent les lois et contrôlent l\'action gouvernementale.',
            icon: Building2,
            path: '/an',
            color: 'emerald',
            bgGradient: 'from-emerald-500 to-green-600',
            deputies: 143,
            location: 'Palais Léon Mba, Libreville',
            features: ['Vote des lois', 'Questions au gouvernement', 'Commissions permanentes'],
        },
        {
            id: 'senate',
            name: 'Sénat',
            subtitle: 'Chambre haute - Représentation des territoires',
            description: '102 sénateurs représentent les collectivités territoriales et apportent sagesse et réflexion.',
            icon: Landmark,
            path: '/senat',
            color: 'amber',
            bgGradient: 'from-amber-500 to-yellow-600',
            deputies: 102,
            location: 'Palais Omar Bongo Ondimba, Libreville',
            features: ['Examen des lois', 'Représentation territoriale', 'Navette législative'],
        },
    ];

    // CMP actives
    const activeCMPs = [
        {
            id: 1,
            reference: 'CMP-2024-003',
            title: 'Réforme constitutionnelle - Article sur le mandat présidentiel',
            status: 'En cours',
            deadline: '24 Déc 2024',
        },
        {
            id: 2,
            reference: 'CMP-2024-002',
            title: 'Projet de loi sur la décentralisation territoriale',
            status: 'En attente',
            deadline: '28 Déc 2024',
        },
    ];

    // Lois récentes
    const recentLaws = [
        { reference: 'LOI-2024-045', title: 'Loi de finances pour l\'exercice 2025', date: '10 Déc 2024' },
        { reference: 'LOI-2024-044', title: 'Loi portant code de la nationalité', date: '5 Déc 2024' },
        { reference: 'LOI-2024-043', title: 'Loi relative à la protection de l\'environnement', date: '28 Nov 2024' },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-100 dark:from-gray-900 dark:via-slate-900 dark:to-gray-900">
            {/* Header Navigation */}
            <header className="border-b border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center">
                                <Scale className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <h1 className="text-lg font-bold text-slate-800 dark:text-white">Parlement du Gabon</h1>
                                <p className="text-xs text-slate-500 dark:text-slate-400">parlement.ga</p>
                            </div>
                        </div>

                        <nav className="hidden md:flex items-center gap-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => navigate('/an')}
                                className="text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950"
                            >
                                <Building2 className="h-4 w-4 mr-1" />
                                Assemblée
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => navigate('/senat')}
                                className="text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950"
                            >
                                <Landmark className="h-4 w-4 mr-1" />
                                Sénat
                            </Button>
                            <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-2" />
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                                className="h-9 w-9"
                            >
                                {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                            </Button>
                            <Button
                                size="sm"
                                className="bg-slate-800 hover:bg-slate-700 text-white"
                                onClick={() => navigate('/login')}
                            >
                                Espace Élus
                            </Button>
                        </nav>

                        {/* Mobile Menu */}
                        <div className="md:hidden flex items-center gap-2">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                            >
                                {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative pt-16 pb-24 overflow-hidden">
                {/* Background */}
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-gray-800 to-slate-900" />
                    <div className="absolute inset-0 opacity-5 bg-[url('/images/parliament-pattern.svg')] bg-repeat" />
                    <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-slate-50 dark:from-gray-900" />
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    {/* Emblem */}
                    <div className="mb-8">
                        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
                            <Scale className="h-12 w-12 text-white" />
                        </div>
                    </div>

                    <Badge className="bg-white/20 text-white border-white/30 mb-6">
                        <Shield className="h-3 w-3 mr-1" />
                        Pouvoir Législatif de la République
                    </Badge>

                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
                        Parlement de la
                    </h1>
                    <h2 className="text-3xl md:text-4xl font-light text-white/80 mb-6">
                        République Gabonaise
                    </h2>

                    <p className="text-xl text-white/70 mb-4 italic">
                        "L'union des deux chambres"
                    </p>

                    <p className="text-white/60 max-w-2xl mx-auto mb-10">
                        Bienvenue sur le portail numérique du Parlement gabonais.
                        Accédez aux travaux de l'Assemblée Nationale et du Sénat.
                    </p>

                    {/* Stats */}
                    <div className="flex justify-center items-center gap-8 md:gap-16">
                        <div className="text-center">
                            <p className="text-3xl font-bold text-white">245</p>
                            <p className="text-sm text-white/60">Parlementaires</p>
                        </div>
                        <div className="w-px h-12 bg-white/20" />
                        <div className="text-center">
                            <p className="text-3xl font-bold text-white">2</p>
                            <p className="text-sm text-white/60">Chambres</p>
                        </div>
                        <div className="w-px h-12 bg-white/20" />
                        <div className="text-center">
                            <p className="text-3xl font-bold text-white">150+</p>
                            <p className="text-sm text-white/60">Lois votées</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Institutions Cards - Navigation Hub */}
            <section className="py-16 -mt-20 relative z-10">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 gap-8">
                        {institutions.map((inst) => {
                            const Icon = inst.icon;
                            return (
                                <Card
                                    key={inst.id}
                                    className="group overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 border-0"
                                    onClick={() => navigate(inst.path)}
                                >
                                    {/* Colored Header */}
                                    <div className={`bg-gradient-to-r ${inst.bgGradient} p-6 text-white`}>
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center">
                                                    <Icon className="h-7 w-7" />
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-bold">{inst.name}</h3>
                                                    <p className="text-sm text-white/80">{inst.subtitle}</p>
                                                </div>
                                            </div>
                                            <ChevronRight className="h-6 w-6 opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <CardContent className="p-6 bg-white dark:bg-gray-800">
                                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                                            {inst.description}
                                        </p>

                                        {/* Features */}
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {inst.features.map((feature, idx) => (
                                                <Badge key={idx} variant="secondary" className="text-xs">
                                                    {feature}
                                                </Badge>
                                            ))}
                                        </div>

                                        {/* Footer */}
                                        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                                <Users className="h-4 w-4" />
                                                <span>{inst.deputies} membres</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-gray-400">
                                                <MapPin className="h-3 w-3" />
                                                <span>{inst.location.split(',')[0]}</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* CMP Section */}
            <section className="py-16 bg-slate-50 dark:bg-slate-900/30">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <ArrowLeftRight className="h-6 w-6 text-slate-600" />
                                Commissions Mixtes Paritaires
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400 mt-1">
                                7 Députés + 7 Sénateurs négocient un texte commun
                            </p>
                        </div>
                        <Button variant="outline" onClick={() => navigate('/cmp')}>
                            Toutes les CMP
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {activeCMPs.map((cmp) => (
                            <Card key={cmp.id} className="hover:shadow-lg transition-shadow border-l-4 border-l-slate-500">
                                <CardContent className="p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <Badge variant="outline" className="text-slate-600 border-slate-300">
                                            {cmp.reference}
                                        </Badge>
                                        <Badge className={cmp.status === 'En cours' ? 'bg-blue-500' : 'bg-orange-500'}>
                                            {cmp.status}
                                        </Badge>
                                    </div>
                                    <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                                        {cmp.title}
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        Échéance : <span className="font-medium">{cmp.deadline}</span>
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Recent Laws */}
            <section className="py-16">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <BookOpen className="h-6 w-6 text-slate-600" />
                                Journal Officiel Numérique
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400 mt-1">
                                Dernières lois promulguées
                            </p>
                        </div>
                        <Button variant="outline" onClick={() => navigate('/archives')}>
                            Archives complètes
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {recentLaws.map((law, index) => (
                            <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                                <CardContent className="p-6">
                                    <div className="flex items-center gap-2 mb-3">
                                        <FileText className="h-5 w-5 text-slate-400" />
                                        <Badge variant="secondary" className="text-xs">
                                            {law.reference}
                                        </Badge>
                                    </div>
                                    <h3 className="font-medium text-gray-900 dark:text-white mb-3 line-clamp-2">
                                        {law.title}
                                    </h3>
                                    <p className="text-xs text-gray-500">
                                        Promulguée le {law.date}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Demo Section */}
            <section className="py-16 bg-gradient-to-br from-slate-800 to-gray-900">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <PlayCircle className="h-12 w-12 text-white/50 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-white mb-4">
                        Découvrir la plateforme
                    </h3>
                    <p className="text-white/70 max-w-xl mx-auto mb-8">
                        Explorez les fonctionnalités du Parlement numérique avec nos démonstrations interactives.
                    </p>
                    <div className="flex justify-center gap-4">
                        <Button
                            size="lg"
                            className="bg-white text-slate-800 hover:bg-gray-100"
                            onClick={() => navigate('/an/demo')}
                        >
                            <Building2 className="mr-2 h-4 w-4" />
                            Démo Assemblée
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            className="border-white/50 text-white hover:bg-white/10"
                            onClick={() => navigate('/senat/demo')}
                        >
                            <Landmark className="mr-2 h-4 w-4" />
                            Démo Sénat
                        </Button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-8 bg-slate-900 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="flex justify-center items-center gap-4 mb-4">
                        <Building2 className="h-6 w-6 opacity-50" />
                        <Scale className="h-8 w-8 opacity-70" />
                        <Landmark className="h-6 w-6 opacity-50" />
                    </div>
                    <p className="text-lg font-semibold mb-2">
                        "Union - Travail - Justice"
                    </p>
                    <p className="text-sm opacity-60">
                        © {new Date().getFullYear()} Parlement de la République Gabonaise
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default HomeParliament;
