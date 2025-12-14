import { useState, useEffect } from "react";
import { Landmark, Users, FileText, Map, Crown, Shield, ChevronRight, BarChart3, Scale, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useTheme } from "next-themes";
import { useLanguage } from "@/contexts/LanguageContext";

/**
 * Page d'accueil du Sénat
 * Design basé sur Index.tsx avec thème Or/Ambre
 */
const HomeSenate = () => {
    const navigate = useNavigate();
    const [hoveredCard, setHoveredCard] = useState<number | null>(null);
    const { theme, setTheme } = useTheme();
    const { t, language, setLanguage, dir } = useLanguage();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const features = [
        {
            icon: Crown,
            title: "Représentation Territoriale",
            description: "Les sénateurs représentent les collectivités territoriales de la Nation.",
            color: "amber",
            path: "/senat/collectivites"
        },
        {
            icon: FileText,
            title: "Examen des Lois",
            description: "Seconde lecture et amendements des textes votés par l'Assemblée.",
            color: "amber",
            path: "/senat/legislation"
        },
        {
            icon: Map,
            title: "9 Provinces",
            description: "Chaque province du Gabon est représentée au Sénat.",
            color: "amber",
            path: "/senat/provinces"
        },
        {
            icon: BarChart3,
            title: "Statistiques",
            description: "Travaux législatifs et activités des sénateurs en temps réel.",
            color: "amber",
            path: "/senat/statistiques"
        }
    ];

    const stats = [
        { value: "102", label: "Sénateurs" },
        { value: "9", label: "Provinces" },
        { value: "45+", label: "Textes examinés" },
        { value: "100%", label: "Numérique" }
    ];

    return (
        <div className="min-h-screen bg-background" dir={dir}>
            {/* Header */}
            <header className="border-b border-amber-200 dark:border-amber-900 bg-amber-50/50 dark:bg-amber-950/20 backdrop-blur-sm sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Landmark className="h-8 w-8 text-amber-600" />
                            <div>
                                <h1 className="text-xl font-serif font-bold text-foreground">Sénat</h1>
                            </div>
                        </div>
                        <nav className="hidden md:flex items-center gap-4">
                            {/* Lien retour vers Parlement (hub central) */}
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => navigate("/")}
                                className="border-slate-300 text-slate-600 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300"
                            >
                                <Scale className="h-4 w-4 mr-1" />
                                Parlement
                            </Button>
                            <div className="w-px h-6 bg-amber-200 dark:bg-amber-800" />
                            <Button variant="ghost" size="sm" className="text-amber-700 hover:bg-amber-100 dark:text-amber-300" onClick={() => navigate("/senat/actualites")}>
                                Actualités
                            </Button>
                            <Button variant="ghost" size="sm" className="text-amber-700 hover:bg-amber-100 dark:text-amber-300" onClick={() => navigate("/senat/sensibilisation")}>
                                Sensibilisation
                            </Button>
                            <Button variant="ghost" size="sm" className="text-amber-700 hover:bg-amber-100 dark:text-amber-300" onClick={() => navigate("/senat/tutoriels")}>
                                Tutoriels
                            </Button>
                            <Button variant="ghost" size="sm" className="text-amber-700 hover:bg-amber-100 dark:text-amber-300" onClick={() => navigate("/senat/demo")}>
                                Démo Protocole
                            </Button>
                        </nav>
                        <div className="flex items-center gap-2">
                            {/* Language Selector */}
                            <select
                                className="text-sm border border-amber-200 dark:border-amber-800 rounded-md px-2 py-1 bg-background cursor-pointer hover:bg-amber-50 dark:hover:bg-amber-950 transition-colors"
                                value={language}
                                onChange={(e) => setLanguage(e.target.value as any)}
                            >
                                <option value="fr">🇫🇷 Français</option>
                                <option value="en">🇬🇧 English</option>
                                <option value="es">🇪🇸 Español</option>
                                <option value="ar">🇸🇦 العربية</option>
                                <option value="pt">🇵🇹 Português</option>
                            </select>

                            {/* Theme Toggle */}
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-amber-600 hover:bg-amber-100"
                                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                            >
                                {mounted && theme === "dark" ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="12" cy="12" r="5"></circle>
                                        <line x1="12" y1="1" x2="12" y2="3"></line>
                                        <line x1="12" y1="21" x2="12" y2="23"></line>
                                        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                                        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                                        <line x1="1" y1="12" x2="3" y2="12"></line>
                                        <line x1="21" y1="12" x2="23" y2="12"></line>
                                        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                                        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                                    </svg>
                                )}
                            </Button>

                            {/* Login Button */}
                            <Button variant="outline" size="sm" className="border-amber-600 text-amber-600 hover:bg-amber-50" onClick={() => navigate("/senat/login")}>
                                Connexion
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-white to-yellow-50 dark:from-amber-950/20 dark:via-background dark:to-yellow-950/20">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 to-yellow-500/5"></div>
                <div className="container mx-auto px-4 py-20 relative">
                    <div className="max-w-4xl mx-auto text-center">
                        <Badge className="mb-4 bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800" variant="outline">
                            <Crown className="h-3 w-3 mr-1" />
                            Chambre haute du Parlement
                        </Badge>
                        <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6 animate-fade-in text-amber-900 dark:text-amber-50">
                            La voix des territoires
                        </h1>
                        <p className="text-xl text-amber-800/70 dark:text-amber-200/70 mb-8 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: "0.1s" }}>
                            Le Sénat représente les collectivités territoriales de la République.
                            Nos 102 sénateurs œuvrent pour l'équilibre institutionnel.
                        </p>
                        <div className="flex gap-4 justify-center animate-fade-in" style={{ animationDelay: "0.2s" }}>
                            <Button size="lg" className="shadow-lg bg-amber-600 hover:bg-amber-700 text-white" onClick={() => navigate("/senat/travaux")}>
                                <FileText className="mr-2 h-5 w-5" />
                                Travaux en cours
                                <ChevronRight className="ml-2 h-5 w-5" />
                            </Button>
                            <Button size="lg" variant="outline" className="border-amber-600 text-amber-600 hover:bg-amber-50" onClick={() => navigate("/senat/senateurs")}>
                                <Users className="mr-2 h-5 w-5" />
                                Nos Sénateurs
                            </Button>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-4xl mx-auto">
                        {stats.map((stat, index) => (
                            <Card
                                key={index}
                                className="p-6 text-center bg-white dark:bg-amber-950/20 shadow-lg border-amber-200/50 dark:border-amber-800/50 hover:shadow-xl transition-all duration-300 animate-fade-in"
                                style={{ animationDelay: `${0.3 + index * 0.1}s` }}
                            >
                                <div className="text-3xl font-serif font-bold text-amber-600 mb-2">{stat.value}</div>
                                <div className="text-sm text-amber-800/70 dark:text-amber-300/70">{stat.label}</div>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Resources Section */}
            <section className="py-20 bg-amber-50/50 dark:bg-amber-950/10">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-serif font-bold mb-4 text-amber-900 dark:text-amber-100">Ressources</h2>
                        <p className="text-xl text-amber-800/70 dark:text-amber-200/70 max-w-2xl mx-auto">
                            Découvrez les activités et ressources du Sénat
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                        <Card
                            className="p-8 bg-white dark:bg-amber-950/20 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border-amber-200/50 animate-fade-in"
                            onClick={() => navigate("/senat/actualites")}
                        >
                            <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mb-4 mx-auto">
                                <FileText className="h-8 w-8 text-amber-600" />
                            </div>
                            <h3 className="text-xl font-serif font-semibold mb-3 text-center text-amber-900 dark:text-amber-100">Actualités</h3>
                            <p className="text-sm text-amber-700/70 dark:text-amber-300/70 text-center mb-4">
                                Les dernières nouvelles et décisions du Sénat
                            </p>
                            <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white">
                                Consulter
                                <ChevronRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Card>

                        <Card
                            className="p-8 bg-white dark:bg-amber-950/20 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border-amber-200/50 animate-fade-in"
                            style={{ animationDelay: "0.1s" }}
                            onClick={() => navigate("/senat/sensibilisation")}
                        >
                            <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mb-4 mx-auto">
                                <Users className="h-8 w-8 text-amber-600" />
                            </div>
                            <h3 className="text-xl font-serif font-semibold mb-3 text-center text-amber-900 dark:text-amber-100">Sensibilisation</h3>
                            <p className="text-sm text-amber-700/70 dark:text-amber-300/70 text-center mb-4">
                                Comprendre le rôle du Sénat et des sénateurs
                            </p>
                            <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white">
                                Découvrir
                                <ChevronRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Card>

                        <Card
                            className="p-8 bg-white dark:bg-amber-950/20 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border-amber-200/50 animate-fade-in"
                            style={{ animationDelay: "0.2s" }}
                            onClick={() => navigate("/senat/tutoriels")}
                        >
                            <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mb-4 mx-auto">
                                <BarChart3 className="h-8 w-8 text-amber-600" />
                            </div>
                            <h3 className="text-xl font-serif font-semibold mb-3 text-center text-amber-900 dark:text-amber-100">Tutoriels</h3>
                            <p className="text-sm text-amber-700/70 dark:text-amber-300/70 text-center mb-4">
                                Guides pratiques pour utiliser la plateforme
                            </p>
                            <Button variant="outline" className="w-full border-amber-600 text-amber-600 hover:bg-amber-50">
                                Apprendre
                                <ChevronRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="py-20 bg-white dark:bg-background">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-serif font-bold mb-4 text-amber-900 dark:text-amber-100">Fonctionnalités</h2>
                        <p className="text-xl text-amber-800/70 dark:text-amber-200/70 max-w-2xl mx-auto">
                            Explorez les outils numériques du Sénat
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
                        {features.map((feature, index) => {
                            const Icon = feature.icon;
                            return (
                                <Card
                                    key={index}
                                    className="p-6 bg-white dark:bg-amber-950/10 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border-amber-200/50 animate-slide-in-right"
                                    style={{ animationDelay: `${index * 0.1}s` }}
                                    onMouseEnter={() => setHoveredCard(index)}
                                    onMouseLeave={() => setHoveredCard(null)}
                                    onClick={() => navigate(feature.path)}
                                >
                                    <div className={`w-12 h-12 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mb-4 transition-transform duration-300 ${hoveredCard === index ? 'scale-110' : ''}`}>
                                        <Icon className="h-6 w-6 text-amber-600" />
                                    </div>
                                    <h3 className="text-lg font-serif font-semibold mb-2 text-amber-900 dark:text-amber-100">{feature.title}</h3>
                                    <p className="text-sm text-amber-700/70 dark:text-amber-300/70">{feature.description}</p>
                                    <ChevronRight className={`h-5 w-5 text-amber-400 mt-4 transition-transform duration-300 ${hoveredCard === index ? 'translate-x-2' : ''}`} />
                                </Card>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Security Banner */}
            <section className="py-16 bg-amber-100/50 dark:bg-amber-950/20 border-y border-amber-200 dark:border-amber-800">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-center gap-8 flex-wrap">
                        <div className="flex items-center gap-3">
                            <Shield className="h-8 w-8 text-amber-600" />
                            <div>
                                <div className="font-semibold text-amber-900 dark:text-amber-100">Sécurité maximale</div>
                                <div className="text-sm text-amber-700/70 dark:text-amber-300/70">Chiffrement bout-en-bout</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Users className="h-8 w-8 text-amber-600" />
                            <div>
                                <div className="font-semibold text-amber-900 dark:text-amber-100">Authentification 2FA</div>
                                <div className="text-sm text-amber-700/70 dark:text-amber-300/70">Accès sécurisé</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Landmark className="h-8 w-8 text-amber-600" />
                            <div>
                                <div className="font-semibold text-amber-900 dark:text-amber-100">Souveraineté</div>
                                <div className="text-sm text-amber-700/70 dark:text-amber-300/70">Données localisées</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-amber-900 dark:bg-amber-950 text-amber-100 py-12">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-3 gap-8">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <Landmark className="h-6 w-6 text-amber-400" />
                                <span className="font-serif font-bold">Sénat</span>
                            </div>
                            <p className="text-sm text-amber-300/70">
                                © {new Date().getFullYear()} Sénat de la République Gabonaise
                            </p>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4 text-amber-200">Liens rapides</h4>
                            <ul className="space-y-2 text-sm text-amber-300/70">
                                <li><a href="/senat/senateurs" className="hover:text-amber-200 transition-colors">Nos Sénateurs</a></li>
                                <li><a href="/senat/travaux" className="hover:text-amber-200 transition-colors">Travaux législatifs</a></li>
                                <li><a href="/senat/collectivites" className="hover:text-amber-200 transition-colors">Collectivités</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4 text-amber-200">Contact</h4>
                            <p className="text-sm text-amber-300/70">
                                Palais Omar Bongo Ondimba<br />
                                Libreville, Gabon
                            </p>
                        </div>
                    </div>
                    <div className="border-t border-amber-800 mt-8 pt-8 text-center text-sm text-amber-300/70">
                        © {new Date().getFullYear()} Sénat de la République Gabonaise. Tous droits réservés.
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default HomeSenate;
