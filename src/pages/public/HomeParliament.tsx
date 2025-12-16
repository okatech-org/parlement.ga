import { useState, useEffect } from "react";
import { Scale, Users, FileText, Map, Building2, Landmark, Shield, ChevronRight, BarChart3, ArrowLeftRight, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useTheme } from "next-themes";
import { useLanguage } from "@/contexts/LanguageContext";

/**
 * Page d'accueil du Parlement (Hub central)
 * Design basé sur Index.tsx avec thème Bleu/Gris solennel
 * Point d'entrée vers AN et Sénat
 */
const HomeParliament = () => {
    const navigate = useNavigate();
    const [hoveredCard, setHoveredCard] = useState<number | null>(null);
    const { theme, setTheme } = useTheme();
    const { t, language, setLanguage, dir } = useLanguage();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Institutions (Navigation Hub)
    const institutions = [
        {
            icon: Building2,
            title: t('landing.institutions.an.title'),
            description: t('landing.institutions.an.desc'),
            color: "emerald",
            path: "/an",
            bgClass: "bg-emerald-100 dark:bg-emerald-900/30",
            textClass: "text-emerald-600",
            buttonClass: "bg-emerald-600 hover:bg-emerald-700"
        },
        {
            icon: Landmark,
            title: t('landing.institutions.senate.title'),
            description: t('landing.institutions.senate.desc'),
            color: "amber",
            path: "/senat",
            bgClass: "bg-amber-100 dark:bg-amber-900/30",
            textClass: "text-amber-600",
            buttonClass: "bg-amber-600 hover:bg-amber-700"
        }
    ];

    const features = [
        {
            icon: ArrowLeftRight,
            title: t('landing.features.cmp.title'),
            description: t('landing.features.cmp.desc'),
            color: "slate",
            path: "/congres/espace/cmp"
        },
        {
            icon: Scale,
            title: t('landing.features.congress.title'),
            description: t('landing.features.congress.desc'),
            color: "slate",
            path: "/congres/sessions"
        },
        {
            icon: BookOpen,
            title: t('landing.features.jo.title'),
            description: t('landing.features.jo.desc'),
            color: "slate",
            path: "/archives"
        },
        {
            icon: BarChart3,
            title: t('landing.features.shuttle.title'),
            description: t('landing.features.shuttle.desc'),
            color: "slate",
            path: "/congres/espace/navette"
        }
    ];

    const stats = [
        { value: "245", label: t('landing.stats.members') },
        { value: "2", label: t('landing.stats.chambers') },
        { value: "150+", label: t('landing.stats.laws') },
        { value: "100%", label: t('landing.stats.digital') }
    ];

    return (
        <div className="min-h-screen bg-background" dir={dir}>
            {/* Header */}
            <header className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 backdrop-blur-sm sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Scale className="h-8 w-8 text-slate-700 dark:text-slate-300" />
                            <div>
                                <h1 className="text-xl font-serif font-bold text-foreground">{t('landing.header.title')}</h1>
                            </div>
                        </div>
                        <nav className="hidden md:flex items-center gap-4">
                            {/* Liens vers les chambres */}
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => navigate("/an")}
                                className="text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950"
                            >
                                <Building2 className="h-4 w-4 mr-1" />
                                {t('landing.header.assembly')}
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => navigate("/senat")}
                                className="text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950"
                            >
                                <Landmark className="h-4 w-4 mr-1" />
                                {t('landing.header.senate')}
                            </Button>
                            <div className="w-px h-6 bg-slate-200 dark:bg-slate-700" />
                            <Button variant="ghost" size="sm" className="text-slate-600 hover:bg-slate-100 dark:text-slate-400" onClick={() => navigate("/archives")}>
                                {t('landing.header.archives')}
                            </Button>
                            <Button variant="ghost" size="sm" className="text-slate-600 hover:bg-slate-100 dark:text-slate-400" onClick={() => navigate("/processus-comparaison")}>
                                {t('landing.header.process')}
                            </Button>
                            <Button variant="ghost" size="sm" className="text-slate-600 hover:bg-slate-100 dark:text-slate-400" onClick={() => navigate("/parlement/demo")}>
                                {t('landing.header.demo')}
                            </Button>
                        </nav>
                        <div className="flex items-center gap-2">
                            {/* Language Selector */}
                            <select
                                className="text-sm border border-slate-200 dark:border-slate-700 rounded-md px-2 py-1 bg-background cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
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
                                className="text-slate-600 hover:bg-slate-100"
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
                            <Button variant="outline" size="sm" className="border-slate-400 text-slate-600 hover:bg-slate-50" onClick={() => navigate("/parlement/login")}>
                                {t('landing.header.login')}
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-slate-800 via-gray-800 to-slate-900">
                <div className="absolute inset-0 opacity-10 bg-[url('/images/parliament-pattern.svg')] bg-repeat"></div>
                <div className="container mx-auto px-4 py-20 relative">
                    <div className="max-w-4xl mx-auto text-center">
                        <Badge className="mb-4 bg-white/20 text-white border-white/30" variant="outline">
                            <Shield className="h-3 w-3 mr-1" />
                            {t('landing.hero.badge')}
                        </Badge>
                        <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6 animate-fade-in text-white">
                            {t('landing.hero.title')}
                        </h1>
                        <p className="text-xl text-white/70 mb-8 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: "0.1s" }}>
                            {t('landing.hero.desc')}
                        </p>
                        <div className="flex gap-4 justify-center animate-fade-in" style={{ animationDelay: "0.2s" }}>
                            <Button size="lg" className="shadow-lg bg-white text-slate-800 hover:bg-gray-100" onClick={() => navigate("/cmp")}>
                                <ArrowLeftRight className="mr-2 h-5 w-5" />
                                {t('landing.hero.btnCMP')}
                                <ChevronRight className="ml-2 h-5 w-5" />
                            </Button>
                            <Button size="lg" variant="outline" className="border-white/50 text-white hover:bg-white/10" onClick={() => navigate("/archives")}>
                                <BookOpen className="mr-2 h-5 w-5" />
                                {t('landing.hero.btnArchives')}
                            </Button>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-4xl mx-auto">
                        {stats.map((stat, index) => (
                            <Card
                                key={index}
                                className="p-6 text-center bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-300 animate-fade-in"
                                style={{ animationDelay: `${0.3 + index * 0.1}s` }}
                            >
                                <div className="text-3xl font-serif font-bold text-white mb-2">{stat.value}</div>
                                <div className="text-sm text-white/70">{stat.label}</div>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Institutions Navigation Hub */}
            <section className="py-20 bg-slate-50 dark:bg-slate-950/30">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-serif font-bold mb-4 text-slate-900 dark:text-slate-100">{t('landing.institutions.title')}</h2>
                        <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                            {t('landing.institutions.subtitle')}
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                        {institutions.map((inst, index) => {
                            const Icon = inst.icon;
                            return (
                                <Card
                                    key={index}
                                    className="overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 border-0 animate-fade-in"
                                    style={{ animationDelay: `${index * 0.1}s` }}
                                    onClick={() => navigate(inst.path)}
                                >
                                    {/* Colored Header */}
                                    <div className={`${inst.buttonClass} p-6 text-white`}>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center">
                                                    <Icon className="h-7 w-7" />
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-bold">{inst.title}</h3>
                                                </div>
                                            </div>
                                            <ChevronRight className="h-6 w-6 opacity-60" />
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-6 bg-white dark:bg-slate-900">
                                        <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">
                                            {inst.description}
                                        </p>
                                        <Button className={`w-full ${inst.buttonClass} text-white`}>
                                            {t('landing.institutions.access')}
                                            <ChevronRight className="ml-2 h-4 w-4" />
                                        </Button>
                                    </div>
                                </Card>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="py-20 bg-white dark:bg-background">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-serif font-bold mb-4 text-slate-900 dark:text-slate-100">{t('landing.features.title')}</h2>
                        <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                            {t('landing.features.subtitle')}
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
                        {features.map((feature, index) => {
                            const Icon = feature.icon;
                            return (
                                <Card
                                    key={index}
                                    className="p-6 bg-white dark:bg-slate-950/20 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border-slate-200/50 dark:border-slate-800/50 animate-slide-in-right"
                                    style={{ animationDelay: `${index * 0.1}s` }}
                                    onMouseEnter={() => setHoveredCard(index)}
                                    onMouseLeave={() => setHoveredCard(null)}
                                    onClick={() => navigate(feature.path)}
                                >
                                    <div className={`w-12 h-12 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4 transition-transform duration-300 ${hoveredCard === index ? 'scale-110' : ''}`}>
                                        <Icon className="h-6 w-6 text-slate-600 dark:text-slate-400" />
                                    </div>
                                    <h3 className="text-lg font-serif font-semibold mb-2 text-slate-900 dark:text-slate-100">{feature.title}</h3>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">{feature.description}</p>
                                    <ChevronRight className={`h-5 w-5 text-slate-400 mt-4 transition-transform duration-300 ${hoveredCard === index ? 'translate-x-2' : ''}`} />
                                </Card>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Security Banner */}
            <section className="py-16 bg-slate-100 dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-center gap-8 flex-wrap">
                        <div className="flex items-center gap-3">
                            <Shield className="h-8 w-8 text-slate-600" />
                            <div>
                                <div className="font-semibold text-slate-900 dark:text-slate-100">{t('landing.security.maxSecurity')}</div>
                                <div className="text-sm text-slate-600 dark:text-slate-400">{t('landing.security.encryption')}</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Users className="h-8 w-8 text-slate-600" />
                            <div>
                                <div className="font-semibold text-slate-900 dark:text-slate-100">{t('landing.security.auth2fa')}</div>
                                <div className="text-sm text-slate-600 dark:text-slate-400">{t('landing.security.secureAccess')}</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Scale className="h-8 w-8 text-slate-600" />
                            <div>
                                <div className="font-semibold text-slate-900 dark:text-slate-100">{t('landing.security.sovereignty')}</div>
                                <div className="text-sm text-slate-600 dark:text-slate-400">{t('landing.security.dataLoc')}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-slate-900 text-slate-100 py-12">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-3 gap-8">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <Scale className="h-6 w-6 text-slate-400" />
                                <span className="font-serif font-bold">{t('landing.footer.parliament')}</span>
                            </div>
                            <p className="text-sm text-slate-400">
                                © {new Date().getFullYear()} {t('landing.footer.copyright')}
                            </p>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4 text-slate-200">{t('landing.footer.chambers')}</h4>
                            <ul className="space-y-2 text-sm text-slate-400">
                                <li><a href="/an" className="hover:text-slate-200 transition-colors flex items-center gap-2"><Building2 className="h-4 w-4" /> {t('landing.institutions.an.title')}</a></li>
                                <li><a href="/senat" className="hover:text-slate-200 transition-colors flex items-center gap-2"><Landmark className="h-4 w-4" /> {t('landing.institutions.senate.title')}</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4 text-slate-200">{t('landing.footer.contact')}</h4>
                            <p className="text-sm text-slate-400">
                                Libreville, Gabon<br />
                                contact@parlement.ga
                            </p>
                        </div>
                    </div>
                    <div className="border-t border-slate-800 mt-8 pt-8 text-center">
                        <div className="flex justify-center items-center gap-4 mb-4">
                            <Building2 className="h-5 w-5 text-slate-500" />
                            <Scale className="h-6 w-6 text-slate-400" />
                            <Landmark className="h-5 w-5 text-slate-500" />
                        </div>
                        <p className="text-sm text-slate-400">
                            {t('landing.footer.motto')}
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default HomeParliament;
