import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Newspaper, Calendar, ArrowRight, Home, Sun, Moon, Search, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import InstitutionSubHeader from "@/components/layout/InstitutionSubHeader";
import newsHeroImage from "@/assets/news-parliament-hero.jpg";
import newsEnvironment from "@/assets/news-environment.jpg";
import newsLegislation from "@/assets/news-legislation.jpg";
import newsFinance from "@/assets/news-finance.jpg";
import newsInnovation from "@/assets/news-innovation.jpg";
import newsInternational from "@/assets/news-international.jpg";
import newsDemocracy from "@/assets/news-democracy.jpg";

const Actualites = () => {
    const navigate = useNavigate();
    const { theme, setTheme } = useTheme();
    const { t, dir } = useLanguage();
    const [searchQuery, setSearchQuery] = useState("");
    const CATEGORIES = [
        t('news.categories.all'),
        t('news.categories.finance'),
        t('news.categories.environment'),
        t('news.categories.legislation'),
        t('news.categories.publicSession'),
        t('news.categories.international'),
        t('news.categories.innovation'),
        t('news.categories.democracy')
    ];

    const [selectedCategory, setSelectedCategory] = useState<string>(t('news.categories.all'));

    const NEWS_DATA = [
        {
            title: t('news.items.commission.title'),
            excerpt: t('news.items.commission.excerpt'),
            date: "30 Nov 2025",
            category: t('news.categories.environment'),
            categoryColor: "bg-green-600",
            image: newsEnvironment
        },
        {
            title: t('news.items.reform.title'),
            excerpt: t('news.items.reform.excerpt'),
            date: "28 Nov 2025",
            category: t('news.categories.legislation'),
            categoryColor: "bg-blue-600",
            image: newsLegislation
        },
        {
            title: t('news.items.budget.title'),
            excerpt: t('news.items.budget.excerpt'),
            date: "25 Nov 2025",
            category: t('news.categories.finance'),
            categoryColor: "bg-amber-600",
            image: newsFinance
        },
        {
            title: t('news.items.digital.title'),
            excerpt: t('news.items.digital.excerpt'),
            date: "22 Nov 2025",
            category: t('news.categories.innovation'),
            categoryColor: "bg-purple-600",
            image: newsInnovation
        },
        {
            title: t('news.items.diplomacy.title'),
            excerpt: t('news.items.diplomacy.excerpt'),
            date: "20 Nov 2025",
            category: t('news.categories.international'),
            categoryColor: "bg-indigo-600",
            image: newsInternational
        },
        {
            title: t('news.items.youth.title'),
            excerpt: t('news.items.youth.excerpt'),
            date: "18 Nov 2025",
            category: t('news.categories.democracy'),
            categoryColor: "bg-rose-600",
            image: newsDemocracy
        }
    ];

    const filteredNews = NEWS_DATA.filter(news => {
        const matchesSearch = news.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            news.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === t('news.categories.all') || news.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const handleReadMore = (title: string) => {
        toast.info(`${t('common.reading')} : ${title}`);
    };

    return (
        <div className="min-h-screen bg-background transition-colors duration-300" dir={dir}>
            {/* Unified Header */}
            <InstitutionSubHeader
                institution="AN"
                pageTitle={t('news.title')}
                pageSubtitle={t('news.subtitle')}
                pageIcon={Newspaper}
            />

            <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
                {/* Featured Article */}
                <div className="mb-10 sm:mb-16 animate-fade-in">
                    <Card className="overflow-hidden border-none shadow-elegant hover:shadow-xl transition-all duration-500 group cursor-pointer relative h-[280px] sm:h-[400px]">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent z-10" />
                        <img
                            src={newsHeroImage}
                            alt="Featured"
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute bottom-0 left-0 p-4 sm:p-8 z-20 max-w-3xl">
                            <Badge className="mb-3 sm:mb-4 bg-[#3A87FD] text-[#3A87FD]-foreground hover:bg-[#3A87FD]/90 border-none">
                                {t('news.featured')}
                            </Badge>
                            <h2 className="text-xl sm:text-3xl md:text-4xl font-bold text-white mb-2 sm:mb-4 leading-tight group-hover:text-[#3A87FD]-foreground/90 transition-colors">
                                {t('news.featuredTitle')}
                            </h2>
                            <p className="text-gray-200 text-sm sm:text-lg mb-4 sm:mb-6 line-clamp-2">
                                {t('news.featuredDesc')}
                            </p>
                            <Button size="lg" className="rounded-full bg-white text-black hover:bg-gray-100 border-none">
                                {t('common.readArticle')} <ArrowRight className="ml-2 w-4 h-4" />
                            </Button>
                        </div>
                    </Card>
                </div>

                {/* Filters */}
                <div className="flex flex-col gap-4 sm:gap-6 mb-8 sm:mb-12 sticky top-16 z-30 bg-background/80 backdrop-blur-md p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-border/50 shadow-sm">
                    <div className="relative w-full sm:w-auto md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input
                            placeholder={t('news.searchPlaceholder')}
                            className="pl-10 bg-background/50"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar -mx-1 px-1">
                        {CATEGORIES.map((cat) => (
                            <Badge
                                key={cat}
                                variant={selectedCategory === cat ? "default" : "outline"}
                                className="cursor-pointer whitespace-nowrap px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm hover:bg-[#3A87FD]/10 hover:text-[#3A87FD] transition-colors flex-shrink-0"
                                onClick={() => setSelectedCategory(cat)}
                            >
                                {cat}
                            </Badge>
                        ))}
                    </div>
                </div>

                {/* News Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredNews.map((news, index) => (
                        <Card
                            key={index}
                            className="group flex flex-col overflow-hidden hover:shadow-elegant transition-all duration-300 border-border/50 bg-card/50 backdrop-blur-sm cursor-pointer"
                            onClick={() => handleReadMore(news.title)}
                        >
                            <div className="relative h-48 overflow-hidden">
                                <img
                                    src={news.image}
                                    alt={news.title}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                                <Badge className={`absolute top-3 left-3 ${news.categoryColor} text-white border-none`}>
                                    {news.category}
                                </Badge>
                                <span className="absolute top-3 right-3 text-xs text-white flex items-center gap-1 bg-black/40 backdrop-blur-sm px-2 py-1 rounded-md">
                                    <Calendar className="w-3 h-3" />
                                    {news.date}
                                </span>
                            </div>
                            <div className="p-6 flex-1 flex flex-col">
                                <h3 className="text-xl font-bold mb-3 group-hover:text-[#3A87FD] transition-colors line-clamp-2">
                                    {news.title}
                                </h3>

                                <p className="text-sm text-muted-foreground mb-6 line-clamp-3 flex-1 leading-relaxed">
                                    {news.excerpt}
                                </p>

                                <div className="pt-4 border-t border-border/50 flex justify-end mt-auto">
                                    <Button variant="ghost" size="sm" className="text-[#3A87FD] group-hover:translate-x-1 transition-transform p-0 hover:bg-transparent">
                                        {t('common.readArticle')} <ArrowRight className="w-4 h-4 ml-1" />
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>

                {filteredNews.length === 0 && (
                    <div className="text-center py-20">
                        <div className="inline-flex p-4 rounded-full bg-muted mb-4">
                            <Search className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">{t('news.noResults')}</h3>
                        <p className="text-muted-foreground mb-6">
                            {t('news.tryAdjusting')}
                        </p>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setSearchQuery("");
                                setSelectedCategory(t('news.categories.all'));
                            }}
                        >
                            {t('news.resetFilters')}
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Actualites;
