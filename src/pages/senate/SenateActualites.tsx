import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
    Landmark, ArrowLeft, Users, Newspaper, Calendar,
    ArrowRight, Search, Crown, FileText, MapPin, Filter
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";
import InstitutionSubHeader from "@/components/layout/InstitutionSubHeader";

// Import news images (same as main Actualites)
import newsEnvironment from "@/assets/news-environment.jpg";
import newsLegislation from "@/assets/news-legislation.jpg";
import newsFinance from "@/assets/news-finance.jpg";

/**
 * Page Actualités du Sénat
 * Actualités et événements liés au Sénat de la République Gabonaise
 */
const SenateActualites = () => {
    const navigate = useNavigate();
    const { t, dir } = useLanguage();
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");

    // Categories with translation keys
    const CATEGORIES = [
        { key: "all", label: t('senate.news.categories.all') },
        { key: "collectivities", label: t('senate.news.categories.collectivities') },
        { key: "legislation", label: t('senate.news.categories.legislation') },
        { key: "provinces", label: t('senate.news.categories.provinces') },
        { key: "commissions", label: t('senate.news.categories.commissions') },
        { key: "events", label: t('senate.news.categories.events') }
    ];

    // Senate-specific news data (would come from CMS in production)
    const NEWS_DATA = [
        {
            title: "Le Sénat adopte la réforme de la décentralisation",
            excerpt: "Après des débats approfondis, le Sénat a adopté à une large majorité le projet de loi renforçant les compétences des collectivités territoriales. Cette réforme historique accorde plus d'autonomie aux provinces et départements.",
            date: "5 Déc 2025",
            category: "collectivities",
            categoryLabel: t('senate.news.categories.collectivities'),
            categoryColor: "bg-[#D19C00]",
            image: newsLegislation,
            featured: true
        },
        {
            title: "Mission sénatoriale dans le Haut-Ogooué",
            excerpt: "Une délégation de 5 sénateurs s'est rendue dans la province du Haut-Ogooué pour rencontrer les élus locaux et les maires. L'objectif : évaluer les besoins en infrastructures et les problèmes de gouvernance locale.",
            date: "2 Déc 2025",
            category: "provinces",
            categoryLabel: t('senate.news.categories.provinces'),
            categoryColor: "bg-green-600",
            image: newsEnvironment
        },
        {
            title: "Examen du budget des collectivités territoriales",
            excerpt: "La commission des finances du Sénat a entamé l'examen du budget 2026 alloué aux collectivités territoriales. Les sénateurs souhaitent augmenter la part des ressources fiscales transférées aux provinces.",
            date: "30 Nov 2025",
            category: "commissions",
            categoryLabel: t('senate.news.categories.commissions'),
            categoryColor: "bg-blue-600",
            image: newsFinance
        },
        {
            title: "Forum des élus locaux au Palais Omar Bongo",
            excerpt: "Le Sénat a organisé le premier Forum des élus locaux réunissant maires, conseillers départementaux et sénateurs. Une plateforme d'échange pour améliorer la coordination entre le Parlement et les territoires.",
            date: "28 Nov 2025",
            category: "events",
            categoryLabel: t('senate.news.categories.events'),
            categoryColor: "bg-purple-600",
            image: newsLegislation
        },
        {
            title: "Nouvelle loi sur le statut des maires",
            excerpt: "Le Sénat a transmis à l'Assemblée Nationale sa proposition de loi visant à renforcer le statut et les moyens des maires. Le texte prévoit notamment une revalorisation des indemnités et une meilleure protection juridique.",
            date: "25 Nov 2025",
            category: "legislation",
            categoryLabel: t('senate.news.categories.legislation'),
            categoryColor: "bg-indigo-600",
            image: newsLegislation
        },
        {
            title: "Coopération avec les sénats africains",
            excerpt: "Le Sénat du Gabon a signé un accord de coopération avec les chambres hautes du Cameroun et du Congo. Cet accord prévoit des échanges d'expériences sur la représentation territoriale.",
            date: "22 Nov 2025",
            category: "events",
            categoryLabel: t('senate.news.categories.events'),
            categoryColor: "bg-rose-600",
            image: newsEnvironment
        }
    ];

    const filteredNews = NEWS_DATA.filter(news => {
        const matchesSearch = news.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            news.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === "all" || news.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const featuredNews = filteredNews.find(n => n.featured) || filteredNews[0];
    const otherNews = filteredNews.filter(n => n !== featuredNews);

    const handleReadMore = (title: string) => {
        toast.info(`Lecture de : ${title}`);
    };

    return (
        <div className="min-h-screen bg-background" dir={dir}>
            {/* Unified Header */}
            <InstitutionSubHeader
                institution="SENATE"
                pageTitle={t('senate.news.header.title')}
                pageSubtitle={t('senate.news.header.subtitle')}
                pageIcon={Newspaper}
            />

            {/* Hero Section */}
            <section className="bg-gradient-to-b from-amber-50 to-background dark:from-amber-950/20 dark:to-background py-12">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <Badge className="mb-4 bg-[#D19C00]/10 text-amber-700 border-[#D19C00]/20" variant="outline">
                            <Crown className="h-3 w-3 mr-1" />
                            {t('senate.news.hero.badge')}
                        </Badge>
                        <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
                            {t('senate.news.hero.title')}
                        </h2>
                        <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
                            {t('senate.news.hero.description')}
                        </p>
                    </div>
                </div>
            </section>

            <div className="container mx-auto px-4 py-8">
                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-6 mb-10 items-center justify-between bg-card/50 backdrop-blur-sm p-4 rounded-xl border border-border/50 shadow-sm">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input
                            placeholder={t('senate.news.search.placeholder')}
                            className="pl-10 bg-background/50"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 no-scrollbar">
                        {CATEGORIES.map((cat) => (
                            <Badge
                                key={cat.key}
                                variant={selectedCategory === cat.key ? "default" : "outline"}
                                className={`cursor-pointer whitespace-nowrap px-4 py-2 text-sm transition-colors ${selectedCategory === cat.key
                                    ? "bg-[#D19C00] hover:bg-amber-700"
                                    : "hover:bg-[#D19C00]/10 hover:text-amber-700"
                                    }`}
                                onClick={() => setSelectedCategory(cat.key)}
                            >
                                {cat.label}
                            </Badge>
                        ))}
                    </div>
                </div>

                {/* Featured Article */}
                {featuredNews && (
                    <div className="mb-12">
                        <Card
                            className="overflow-hidden border-none shadow-elegant hover:shadow-xl transition-all duration-500 group cursor-pointer relative h-[350px]"
                            onClick={() => handleReadMore(featuredNews.title)}
                        >
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent z-10" />
                            <img
                                src={featuredNews.image}
                                alt={featuredNews.title}
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute bottom-0 left-0 p-8 z-20 max-w-3xl">
                                <div className="flex items-center gap-3 mb-4">
                                    <Badge className="bg-[#D19C00] text-white border-none">
                                        <Landmark className="w-3 h-3 mr-1" />
                                        {t('senate.news.featured.badge')}
                                    </Badge>
                                    <Badge variant="outline" className="text-white border-white/50">
                                        {featuredNews.categoryLabel}
                                    </Badge>
                                </div>
                                <h2 className="text-2xl md:text-3xl font-serif font-bold text-white mb-4 leading-tight group-hover:text-amber-100 transition-colors">
                                    {featuredNews.title}
                                </h2>
                                <p className="text-gray-200 text-base mb-4 line-clamp-2">
                                    {featuredNews.excerpt}
                                </p>
                                <div className="flex items-center gap-4">
                                    <span className="text-amber-200 text-sm flex items-center gap-1">
                                        <Calendar className="w-4 h-4" />
                                        {featuredNews.date}
                                    </span>
                                    <Button size="sm" className="rounded-full bg-white text-black hover:bg-gray-100 border-none">
                                        {t('senate.news.featured.readArticle')} <ArrowRight className="ml-2 w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    </div>
                )}

                {/* News Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {otherNews.map((news, index) => (
                        <Card
                            key={index}
                            className="group flex flex-col overflow-hidden hover:shadow-lg transition-all duration-300 border-border/50 bg-card/50 backdrop-blur-sm cursor-pointer"
                            onClick={() => handleReadMore(news.title)}
                        >
                            <div className="relative h-44 overflow-hidden">
                                <img
                                    src={news.image}
                                    alt={news.title}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                                <Badge className={`absolute top-3 left-3 ${news.categoryColor} text-white border-none`}>
                                    {news.categoryLabel}
                                </Badge>
                                <span className="absolute top-3 right-3 text-xs text-white flex items-center gap-1 bg-black/40 backdrop-blur-sm px-2 py-1 rounded-md">
                                    <Calendar className="w-3 h-3" />
                                    {news.date}
                                </span>
                            </div>
                            <div className="p-5 flex-1 flex flex-col">
                                <h3 className="text-lg font-bold mb-2 group-hover:text-[#D19C00] transition-colors line-clamp-2">
                                    {news.title}
                                </h3>
                                <p className="text-sm text-muted-foreground mb-4 line-clamp-3 flex-1 leading-relaxed">
                                    {news.excerpt}
                                </p>
                                <div className="pt-3 border-t border-border/50 flex justify-end mt-auto">
                                    <Button variant="ghost" size="sm" className="text-[#D19C00] group-hover:translate-x-1 transition-transform p-0 hover:bg-transparent">
                                        {t('senate.news.article.readMore')} <ArrowRight className="w-4 h-4 ml-1" />
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>

                {filteredNews.length === 0 && (
                    <div className="text-center py-20">
                        <div className="inline-flex p-4 rounded-full bg-[#D19C00]/10 dark:bg-amber-900/30 mb-4">
                            <Search className="w-8 h-8 text-[#D19C00]" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">{t('senate.news.search.noResults')}</h3>
                        <p className="text-muted-foreground mb-6">
                            {t('senate.news.search.noResultsDesc')}
                        </p>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setSearchQuery("");
                                setSelectedCategory("all");
                            }}
                            className="border-[#D19C00] text-[#D19C00] hover:bg-[#D19C00]/5"
                        >
                            {t('senate.news.search.resetFilters')}
                        </Button>
                    </div>
                )}
            </div>

            {/* Footer */}
            <footer className="bg-card border-t py-8 mt-12">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <Landmark className="h-5 w-5 text-[#D19C00]" />
                            <span className="font-serif font-semibold">{t('senate.news.footer.title')}</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <Button variant="ghost" size="sm" onClick={() => navigate("/senat")}>
                                {t('senate.news.footer.home')}
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => navigate("/senat/sensibilisation")}>
                                {t('senate.news.footer.sensibilisation')}
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => navigate("/senat/tutoriels")}>
                                {t('senate.news.footer.tutorials')}
                            </Button>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            © {new Date().getFullYear()} {t('senate.news.footer.copyright')}
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default SenateActualites;
