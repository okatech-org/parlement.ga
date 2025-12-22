import { useState, useEffect } from "react";
import {
    Search, BookOpen, FileText, Calendar, Download,
    Filter, ChevronRight, ExternalLink, Landmark, Scale,
    Clock, CheckCircle, ArrowRight, Building, Users, Menu, Shield
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "next-themes";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import newsParliamentHero from "@/assets/news-parliament-hero.jpg";

/**
 * Archives Nationales - Journal Officiel Numérique
 * Design unifié avec HomeParliament
 */
const NationalArchives = () => {
    const navigate = useNavigate();
    const { t, language, setLanguage, dir } = useLanguage();
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [legislatureFilter, setLegislatureFilter] = useState("all");
    const [typeFilter, setTypeFilter] = useState("all");
    const [domainFilter, setDomainFilter] = useState("all");

    useEffect(() => {
        setMounted(true);
    }, []);

    const openInNewTab = (path: string) => {
        window.open(path, '_blank', 'noopener,noreferrer');
    };

    const mobileNavItems = [
        { label: t('landing.header.assembly'), path: "/an", icon: Building },
        { label: t('landing.header.senate'), path: "/senat", icon: Landmark },
        { label: t('landing.header.archives'), path: "/archives" },
        { label: t('landing.header.process'), path: "/processus-comparaison" },
        { label: t('landing.header.demo'), path: "/parlement/demo" },
    ];

    // Données simulées des archives
    const archiveItems = [
        {
            id: "1",
            reference: "Loi n°2024-015",
            title: "Loi de finances pour l'exercice 2024",
            shortTitle: "LF 2024",
            type: "LAW",
            domains: ["FINANCES", "BUDGET"],
            adoptedAt: "15 décembre 2023",
            promulgatedAt: "28 décembre 2023",
            publishedAt: "30 décembre 2023",
            originChamber: "ASSEMBLY",
            legislature: 14,
            journalNumber: "JO n°2023-52",
            timeline: [
                { step: "depositAN", date: "10 oct.", icon: "deposit", chamber: "ASSEMBLY" },
                { step: "adoptedAN", date: "25 nov.", icon: "vote", chamber: "ASSEMBLY" },
                { step: "transmisSenat", date: "26 nov.", icon: "transfer", chamber: "JOINT" },
                { step: "adoptedSenat", date: "10 déc.", icon: "vote", chamber: "SENATE" },
                { step: "conforme", date: "10 déc.", icon: "check", chamber: "JOINT" },
                { step: "promulgated", date: "28 déc.", icon: "promulgation", chamber: "JOINT" },
            ],
        },
        {
            id: "2",
            reference: "Loi n°2024-008",
            title: "Loi portant modification du Code de la décentralisation",
            shortTitle: "Code Décentralisation",
            type: "LAW",
            domains: ["DÉCENTRALISATION", "COLLECTIVITÉS"],
            translatedDomains: ["decentralization", "collectivites"],
            adoptedAt: "5 juin 2024",
            promulgatedAt: "20 juin 2024",
            publishedAt: "25 juin 2024",
            originChamber: "SENATE",
            legislature: 14,
            journalNumber: "JO n°2024-26",
            timeline: [
                { step: "depositSenat", date: "15 mars", icon: "deposit", chamber: "SENATE" },
                { step: "adoptedSenat", date: "10 avr.", icon: "vote", chamber: "SENATE" },
                { step: "transmisAN", date: "11 avr.", icon: "transfer", chamber: "JOINT" },
                { step: "amendedAN", date: "5 mai", icon: "amendment", chamber: "ASSEMBLY" },
                { step: "cmp", date: "15 mai", icon: "cmp", chamber: "JOINT" },
                { step: "accordCMP", date: "20 mai", icon: "check", chamber: "JOINT" },
                { step: "promulgated", date: "20 juin", icon: "promulgation", chamber: "JOINT" },
            ],
        },
        {
            id: "3",
            reference: "Loi constitutionnelle n°2023-002",
            title: "Révision constitutionnelle relative à l'autonomie des collectivités territoriales",
            shortTitle: "Révision Art. 47",
            type: "CONSTITUTION",
            domains: ["CONSTITUTION", "DÉCENTRALISATION"],
            translatedDomains: ["constitution", "decentralization"],
            adoptedAt: "15 mars 2023",
            promulgatedAt: "20 mars 2023",
            publishedAt: "22 mars 2023",
            originChamber: "JOINT",
            legislature: 14,
            journalNumber: "JO n°2023-12",
            timeline: [
                { step: "initiativeGouv", date: "5 janv.", icon: "deposit", chamber: "ASSEMBLY" },
                { step: "adoptedAN", date: "20 fév.", icon: "vote", chamber: "ASSEMBLY" },
                { step: "adoptedSenat", date: "5 mars", icon: "vote", chamber: "SENATE" },
                { step: "congress35", date: "15 mars", icon: "congress", chamber: "JOINT" },
                { step: "adopted67", date: "15 mars", icon: "check", chamber: "JOINT" },
                { step: "promulgated", date: "20 mars", icon: "promulgation", chamber: "JOINT" },
            ],
        },
    ];

    // Filtrage
    const filteredItems = archiveItems.filter(item => {
        if (searchQuery && !item.title.toLowerCase().includes(searchQuery.toLowerCase())
            && !item.reference.toLowerCase().includes(searchQuery.toLowerCase())) {
            return false;
        }
        if (legislatureFilter !== "all" && item.legislature !== parseInt(legislatureFilter)) {
            return false;
        }
        if (typeFilter !== "all" && item.type !== typeFilter) {
            return false;
        }
        return true;
    });

    const getTypeLabel = (type: string) => {
        switch (type) {
            case "LAW": return t('congress.archives.search.types.law');
            case "CONSTITUTION": return t('congress.archives.search.types.constitution');
            case "DECREE": return t('congress.archives.search.types.decree');
            case "RESOLUTION": return t('congress.archives.search.types.resolution');
            default: return type;
        }
    };

    const getChamberColor = (chamber: string) => {
        switch (chamber) {
            case "ASSEMBLY": return "bg-[#3A87FD] text-white";
            case "SENATE": return "bg-[#D19C00] text-white";
            case "JOINT": return "bg-slate-700 text-white";
            default: return "bg-slate-500 text-white";
        }
    };

    const getChamberIcon = (chamber: string) => {
        switch (chamber) {
            case "ASSEMBLY": return <Building className="h-3 w-3" />;
            case "SENATE": return <Users className="h-3 w-3" />;
            case "JOINT": return <Scale className="h-3 w-3" />;
            default: return null;
        }
    };

    const stats = [
        { value: "1,500+", label: "Lois promulguées" },
        { value: "52", label: "Journaux Officiels / an" },
        { value: "14", label: "Législatures" },
        { value: "100%", label: "Numérisé" }
    ];

    return (
        <div className="min-h-screen bg-background" dir={dir}>
            {/* Header - Same as HomeParliament */}
            <header className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 backdrop-blur-sm sticky top-0 z-50">
                <div className="container mx-auto px-4 py-3 sm:py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 sm:gap-3 cursor-pointer" onClick={() => navigate("/")}>
                            <Scale className="h-6 w-6 sm:h-8 sm:w-8 text-slate-700 dark:text-slate-300" />
                            <div>
                                <h1 className="text-base sm:text-xl font-serif font-bold text-foreground">{t('landing.header.title')}</h1>
                            </div>
                        </div>

                        {/* Desktop Navigation */}
                        <nav className="hidden lg:flex items-center gap-4">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openInNewTab("/an")}
                                className="text-[#3A87FD] hover:bg-[#3A87FD]/10"
                            >
                                <Building className="h-4 w-4 mr-1" />
                                {t('landing.header.assembly')}
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openInNewTab("/senat")}
                                className="text-[#D19C00] hover:bg-[#D19C00]/10"
                            >
                                <Landmark className="h-4 w-4 mr-1" />
                                {t('landing.header.senate')}
                            </Button>
                            <div className="w-px h-6 bg-slate-200 dark:bg-slate-700" />
                            <Button variant="ghost" size="sm" className="text-slate-600 hover:bg-slate-100 dark:text-slate-400 bg-slate-100 dark:bg-slate-800" onClick={() => navigate("/archives")}>
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
                            <select
                                className="hidden sm:block text-sm border border-slate-200 dark:border-slate-700 rounded-md px-2 py-1 bg-background cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
                                value={language}
                                onChange={(e) => setLanguage(e.target.value as any)}
                            >
                                <option value="fr">🇫🇷 FR</option>
                                <option value="en">🇬🇧 EN</option>
                                <option value="es">🇪🇸 ES</option>
                                <option value="ar">🇸🇦 AR</option>
                                <option value="pt">🇵🇹 PT</option>
                            </select>

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

                            <Button variant="outline" size="sm" className="hidden sm:flex border-slate-400 text-slate-600 hover:bg-slate-50" onClick={() => navigate("/parlement/login")}>
                                {t('landing.header.login')}
                            </Button>

                            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                                <SheetTrigger asChild className="lg:hidden">
                                    <Button variant="ghost" size="sm">
                                        <Menu className="h-5 w-5" />
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="right" className="w-[280px] sm:w-[350px]">
                                    <div className="flex flex-col gap-4 mt-8">
                                        {mobileNavItems.map((item) => (
                                            <Button
                                                key={item.path}
                                                variant="ghost"
                                                className="w-full justify-start"
                                                onClick={() => {
                                                    if (item.path === '/an' || item.path === '/senat') {
                                                        openInNewTab(item.path);
                                                    } else {
                                                        navigate(item.path);
                                                    }
                                                    setMobileMenuOpen(false);
                                                }}
                                            >
                                                {item.icon && <item.icon className="h-4 w-4 mr-2" />}
                                                {item.label}
                                            </Button>
                                        ))}
                                        <div className="border-t pt-4">
                                            <Button
                                                className="w-full"
                                                onClick={() => { navigate("/parlement/login"); setMobileMenuOpen(false); }}
                                            >
                                                {t('landing.header.login')}
                                            </Button>
                                        </div>
                                    </div>
                                </SheetContent>
                            </Sheet>
                        </div>
                    </div>
                </div>
            </header>

            {/* Hero Section with Image */}
            <section className="relative overflow-hidden">
                <div className="absolute inset-0">
                    <img 
                        src={newsParliamentHero} 
                        alt="Archives Nationales du Gabon"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-800/70 to-slate-900/90"></div>
                </div>
                <div className="container mx-auto px-4 py-16 sm:py-20 relative">
                    <div className="max-w-4xl mx-auto text-center">
                        <Badge className="mb-4 bg-white/20 text-white border-white/30" variant="outline">
                            <BookOpen className="h-3 w-3 mr-1" />
                            Journal Officiel Numérique
                        </Badge>
                        <h1 className="text-3xl sm:text-5xl font-serif font-bold mb-4 sm:mb-6 animate-fade-in text-white">
                            {t('congress.archives.header.title')}
                        </h1>
                        <p className="text-base sm:text-xl text-white/70 mb-6 sm:mb-8 max-w-2xl mx-auto animate-fade-in px-4" style={{ animationDelay: "0.1s" }}>
                            {t('congress.archives.header.subtitle')}
                        </p>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6 mt-8 max-w-4xl mx-auto">
                        {stats.map((stat, index) => (
                            <Card
                                key={index}
                                className="p-4 sm:p-6 text-center bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-300 animate-fade-in"
                                style={{ animationDelay: `${0.3 + index * 0.1}s` }}
                            >
                                <div className="text-2xl sm:text-3xl font-serif font-bold text-white mb-1 sm:mb-2">{stat.value}</div>
                                <div className="text-xs sm:text-sm text-white/70">{stat.label}</div>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Search Section */}
            <section className="py-8 bg-slate-50 dark:bg-slate-950/30">
                <div className="container mx-auto px-4">
                    <Card className="shadow-lg border-0">
                        <CardContent className="p-6">
                            <div className="flex flex-col lg:flex-row gap-4">
                                <div className="flex-1 relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                                    <Input
                                        placeholder={t('congress.archives.search.placeholder')}
                                        className="pl-10 h-12 text-lg"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                                <div className="flex gap-2 flex-wrap">
                                    <Select value={legislatureFilter} onValueChange={setLegislatureFilter}>
                                        <SelectTrigger className="w-[150px]">
                                            <SelectValue placeholder={t('congress.archives.search.filters.legislature')} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">{t('congress.archives.search.filters.all')}</SelectItem>
                                            <SelectItem value="14">XIVème</SelectItem>
                                            <SelectItem value="13">XIIIème</SelectItem>
                                            <SelectItem value="12">XIIème</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                                        <SelectTrigger className="w-[150px]">
                                            <SelectValue placeholder={t('congress.archives.search.filters.type')} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">{t('congress.archives.search.filters.allTypes')}</SelectItem>
                                            <SelectItem value="LAW">{t('congress.archives.search.types.law')}</SelectItem>
                                            <SelectItem value="CONSTITUTION">{t('congress.archives.search.types.constitution')}</SelectItem>
                                            <SelectItem value="DECREE">{t('congress.archives.search.types.decree')}</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Select value={domainFilter} onValueChange={setDomainFilter}>
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue placeholder={t('congress.archives.search.filters.domain')} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">{t('congress.archives.search.filters.allDomains')}</SelectItem>
                                            <SelectItem value="FINANCES">{t('congress.archives.search.domains.finance')}</SelectItem>
                                            <SelectItem value="DÉCENTRALISATION">{t('congress.archives.search.domains.decentralization')}</SelectItem>
                                            <SelectItem value="ÉDUCATION">{t('congress.archives.search.domains.education')}</SelectItem>
                                            <SelectItem value="ENVIRONNEMENT">{t('congress.archives.search.domains.environment')}</SelectItem>
                                            <SelectItem value="CONSTITUTION">{t('congress.archives.search.domains.constitution')}</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* Results Section */}
            <section className="py-8">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-foreground">
                            {filteredItems.length} {t('congress.archives.results.found')}
                        </h2>
                    </div>

                    <div className="space-y-6">
                        {filteredItems.map((item) => (
                            <Card key={item.id} className="hover:shadow-xl transition-shadow overflow-hidden border-0 shadow-md">
                                <div className="grid lg:grid-cols-3">
                                    <div className="lg:col-span-2 p-6">
                                        <div className="flex items-start justify-between mb-3">
                                            <div>
                                                <div className="flex items-center gap-2 mb-2 flex-wrap">
                                                    <Badge className={cn(
                                                        item.type === "CONSTITUTION" ? "bg-amber-500" : "bg-[#3A87FD]"
                                                    )}>
                                                        {getTypeLabel(item.type)}
                                                    </Badge>
                                                    <Badge variant="outline">{item.reference}</Badge>
                                                    <Badge variant="secondary">{item.journalNumber}</Badge>
                                                </div>
                                                <h3 className="text-xl font-bold text-foreground mb-2">{item.title}</h3>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {item.translatedDomains ? item.translatedDomains.map((domainKey, i) => (
                                                <Badge key={i} variant="outline" className="text-xs">
                                                    {/* @ts-ignore */}
                                                    {t(`congress.archives.search.domains.${domainKey}`) || domainKey}
                                                </Badge>
                                            )) : item.domains.map((domain, i) => (
                                                <Badge key={i} variant="outline" className="text-xs">
                                                    {domain}
                                                </Badge>
                                            ))}
                                        </div>

                                        <div className="grid grid-cols-3 gap-4 text-sm">
                                            <div>
                                                <p className="text-muted-foreground">{t('congress.archives.results.adopted')}</p>
                                                <p className="font-medium">{item.adoptedAt}</p>
                                            </div>
                                            <div>
                                                <p className="text-muted-foreground">{t('congress.archives.results.promulgated')}</p>
                                                <p className="font-medium">{item.promulgatedAt}</p>
                                            </div>
                                            <div>
                                                <p className="text-muted-foreground">{t('congress.archives.results.legislature')}</p>
                                                <p className="font-medium">{item.legislature}ème</p>
                                            </div>
                                        </div>

                                        <div className="flex gap-2 mt-4">
                                            <Button variant="outline" size="sm">
                                                <FileText className="h-4 w-4 mr-1" />
                                                {t('congress.archives.results.read')}
                                            </Button>
                                            <Button variant="outline" size="sm">
                                                <Download className="h-4 w-4 mr-1" />
                                                {t('congress.archives.results.download')}
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="bg-slate-100 dark:bg-slate-800 p-6 border-l">
                                        <h4 className="font-bold text-sm mb-4 flex items-center gap-2">
                                            <Clock className="h-4 w-4" />
                                            {t('congress.archives.results.timeline.title')}
                                        </h4>
                                        <div className="space-y-3">
                                            {item.timeline.map((step, i) => (
                                                <div key={i} className="flex items-center gap-3">
                                                    <div className={cn(
                                                        "w-6 h-6 rounded-full flex items-center justify-center text-[10px]",
                                                        getChamberColor(step.chamber)
                                                    )}>
                                                        {getChamberIcon(step.chamber)}
                                                    </div>
                                                    <div className="flex-1 flex items-center justify-between">
                                                        {/* @ts-ignore */}
                                                        <span className="text-sm font-medium">{t(`congress.archives.results.timeline.${step.step}`)}</span>
                                                        <span className="text-xs text-muted-foreground">{step.date}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="mt-4 pt-4 border-t border-border/50">
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                <span className="flex items-center gap-1">
                                                    <span className="w-3 h-3 rounded-full bg-[#3A87FD]" /> AN
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <span className="w-3 h-3 rounded-full bg-[#D19C00]" /> Sénat
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <span className="w-3 h-3 rounded-full bg-slate-700" /> Conjoint
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-slate-900 text-slate-300 py-12 mt-8">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-3 gap-8 mb-8">
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <Scale className="h-8 w-8 text-white" />
                                <div>
                                    <h3 className="font-serif font-bold text-white text-lg">Parlement du Gabon</h3>
                                    <p className="text-slate-400 text-sm">Archives Nationales</p>
                                </div>
                            </div>
                            <p className="text-sm text-slate-400">
                                Le Journal Officiel numérique de la République Gabonaise. Accédez à l'ensemble des textes législatifs promulgués.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-bold text-white mb-4">Liens Rapides</h4>
                            <ul className="space-y-2 text-sm">
                                <li><button onClick={() => navigate("/")} className="hover:text-white transition-colors">Accueil</button></li>
                                <li><button onClick={() => navigate("/processus-comparaison")} className="hover:text-white transition-colors">Processus Législatif</button></li>
                                <li><button onClick={() => openInNewTab("/an")} className="hover:text-white transition-colors">Assemblée Nationale</button></li>
                                <li><button onClick={() => openInNewTab("/senat")} className="hover:text-white transition-colors">Sénat</button></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold text-white mb-4">Contact</h4>
                            <p className="text-sm text-slate-400">
                                Boulevard Triomphal<br />
                                Libreville, Gabon<br />
                                contact@parlement.ga
                            </p>
                        </div>
                    </div>
                    <div className="border-t border-slate-800 pt-6 text-center">
                        <p className="text-xs text-slate-500">
                            © 2024 Parlement de la République Gabonaise • Union - Travail - Justice
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default NationalArchives;
