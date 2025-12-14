import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    Scale, Users, FileText, Calendar, BookOpen,
    ArrowRight, Newspaper, PlayCircle, ArrowLeftRight,
    MapPin, Shield, Building2, Landmark, AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import UnifiedNavbar from '@/components/navigation/UnifiedNavbar';

/**
 * Page d'accueil publique du Parlement (Congrès)
 * Thème : BLEU ROI / GRIS PIERRE (Solennel)
 */
const HomeParliament: React.FC = () => {
    const navigate = useNavigate();

    const navLinks = [
        { label: 'Congrès & Révisions', href: '/congres/sessions', icon: Scale },
        { label: 'Archives Législatives', href: '/congres/archives', icon: BookOpen },
        { label: 'Espace Élus', href: '/congres/login', icon: Users },
        { label: 'Démo Protocole', href: '/congres/demo', icon: PlayCircle },
    ];

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

    const recentLaws = [
        {
            reference: 'LOI-2024-045',
            title: 'Loi de finances pour l\'exercice 2025',
            promulgated: '10 Déc 2024',
        },
        {
            reference: 'LOI-2024-044',
            title: 'Loi portant code de la nationalité',
            promulgated: '5 Déc 2024',
        },
        {
            reference: 'LOI-2024-043',
            title: 'Loi relative à la protection de l\'environnement',
            promulgated: '28 Nov 2024',
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-100 dark:from-gray-900 dark:via-slate-900 dark:to-gray-900">
            {/* Navigation */}
            <UnifiedNavbar
                links={navLinks}
                showLogin
                loginPath="/congres/login"
            />

            {/* Hero Section - Solemn Design */}
            <section className="relative pt-24 pb-20 overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-gray-800 to-slate-900" />
                    <div className="absolute inset-0 opacity-10 bg-[url('/images/parliament-pattern.svg')] bg-repeat" />
                    <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-50 dark:from-gray-900" />
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
                        Le Parlement réunit l'Assemblée Nationale et le Sénat pour les révisions
                        constitutionnelles, les sessions conjointes et les Commissions Mixtes Paritaires.
                    </p>

                    <div className="flex flex-wrap justify-center gap-4">
                        <Button
                            size="lg"
                            className="bg-white text-slate-800 hover:bg-gray-100"
                            onClick={() => navigate('/congres/cmp')}
                        >
                            <ArrowLeftRight className="mr-2 h-4 w-4" />
                            CMP en cours
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            className="border-white/50 text-white hover:bg-white/10"
                            onClick={() => navigate('/congres/archives')}
                        >
                            <BookOpen className="mr-2 h-4 w-4" />
                            Archives législatives
                        </Button>
                    </div>

                    {/* Two Chambers */}
                    <div className="flex justify-center items-center gap-8 mt-12">
                        <div className="flex items-center gap-2 text-white/70">
                            <Building2 className="h-5 w-5" />
                            <span>143 Députés</span>
                        </div>
                        <div className="w-px h-8 bg-white/30" />
                        <div className="flex items-center gap-2 text-white/70">
                            <Landmark className="h-5 w-5" />
                            <span>102 Sénateurs</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Login Notice */}
            <section className="py-8 -mt-4 relative z-10">
                <div className="max-w-4xl mx-auto px-4">
                    <Alert className="bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800">
                        <AlertTriangle className="h-4 w-4 text-blue-600" />
                        <AlertTitle className="text-blue-800 dark:text-blue-300">
                            Espace réservé aux Parlementaires
                        </AlertTitle>
                        <AlertDescription className="text-blue-700 dark:text-blue-400">
                            Pour accéder aux fonctionnalités du Congrès et des CMP, veuillez vous identifier
                            avec votre <strong>mandat électif existant</strong> (compte Député ou Sénateur).
                            Le système détectera automatiquement vos droits de siège.
                        </AlertDescription>
                    </Alert>
                </div>
            </section>

            {/* Active CMPs */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                        <ArrowLeftRight className="h-6 w-6 text-slate-600" />
                        Commissions Mixtes Paritaires
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-8">
                        7 Députés + 7 Sénateurs négocient un texte commun lorsque les deux chambres sont en désaccord.
                    </p>

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
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm text-gray-500">
                                            Échéance : <span className="font-medium">{cmp.deadline}</span>
                                        </p>
                                        <Button variant="ghost" size="sm" className="text-slate-600">
                                            Détails <ArrowRight className="ml-1 h-4 w-4" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Legislative Archives */}
            <section className="py-16 bg-slate-50 dark:bg-slate-900/30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <BookOpen className="h-6 w-6 text-slate-600" />
                                Journal Officiel Numérique
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400 mt-1">
                                Toutes les lois promulguées de la République
                            </p>
                        </div>
                        <Button variant="outline" onClick={() => navigate('/congres/archives')}>
                            Voir tout
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {recentLaws.map((law, index) => (
                            <Card key={index} className="bg-white dark:bg-gray-800 hover:shadow-lg transition-shadow cursor-pointer">
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
                                        Promulguée le {law.promulgated}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Constitutional Sessions */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-gradient-to-br from-slate-800 to-gray-900 rounded-2xl p-8 md:p-12 text-center">
                        <Scale className="h-12 w-12 text-white/50 mx-auto mb-4" />
                        <h3 className="text-2xl font-bold text-white mb-4">
                            Sessions du Congrès
                        </h3>
                        <p className="text-white/70 max-w-2xl mx-auto mb-8">
                            Le Parlement peut être convoqué en Congrès pour les révisions constitutionnelles,
                            l'investiture du Président de la République ou les discours solennels.
                        </p>
                        <Button size="lg" className="bg-white text-slate-800 hover:bg-gray-100">
                            <Calendar className="mr-2 h-4 w-4" />
                            Calendrier des sessions
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
