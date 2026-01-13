import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    Building2, Landmark, Scale, ArrowRight,
    Sparkles, Shield, BookOpen, Users
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { INSTITUTIONS, InstitutionType } from '@/contexts/InstitutionContext';

/**
 * Portail de la République - Page d'accueil principale
 * Permet de choisir entre les 3 institutions parlementaires
 */
const PortalRepublic: React.FC = () => {
    const navigate = useNavigate();

    const institutions = [
        {
            ...INSTITUTIONS.ASSEMBLY,
            icon: Building2,
            subtitle: 'Chambre basse du Parlement',
            location: 'Palais Léon Mba, Libreville',
            deputies: 145,
            gradient: 'from-emerald-500 to-green-600',
            hoverGradient: 'hover:from-emerald-600 hover:to-green-700',
            shadowColor: 'shadow-emerald-500/30',
        },
        {
            ...INSTITUTIONS.SENATE,
            icon: Landmark,
            subtitle: 'Chambre haute du Parlement',
            location: 'Palais Omar Bongo Ondimba, Libreville',
            deputies: 102,
            gradient: 'from-amber-500 to-yellow-600',
            hoverGradient: 'hover:from-amber-600 hover:to-yellow-700',
            shadowColor: 'shadow-amber-500/30',
        },
        {
            ...INSTITUTIONS.PARLIAMENT,
            icon: Scale,
            subtitle: 'Réunion des deux chambres',
            location: 'Siège du Congrès',
            deputies: 245,
            gradient: 'from-slate-600 to-gray-700',
            hoverGradient: 'hover:from-slate-700 hover:to-gray-800',
            shadowColor: 'shadow-slate-500/30',
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            {/* Header */}
            <header className="absolute top-0 left-0 right-0 z-10 p-6">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <img
                            src="/images/gabon-coat-of-arms.png"
                            alt="Armoiries du Gabon"
                            className="h-12 w-12 object-contain"
                            onError={(e) => {
                                e.currentTarget.style.display = 'none';
                            }}
                        />
                        <div>
                            <h1 className="text-xl font-bold text-gray-800 dark:text-white">
                                Parlement.ga
                            </h1>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                République Gabonaise
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link
                            to="/login"
                            className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                        >
                            Espace Élus
                        </Link>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto">

                    {/* Hero Section */}
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 dark:bg-amber-900/30 rounded-full text-amber-700 dark:text-amber-300 text-sm font-medium mb-6">
                            <Sparkles className="h-4 w-4" />
                            Démocratie Numérique Gabonaise
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                            Portail du{' '}
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 via-amber-500 to-slate-600">
                                Parlement
                            </span>
                        </h1>
                        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
                            Bienvenue sur la plateforme numérique officielle des institutions parlementaires
                            de la République Gabonaise. Accédez aux travaux législatifs, suivez les débats
                            et participez à la vie démocratique.
                        </p>
                    </div>

                    {/* Institution Cards */}
                    <div className="grid md:grid-cols-3 gap-6 mb-16">
                        {institutions.map((inst) => {
                            const Icon = inst.icon;
                            return (
                                <Card
                                    key={inst.id}
                                    className={`group cursor-pointer overflow-hidden border-0 shadow-xl ${inst.shadowColor} transition-all duration-500 hover:scale-105 hover:shadow-2xl`}
                                    onClick={() => navigate(inst.basePath)}
                                >
                                    {/* Gradient Header */}
                                    <div className={`h-32 bg-gradient-to-br ${inst.gradient} relative overflow-hidden`}>
                                        <div className="absolute inset-0 bg-black/10" />
                                        <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <Icon className="h-16 w-16 text-white/90" />
                                        </div>
                                    </div>

                                    <CardContent className="p-6">
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                                            {inst.name}
                                        </h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                                            {inst.subtitle}
                                        </p>

                                        <div className="space-y-2 mb-6">
                                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                                                <Shield className="h-4 w-4 text-gray-400" />
                                                <span>{inst.location}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                                                <Users className="h-4 w-4 text-gray-400" />
                                                <span>{inst.deputies} {inst.id === 'PARLIAMENT' ? 'parlementaires' : inst.id === 'ASSEMBLY' ? 'députés' : 'sénateurs'}</span>
                                            </div>
                                        </div>

                                        <Button
                                            className={`w-full bg-gradient-to-r ${inst.gradient} ${inst.hoverGradient} text-white group-hover:shadow-lg transition-all`}
                                        >
                                            Accéder
                                            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                        </Button>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>

                    {/* Info Section */}
                    <div className="grid md:grid-cols-3 gap-8 mb-16">
                        <div className="text-center p-6">
                            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                                <BookOpen className="h-7 w-7 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                                Travaux Législatifs
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Suivez en temps réel les projets et propositions de loi en débat
                            </p>
                        </div>

                        <div className="text-center p-6">
                            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                                <Users className="h-7 w-7 text-amber-600 dark:text-amber-400" />
                            </div>
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                                Vos Élus
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Découvrez les profils et activités de vos représentants
                            </p>
                        </div>

                        <div className="text-center p-6">
                            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-slate-100 dark:bg-slate-900/30 flex items-center justify-center">
                                <Scale className="h-7 w-7 text-slate-600 dark:text-slate-400" />
                            </div>
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                                Transparence
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Accédez aux archives et votes parlementaires
                            </p>
                        </div>
                    </div>

                    {/* Motto */}
                    <div className="text-center">
                        <div className="inline-block px-8 py-4 bg-gradient-to-r from-emerald-50 via-amber-50 to-slate-50 dark:from-emerald-950/30 dark:via-amber-950/30 dark:to-slate-950/30 rounded-2xl">
                            <p className="text-lg font-medium text-gray-700 dark:text-gray-300 italic">
                                "Union - Travail - Justice"
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                Devise de la République Gabonaise
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="py-8 px-4 bg-gray-100 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
                <div className="max-w-6xl mx-auto text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        © {new Date().getFullYear()} Parlement de la République Gabonaise.
                        Tous droits réservés.
                    </p>
                    <div className="flex items-center justify-center gap-6 mt-4">
                        <Link to="/mentions-legales" className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                            Mentions légales
                        </Link>
                        <Link to="/accessibilite" className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                            Accessibilité
                        </Link>
                        <Link to="/contact" className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                            Contact
                        </Link>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default PortalRepublic;
