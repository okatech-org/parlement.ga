import { useState, useEffect } from "react";
import {
    Landmark, Users, FileText, Map, Crown, Shield, ChevronRight, BarChart3, Scale,
    ArrowLeftRight, MapPin, MessageSquare, CheckCircle, Send, Clock, PlayCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useTheme } from "next-themes";
import { useLanguage } from "@/contexts/LanguageContext";

/**
 * Page d'accueil du Sénat
 * Design basé sur Index.tsx avec les MÊMES couleurs que l'AN (primary/vert)
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
            color: "primary",
            path: "/senat/collectivites"
        },
        {
            icon: FileText,
            title: "Examen des Lois",
            description: "Seconde lecture et amendements des textes votés par l'Assemblée.",
            color: "secondary",
            path: "/senat/legislation"
        },
        {
            icon: Map,
            title: "9 Provinces",
            description: "Chaque province du Gabon est représentée au Sénat.",
            color: "accent",
            path: "/senat/provinces"
        },
        {
            icon: BarChart3,
            title: "Statistiques",
            description: "Travaux législatifs et activités des sénateurs en temps réel.",
            color: "primary",
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
            {/* Header - Mêmes couleurs que AN */}
            <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Landmark className="h-8 w-8 text-primary" />
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
                            <div className="w-px h-6 bg-border" />
                            <Button variant="ghost" size="sm" onClick={() => navigate("/senat/actualites")}>
                                Actualités
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => navigate("/senat/sensibilisation")}>
                                Sensibilisation
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => navigate("/senat/tutoriels")}>
                                Tutoriels
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => navigate("/senat/processus")}>
                                Processus
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => navigate("/senat/demo")}>
                                Démo
                            </Button>
                        </nav>
                        <div className="flex items-center gap-2">
                            {/* Language Selector */}
                            <select
                                className="text-sm border border-border rounded-md px-2 py-1 bg-background cursor-pointer hover:bg-muted transition-colors"
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
                                title="Changer le thème"
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
                            <Button variant="outline" size="sm" onClick={() => navigate("/senat/login")}>
                                Connexion
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Hero Section - Mêmes couleurs que AN */}
            <section className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-hero opacity-10"></div>
                <div className="container mx-auto px-4 py-20 relative">
                    <div className="max-w-4xl mx-auto text-center">
                        <Badge className="mb-4 bg-primary/10 text-primary border-primary/20" variant="outline">
                            <Crown className="h-3 w-3 mr-1" />
                            Chambre haute du Parlement
                        </Badge>
                        <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6 animate-fade-in">
                            La voix des territoires
                        </h1>
                        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: "0.1s" }}>
                            Le Sénat représente les collectivités territoriales de la République.
                            Nos 102 sénateurs œuvrent pour l'équilibre institutionnel.
                        </p>
                        <div className="flex gap-4 justify-center animate-fade-in" style={{ animationDelay: "0.2s" }}>
                            <Button size="lg" className="shadow-elegant" onClick={() => navigate("/senat/travaux")}>
                                <FileText className="mr-2 h-5 w-5" />
                                Travaux en cours
                                <ChevronRight className="ml-2 h-5 w-5" />
                            </Button>
                            <Button size="lg" variant="outline" onClick={() => navigate("/senat/senateurs")}>
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
                                className="p-6 text-center bg-card shadow-card-custom border-border/50 hover:shadow-elegant transition-all duration-300 animate-fade-in"
                                style={{ animationDelay: `${0.3 + index * 0.1}s` }}
                            >
                                <div className="text-3xl font-serif font-bold text-primary mb-2">{stat.value}</div>
                                <div className="text-sm text-muted-foreground">{stat.label}</div>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Resources Section */}
            <section className="py-20 bg-gradient-subtle">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-serif font-bold mb-4">Ressources</h2>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Découvrez les activités et ressources du Sénat
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                        <Card
                            className="p-8 bg-card shadow-card-custom hover:shadow-elegant transition-all duration-300 cursor-pointer border-red-600/20 animate-fade-in"
                            onClick={() => navigate("/senat/actualites")}
                        >
                            <div className="w-16 h-16 rounded-full bg-red-600/10 flex items-center justify-center mb-4 mx-auto">
                                <FileText className="h-8 w-8 text-red-600" />
                            </div>
                            <h3 className="text-xl font-serif font-semibold mb-3 text-center">Actualités</h3>
                            <p className="text-sm text-muted-foreground text-center mb-4">
                                Les dernières nouvelles et décisions du Sénat
                            </p>
                            <Button className="w-full shadow-elegant bg-red-600 hover:bg-red-700">
                                Consulter
                                <ChevronRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Card>

                        <Card
                            className="p-8 bg-card shadow-card-custom hover:shadow-elegant transition-all duration-300 cursor-pointer border-amber-600/20 animate-fade-in"
                            style={{ animationDelay: "0.1s" }}
                            onClick={() => navigate("/senat/sensibilisation")}
                        >
                            <div className="w-16 h-16 rounded-full bg-amber-600/10 flex items-center justify-center mb-4 mx-auto">
                                <Users className="h-8 w-8 text-amber-600" />
                            </div>
                            <h3 className="text-xl font-serif font-semibold mb-3 text-center">Sensibilisation</h3>
                            <p className="text-sm text-muted-foreground text-center mb-4">
                                Comprendre le rôle du Sénat et des sénateurs
                            </p>
                            <Button className="w-full shadow-elegant bg-amber-600 hover:bg-amber-700">
                                Découvrir
                                <ChevronRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Card>

                        <Card
                            className="p-8 bg-card shadow-card-custom hover:shadow-elegant transition-all duration-300 cursor-pointer border-indigo-600/20 animate-fade-in"
                            style={{ animationDelay: "0.2s" }}
                            onClick={() => navigate("/senat/tutoriels")}
                        >
                            <div className="w-16 h-16 rounded-full bg-indigo-600/10 flex items-center justify-center mb-4 mx-auto">
                                <BarChart3 className="h-8 w-8 text-indigo-600" />
                            </div>
                            <h3 className="text-xl font-serif font-semibold mb-3 text-center">Tutoriels</h3>
                            <p className="text-sm text-muted-foreground text-center mb-4">
                                Guides pratiques pour utiliser la plateforme
                            </p>
                            <Button variant="outline" className="w-full shadow-elegant border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white">
                                Apprendre
                                <ChevronRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="py-20 bg-muted/30">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-serif font-bold mb-4">Fonctionnalités</h2>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Explorez les outils numériques du Sénat
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
                        {features.map((feature, index) => {
                            const Icon = feature.icon;
                            return (
                                <Card
                                    key={index}
                                    className="p-6 bg-card shadow-card-custom hover:shadow-elegant transition-all duration-300 cursor-pointer border-border/50 animate-slide-in-right"
                                    style={{ animationDelay: `${index * 0.1}s` }}
                                    onMouseEnter={() => setHoveredCard(index)}
                                    onMouseLeave={() => setHoveredCard(null)}
                                    onClick={() => navigate(feature.path)}
                                >
                                    <div className={`w-12 h-12 rounded-lg bg-${feature.color}/10 flex items-center justify-center mb-4 transition-transform duration-300 ${hoveredCard === index ? 'scale-110' : ''}`}>
                                        <Icon className={`h-6 w-6 text-${feature.color}`} />
                                    </div>
                                    <h3 className="text-lg font-serif font-semibold mb-2">{feature.title}</h3>
                                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                                    <ChevronRight className={`h-5 w-5 text-muted-foreground mt-4 transition-transform duration-300 ${hoveredCard === index ? 'translate-x-2' : ''}`} />
                                </Card>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Protocole Législatif du Sénat */}
            <section className="py-20 bg-gradient-to-br from-primary/5 to-primary/10">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <Badge className="mb-4 bg-primary/10 text-primary border-primary/20" variant="outline">
                            <ArrowLeftRight className="h-3 w-3 mr-1" />
                            Navette Parlementaire
                        </Badge>
                        <h2 className="text-4xl font-serif font-bold mb-4">Protocole Législatif du Sénat</h2>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Délai constitutionnel de 20 jours pour l'examen des textes
                        </p>
                    </div>

                    {/* Fonctionnalités clés */}
                    <div className="grid md:grid-cols-3 gap-6 mb-16 max-w-5xl mx-auto">
                        <Card className="border-t-4 border-t-primary">
                            <CardHeader>
                                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                                    <ArrowLeftRight className="h-6 w-6 text-primary" />
                                </div>
                                <CardTitle className="text-lg">Navette Parlementaire</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2 text-sm text-muted-foreground">
                                <div className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" />Textes reçus avec délai de 20 jours</div>
                                <div className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" />Priorité aux textes sur les collectivités</div>
                                <div className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" />Suivi en temps réel de la navette</div>
                            </CardContent>
                        </Card>

                        <Card className="border-t-4 border-t-amber-500">
                            <CardHeader>
                                <div className="w-12 h-12 rounded-lg bg-amber-500/10 flex items-center justify-center mb-2">
                                    <MapPin className="h-6 w-6 text-amber-500" />
                                </div>
                                <CardTitle className="text-lg">Lien avec les Territoires</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2 text-sm text-muted-foreground">
                                <div className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" />Doléances des maires et conseillers</div>
                                <div className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" />Rapports de visites terrain</div>
                                <div className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" />Carte interactive des 9 provinces</div>
                            </CardContent>
                        </Card>

                        <Card className="border-t-4 border-t-blue-500">
                            <CardHeader>
                                <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-2">
                                    <Scale className="h-6 w-6 text-blue-500" />
                                </div>
                                <CardTitle className="text-lg">Commission Mixte Paritaire</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2 text-sm text-muted-foreground">
                                <div className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" />Composition 7+7 membres</div>
                                <div className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" />Négociation du texte commun</div>
                                <div className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" />Procédure de conciliation</div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Processus d'examen */}
                    <Card className="max-w-4xl mx-auto">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Clock className="h-5 w-5 text-primary" />
                                Processus d'examen d'un texte
                            </CardTitle>
                            <CardDescription>De la réception à la transmission</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                                {[
                                    { step: 1, title: "Réception", icon: FileText, duration: "Jour 1" },
                                    { step: 2, title: "Commission", icon: Users, duration: "J 2-10" },
                                    { step: 3, title: "Plénière", icon: MessageSquare, duration: "J 11-15" },
                                    { step: 4, title: "Vote", icon: CheckCircle, duration: "J 16-20" },
                                    { step: 5, title: "Transmission", icon: Send, duration: "Après vote" },
                                ].map((item, index) => {
                                    const Icon = item.icon;
                                    return (
                                        <div key={item.step} className="relative text-center">
                                            <div className="w-12 h-12 mx-auto rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold mb-2">
                                                {item.step}
                                            </div>
                                            <Icon className="h-5 w-5 mx-auto text-muted-foreground mb-1" />
                                            <h4 className="font-medium text-sm">{item.title}</h4>
                                            <Badge variant="outline" className="text-xs mt-1">{item.duration}</Badge>
                                            {index < 4 && (
                                                <div className="hidden md:block absolute top-6 left-[60%] w-[80%] h-0.5 bg-primary/20" />
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>

                    {/* CTA */}
                    <div className="text-center mt-12">
                        <Button size="lg" onClick={() => navigate("/senat/demo")}>
                            <PlayCircle className="mr-2 h-5 w-5" />
                            Essayer la démo
                            <ChevronRight className="ml-2 h-5 w-5" />
                        </Button>
                    </div>
                </div>
            </section>

            {/* Security Banner */}
            <section className="py-16 bg-card border-y border-border">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-center gap-8 flex-wrap">
                        <div className="flex items-center gap-3">
                            <Shield className="h-8 w-8 text-primary" />
                            <div>
                                <div className="font-semibold">Sécurité maximale</div>
                                <div className="text-sm text-muted-foreground">Chiffrement bout-en-bout</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Users className="h-8 w-8 text-secondary" />
                            <div>
                                <div className="font-semibold">Authentification 2FA</div>
                                <div className="text-sm text-muted-foreground">Accès sécurisé</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Landmark className="h-8 w-8 text-accent" />
                            <div>
                                <div className="font-semibold">Souveraineté</div>
                                <div className="text-sm text-muted-foreground">Données localisées</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-card border-t border-border py-12">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-3 gap-8">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <Landmark className="h-6 w-6 text-primary" />
                                <span className="font-serif font-bold">Sénat</span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                © {new Date().getFullYear()} Sénat de la République Gabonaise
                            </p>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Liens rapides</h4>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li><a href="/senat/senateurs" className="hover:text-primary transition-colors">Nos Sénateurs</a></li>
                                <li><a href="/senat/travaux" className="hover:text-primary transition-colors">Travaux législatifs</a></li>
                                <li><a href="/senat/collectivites" className="hover:text-primary transition-colors">Collectivités</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Contact</h4>
                            <p className="text-sm text-muted-foreground">
                                Palais Omar Bongo Ondimba<br />
                                Libreville, Gabon
                            </p>
                        </div>
                    </div>
                    <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
                        © {new Date().getFullYear()} Sénat de la République Gabonaise. Tous droits réservés.
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default HomeSenate;
